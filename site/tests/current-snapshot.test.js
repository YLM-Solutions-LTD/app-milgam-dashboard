import test from "node:test";
import assert from "node:assert/strict";
import { performance } from "node:perf_hooks";
import { createApiClient } from "../api-client.js";
import { CURRENT_SNAPSHOT_LIVE_CALLS_ENABLED } from "../constants.js";
import { createSnapshotController, loadCurrentSnapshot, mapCurrentEquipment, mapCurrentEvents, mapCurrentPermits } from "../current-snapshot.js";
import { contextFromMessage } from "../host-context.js";

const parentWindow = {};
const context = contextFromMessage({ source: parentWindow, origin: "https://localhost:5500", data: { ApiAddress: "https://localhost:5721", Token: { access_token: "synthetic" } } }, ["https://localhost:5500"], parentWindow);
const events = { Items: [
  { ScopeKey: "overall", TotalCount: 8, OpenCount: 3, AsOf: "2026-09-23T08:00:00" },
  { ScopeKey: "headquarters", TotalCount: 3, OpenCount: 1, AsOf: "2026-09-23T08:00:00" },
  { ScopeKey: "branches", TotalCount: 5, OpenCount: 2, AsOf: "2026-09-23T08:00:00" }
], TotalCount: 3 };
const permits = { Items: [{ ValidCount: 4, MissingCount: 2, OverdueCount: 1, AsOf: "raw-asof", ValueDate: "raw-value" }], TotalCount: 1 };
const equipment = { Items: [{ EquipmentId: 1, IsActive: false, LastTreatmentDate: null, AsOf: "raw" }], TotalCount: 1 };

test("snapshot transport issues exactly three concurrent empty-body searches", async () => {
  const calls = [];
  const client = createApiClient(context, { fetchImpl: (url, options) => {
    calls.push({ url, options, at: performance.now() });
    const value = url.includes("CurrentEvents") ? events : url.includes("CurrentPermits") ? permits : equipment;
    return Promise.resolve().then(() => new Response(JSON.stringify(value), { status: 200 }));
  }});
  const result = await loadCurrentSnapshot(client);
  assert.equal(calls.length, 3);
  assert.ok(Math.max(...calls.map((x) => x.at)) - Math.min(...calls.map((x) => x.at)) < 50);
  assert.ok(calls.every((x) => x.options.body === "{}"));
  assert.equal(result.equipment.total, 1);
  assert.equal(result.equipment.classification, "unavailable");
});

test("strict adapters reconcile events, preserve separate permits, and reject conflicts", () => {
  assert.equal(mapCurrentEvents(events).overall.open, 3);
  assert.deepEqual(mapCurrentPermits(permits), { valid: 4, missing: 2, overdue: 1, asOf: "raw-asof", valueDate: "raw-value" });
  assert.throws(() => mapCurrentEvents({ ...events, Items: events.Items.map((x, i) => i ? x : { ...x, OpenCount: 4 }) }), /invalid data/);
  assert.throws(() => mapCurrentEquipment({ Items: [{ EquipmentId: 1 }, { EquipmentId: 1, IsActive: true }], TotalCount: 2 }), /invalid data/);
  const duplicate = { EquipmentId: 1, IsActive: true, LastTreatmentDate: null, AsOf: "raw" };
  assert.equal(mapCurrentEquipment({ Items: [duplicate, { ...duplicate }], TotalCount: 1 }).total, 1);
});

test("HTTP200 report counts serialized as strings normalize without changing timestamps or units", async () => {
  const serializedEvents = { ...events, Items: events.Items.map(row => ({ ...row, TotalCount: String(row.TotalCount), OpenCount: String(row.OpenCount) })) };
  const serializedPermits = { Items: [{ ValidCount: "14", MissingCount: "0", OverdueCount: "2", AsOf: "2026-10-01T13:03:40.6610000", ValueDate: "2026-10-01T02:00:00.0000000", __Key__: "current" }], IsPaged: true, PageIndex: 1, PageSize: 50, TotalCount: 1 };
  const client = createApiClient(context, { fetchImpl: async (url) => new Response(JSON.stringify(
    url.includes("CurrentEvents") ? serializedEvents : url.includes("CurrentPermits") ? serializedPermits : equipment
  ), { status: 200 }) });
  const result = await loadCurrentSnapshot(client);
  assert.equal(result.events.overall.total, 8);
  assert.equal(result.events.headquarters.total + result.events.branches.total, result.events.overall.total);
  assert.equal(result.events.overall.open, 3);
  assert.deepEqual(result.permits, { valid: 14, missing: 0, overdue: 2,
    asOf: serializedPermits.Items[0].AsOf, valueDate: serializedPermits.Items[0].ValueDate });
});

test("string normalization still rejects missing, malformed, negative, fractional and unsafe counts", () => {
  for (const invalidCount of [null, undefined, false, true, "", " ", "-1", "1.5", "1e3", "0x10", "NaN", "Infinity", "9007199254740993", -1, 1.5, Infinity, {}, []]) {
    const broken = { ...permits, Items: [{ ...permits.Items[0], ValidCount: invalidCount }] };
    assert.throws(() => mapCurrentPermits(broken), /invalid data/, String(invalidCount));
  }
  const brokenEvents = { ...events, Items: events.Items.map((row, index) => ({ ...row, TotalCount: index ? String(row.TotalCount) : "9", OpenCount: String(row.OpenCount) })) };
  assert.throws(() => mapCurrentEvents(brokenEvents), /invalid data/);
});

test("10,000 equipment facts map within budget and add no inferred classification", () => {
  const Items = Array.from({ length: 10_000 }, (_, index) => ({ EquipmentId: index + 1, IsActive: index % 2 === 0, LastTreatmentDate: null, AsOf: "raw" }));
  mapCurrentEquipment({ Items, TotalCount: Items.length });
  const started = performance.now();
  const mapped = mapCurrentEquipment({ Items, TotalCount: Items.length });
  const duration = performance.now() - started;
  assert.equal(mapped.total, 10_000);
  assert.equal(mapped.classification, "unavailable");
  assert.ok(duration < 100, `mapping took ${duration.toFixed(2)}ms`);
});

test("snapshot controller ignores superseded work and retains last good data on refresh failure", async () => {
  const pending = [];
  const controller = createSnapshotController({ client: {}, load: (_client, { signal }) => new Promise((resolve, reject) => pending.push({ signal, resolve, reject })) });
  const first = controller.refresh();
  const second = controller.refresh();
  assert.equal(pending[0].signal.aborted, true);
  pending[1].resolve({ marker: "current" });
  await second;
  assert.equal(controller.getState().data.marker, "current");
  pending[0].resolve({ marker: "stale" });
  await first;
  assert.equal(controller.getState().data.marker, "current");
  const third = controller.refresh();
  pending[2].reject({ kind: "network" });
  await third;
  assert.equal(controller.getState().status, "stale");
  assert.equal(controller.getState().data.marker, "current");
});

test("fresh application generation retains prior facts while its automatic refresh is pending or fails", async () => {
  const prior = { marker: "last-good" };
  let rejectLoad;
  const states = [];
  const controller = createSnapshotController({
    client: {},
    initialData: prior,
    initialRefreshedAt: new Date("2026-10-25T00:00:00Z"),
    load: () => new Promise((_resolve, reject) => { rejectLoad = reject; }),
    onChange: (state) => states.push(state)
  });
  const refresh = controller.refresh();
  assert.equal(controller.getState().status, "loading");
  assert.equal(controller.getState().data, prior);
  rejectLoad({ kind: "http", status: 500 });
  await refresh;
  assert.equal(controller.getState().status, "stale");
  assert.equal(controller.getState().data, prior);
  assert.ok(states.every((state) => state.data === prior));
});

test("authorization invalidation retains the permission status and last-good data", async () => {
  const controller = createSnapshotController({ client: {}, load: async () => ({ marker: "last good" }) });
  await controller.refresh();
  controller.invalidate({ kind: "authorization-revoked", dataset: "hostContext", status: 403 });
  assert.equal(controller.getState().error.status, 403);
  assert.equal(controller.getState().status, "stale");
  assert.equal(controller.getState().data.marker, "last good");
});

test("release-candidate source keeps authorized current snapshot live calls enabled", () => assert.equal(CURRENT_SNAPSHOT_LIVE_CALLS_ENABLED, true));
