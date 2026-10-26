import test from "node:test";
import assert from "node:assert/strict";
import * as XState from "xstate";

import { classifyDashboardError, createDashboardMachine } from "../dashboard-machine.js";

const periodsResult = {
  periods: [
    { year: 2026, month: 1, label: "1/26", eventCount: 1, available: true },
    { year: 2026, month: 2, label: "2/26", eventCount: 1, available: true }
  ],
  selectedPeriod: { year: 2026, month: 2, label: "2/26", eventCount: 1, available: true }
};

test("XState lifecycle waits for host, exposes recoverable timeout, then reaches ready", async () => {
  const visited = [];
  const machine = createDashboardMachine(XState, {
    createClient: () => ({ id: "client" }),
    loadPeriods: async () => periodsResult,
    loadDashboard: async () => ({ isEmpty: false, marker: "ready" }),
    now: () => new Date("2026-08-20T10:00:00Z")
  });
  const service = XState.interpret(machine).onTransition((state) => visited.push(state.value)).start();

  assert.equal(service.state.value, "awaitingHost");
  service.send("HOST_TIMEOUT");
  assert.equal(service.state.value, "awaitingHost");
  assert.equal(service.state.context.hostTimedOut, true);

  service.send({ type: "HOST_CONTEXT_RECEIVED", context: { marker: "host" } });
  const ready = await waitForState(service, (state) => state.matches("ready"));
  assert.equal(ready.context.data.marker, "ready");
  assert.equal(ready.context.selectedPeriod.month, 2);
  assert.ok(visited.includes("loadingPeriods"));
  assert.ok(visited.includes("loadingDashboard"));
  service.stop();
});

test("valid empty period result and empty dashboard result transition to empty", async (t) => {
  await t.test("no periods", async () => {
    const service = makeService({
      loadPeriods: async () => ({ periods: [], selectedPeriod: null }),
      loadDashboard: async () => { throw new Error("must not run"); }
    });
    service.send({ type: "HOST_CONTEXT_RECEIVED", context: {} });
    const state = await waitForState(service, (current) => current.matches("empty"));
    assert.equal(state.context.emptyReason, "periods");
    service.stop();
  });

  await t.test("selected month has no events", async () => {
    const service = makeService({
      loadPeriods: async () => periodsResult,
      loadDashboard: async () => ({ isEmpty: true })
    });
    service.send({ type: "HOST_CONTEXT_RECEIVED", context: {} });
    const state = await waitForState(service, (current) => current.matches("empty"));
    assert.equal(state.context.emptyReason, "dashboard");
    service.stop();
  });
});

for (const [error, expected] of [
  [{ status: 400, kind: "http", dataset: "summary" }, "badRequest"],
  [{ status: 401, kind: "http", dataset: "summary" }, "unauthorized"],
  [{ status: 403, kind: "http", dataset: "summary" }, "forbidden"],
  [{ status: 500, kind: "http", dataset: "summary" }, "serverError"],
  [{ status: null, kind: "network", dataset: "summary" }, "networkError"],
  [{ status: 200, kind: "invalid-response", dataset: "summary" }, "invalidResponse"]
]) {
  test(`XState transitions a ${error.kind}/${error.status ?? "none"} failure to ${expected}`, async () => {
    const service = makeService({
      loadPeriods: async () => periodsResult,
      loadDashboard: async () => { throw error; }
    });
    service.send({ type: "HOST_CONTEXT_RECEIVED", context: {} });
    const state = await waitForState(service, (current) => current.matches(expected));
    assert.equal(state.context.error.dataset, "summary");
    assert.equal(classifyDashboardError(error), expected);
    service.stop();
  });
}

test("changing month aborts the superseded request and stale completion cannot replace current data", async () => {
  const requests = [];
  const machine = createDashboardMachine(XState, {
    createClient: () => ({}),
    loadPeriods: async () => periodsResult,
    loadDashboard: (_client, period, { signal }) => new Promise((resolve) => {
      requests.push({ period, signal, resolve });
    })
  });
  const service = XState.interpret(machine).start();
  service.send({ type: "HOST_CONTEXT_RECEIVED", context: {} });
  await waitUntil(() => requests.length === 1);
  assert.equal(requests[0].period.month, 2);

  service.send({ type: "MONTH_CHANGED", month: 1 });
  await waitUntil(() => requests.length === 2);
  assert.equal(requests[0].signal.aborted, true);
  assert.equal(requests[1].period.month, 1);

  requests[0].resolve({ isEmpty: false, marker: "stale" });
  await Promise.resolve();
  assert.equal(service.state.value, "loadingDashboard");
  requests[1].resolve({ isEmpty: false, marker: "current" });
  const ready = await waitForState(service, (state) => state.matches("ready"));
  assert.equal(ready.context.data.marker, "current");
  assert.equal(ready.context.selectedPeriod.month, 1);
  service.stop();
});

test("period selection transitions choose the latest available month in a changed year", async () => {
  const selectionHistory = [];
  const result = {
    periods: [
      { year: 2025, month: 12, label: "12/25", eventCount: 1, available: true },
      ...periodsResult.periods
    ],
    selectedPeriod: periodsResult.selectedPeriod
  };
  const service = makeService({
    loadPeriods: async () => result,
    loadDashboard: async (_client, period) => {
      selectionHistory.push(`${period.year}-${period.month}`);
      return { isEmpty: false };
    }
  });
  service.send({ type: "HOST_CONTEXT_RECEIVED", context: {} });
  await waitForState(service, (state) => state.matches("ready"));
  service.send({ type: "YEAR_CHANGED", year: 2025 });
  const changed = await waitForState(service, (state) => state.matches("ready") && state.context.selectedPeriod.year === 2025);
  assert.equal(changed.context.selectedPeriod.month, 12);
  assert.deepEqual(selectionHistory, ["2026-2", "2025-12"]);
  service.stop();
});

test("arbitrary ranges supersede in-flight work and reject invalid changes without requests", async () => {
  const requests = [];
  const service = makeService({ loadPeriods: async () => periodsResult,
    loadDashboard: (_client, selection, { signal }) => new Promise((resolve) => requests.push({ selection, signal, resolve })) });
  service.send({ type: "HOST_CONTEXT_RECEIVED", context: {} });
  await waitUntil(() => requests.length === 1);
  const firstRange = { fromDate: "2025-12-20", toDate: "2026-02-03" };
  const lastRange = { fromDate: "2024-02-29", toDate: "2024-02-29" };
  service.send({ type: "RANGE_APPLIED", range: firstRange });
  await waitUntil(() => requests.length === 2);
  service.send({ type: "RANGE_APPLIED", range: { fromDate: "2026-03-02", toDate: "2026-01-01" } });
  await Promise.resolve();
  assert.equal(requests.length, 2);
  service.send({ type: "RANGE_APPLIED", range: lastRange });
  await waitUntil(() => requests.length === 3);
  assert.equal(requests[0].signal.aborted, true);
  assert.equal(requests[1].signal.aborted, true);
  assert.deepEqual(requests[2].selection, lastRange);
  requests[2].resolve({ isEmpty: false, marker: "latest range" });
  await waitForState(service, (state) => state.matches("ready"));
  requests[0].resolve({ isEmpty: false, marker: "old month" });
  requests[1].resolve({ isEmpty: false, marker: "old range" });
  await new Promise((resolve) => setTimeout(resolve, 0));
  assert.equal(service.state.context.data.marker, "latest range");
  assert.deepEqual(service.state.context.selectedRange, lastRange);
  service.stop();
});

test("a range can be applied after empty period discovery and survives host re-entry", async () => {
  const selections = [];
  const service = makeService({ loadPeriods: async () => ({ periods: [], selectedPeriod: null }),
    loadDashboard: async (_client, selection) => { selections.push(selection); return { isEmpty: true }; } });
  service.send({ type: "HOST_CONTEXT_RECEIVED", context: {} });
  await waitForState(service, (state) => state.matches("empty"));
  const range = { fromDate: "1999-12-01", toDate: "2001-01-31" };
  service.send({ type: "RANGE_APPLIED", range });
  await waitForState(service, (state) => state.matches("empty") && state.context.emptyReason === "dashboard");
  service.send({ type: "HOST_CONTEXT_RECEIVED", context: { generation: "new" } });
  await waitForState(service, (state) => state.matches("empty") && selections.length === 2);
  assert.deepEqual(selections, [range, range]);
  service.stop();
});

function makeService({ loadPeriods, loadDashboard }) {
  const machine = createDashboardMachine(XState, {
    createClient: () => ({}),
    loadPeriods,
    loadDashboard
  });
  return XState.interpret(machine).start();
}

function waitForState(service, predicate, timeout = 1000) {
  if (predicate(service.state)) return Promise.resolve(service.state);
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      subscription.unsubscribe();
      reject(new Error(`Timed out in state ${JSON.stringify(service.state.value)}`));
    }, timeout);
    const subscription = service.subscribe((state) => {
      if (!predicate(state)) return;
      clearTimeout(timer);
      subscription.unsubscribe();
      resolve(state);
    });
  });
}

async function waitUntil(predicate, timeout = 1000) {
  const started = Date.now();
  while (!predicate()) {
    if (Date.now() - started > timeout) throw new Error("Timed out waiting for condition");
    await new Promise((resolve) => setTimeout(resolve, 1));
  }
}
