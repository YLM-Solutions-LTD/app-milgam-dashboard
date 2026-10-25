import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { performance } from "node:perf_hooks";

import { createApiClient } from "../../site/api-client.js";
import { CURRENT_SNAPSHOT_LIVE_CALLS_ENABLED } from "../../site/constants.js";
import {
  createSnapshotController,
  loadCurrentSnapshot,
  mapCurrentEquipment,
  mapCurrentEvents,
  mapCurrentPermits
} from "../../site/current-snapshot.js";
import {
  contextFromMessage,
  hostContextGeneration,
  installHostContextListener,
  revokeHostContext,
  resolveRuntimeLocale
} from "../../site/host-context.js";
import { createHostServices } from "../../site/host-services.js";

const parentWindow = Object.freeze({ kind: "synthetic-parent" });
const hostOrigin = "https://localhost:5500";
const apiOrigin = "https://localhost:5721";
const syntheticToken = "uat-synthetic-token-not-a-tenant-secret";
const contextPayload = {
  ApiAddress: apiOrigin,
  Token: { access_token: syntheticToken, token_type: "Bearer" },
  LanguageCode: "he-IL",
  LanguageDirection: "rtl"
};

const CASE_TASK_TRACE = Object.freeze({
  "UAT-201": ["T-201", "T-203", "T-204"],
  "UAT-202": ["T-201", "T-203", "T-204", "T-205"],
  "UAT-203": ["T-202", "T-203", "T-204"],
  "UAT-204": ["T-203", "T-204"],
  "UAT-205": ["T-203", "T-204"],
  "UAT-206": ["T-203", "T-204", "T-205"],
  "UAT-207": ["T-202", "T-203", "T-204"],
  "UAT-208": ["T-203", "T-205"],
  "UAT-209": ["T-203", "T-205"],
  "UAT-210": ["T-201", "T-202", "T-203", "T-204", "T-205"]
});

const eventsEnvelope = { Items: [
  { ScopeKey: "overall", TotalCount: 12, OpenCount: 5, AsOf: "2026-09-23T09:15:00" },
  { ScopeKey: "headquarters", TotalCount: 4, OpenCount: 2, AsOf: "2026-09-23T09:15:00" },
  { ScopeKey: "branches", TotalCount: 8, OpenCount: 3, AsOf: "2026-09-23T09:15:00" }
], TotalCount: 3 };
const permitsEnvelope = { Items: [
  { ValidCount: 7, MissingCount: 3, OverdueCount: 2, AsOf: "raw-as-of", ValueDate: "raw-value-date" }
], TotalCount: 1 };
const equipmentEnvelope = { Items: [
  { EquipmentId: 101, IsActive: false, TreatmentDaysInterval: null, LastTreatmentDate: null, AsOf: "raw-equipment-date" }
], TotalCount: 1 };

function acceptedContext(payload = contextPayload) {
  return contextFromMessage({ source: parentWindow, origin: hostOrigin, data: { context: payload } }, [hostOrigin], parentWindow);
}

function response(value, status = 200) {
  return new Response(JSON.stringify(value), { status });
}

function makeSyntheticClientCapture(overrides = {}) {
  const calls = [];
  const context = acceptedContext();
  assert.ok(context, "synthetic postMessage context must be accepted");
  const fixtures = { CurrentEvents: eventsEnvelope, CurrentPermits: permitsEnvelope, CurrentEquipment: equipmentEnvelope, ...overrides };
  const client = createApiClient(context, { fetchImpl: async (url, options) => {
    calls.push({ url, options, at: performance.now() });
    const fixtureKey = Object.keys(fixtures).find((key) => url.includes(key));
    return response(fixtures[fixtureKey]);
  }});
  return { client, calls };
}

test("UAT traceability covers every recovered structure task T-201 through T-205", () => {
  assert.deepEqual(Object.keys(CASE_TASK_TRACE), Array.from({ length: 10 }, (_, index) => `UAT-${201 + index}`));
  assert.deepEqual([...new Set(Object.values(CASE_TASK_TRACE).flat())].sort(), ["T-201", "T-202", "T-203", "T-204", "T-205"]);
});

test("UAT-201 authenticated entry loads one coherent three-report snapshot", async () => {
  const { client, calls } = makeSyntheticClientCapture();
  const snapshot = await loadCurrentSnapshot(client);
  assert.equal(calls.length, 3);
  assert.ok(Math.max(...calls.map((call) => call.at)) - Math.min(...calls.map((call) => call.at)) < 50);
  assert.deepEqual(calls.map((call) => new URL(call.url).pathname).sort(), [
    "/api/Entity/MilgamDashboardCurrentEquipment/Search",
    "/api/Entity/MilgamDashboardCurrentEvents/Search",
    "/api/Entity/MilgamDashboardCurrentPermits/Search"
  ]);
  assert.ok(calls.every(({ options }) => options.method === "POST" && options.body === "{}"));
  assert.equal(snapshot.events.overall.total, 12);
  assert.deepEqual(snapshot.permits, { valid: 7, missing: 3, overdue: 2, asOf: "raw-as-of", valueDate: "raw-value-date" });
  assert.deepEqual({ total: snapshot.equipment.total, classification: snapshot.equipment.classification }, { total: 1, classification: "unavailable" });
});

test("UAT-204 exact semantics distinguish validated zero, separate units, raw dates, and unavailable classification", () => {
  const zeroPermits = mapCurrentPermits({ Items: [{ ValidCount: 0, MissingCount: 0, OverdueCount: 0, AsOf: "raw", ValueDate: "raw-value" }], TotalCount: 1 });
  assert.deepEqual([zeroPermits.valid, zeroPermits.missing, zeroPermits.overdue], [0, 0, 0]);
  assert.equal(zeroPermits.asOf, "raw");
  assert.equal(zeroPermits.valueDate, "raw-value");
  const equipment = mapCurrentEquipment(equipmentEnvelope);
  assert.equal(equipment.facts[0].IsActive, false);
  assert.equal(equipment.facts[0].LastTreatmentDate, null);
  assert.equal(equipment.classification, "unavailable");
  const duplicate = { ...equipmentEnvelope.Items[0] };
  assert.equal(mapCurrentEquipment({ Items: [equipmentEnvelope.Items[0], duplicate], TotalCount: 1 }).total, 1);
  const observedDates = [];
  const services = createHostServices(acceptedContext(), {
    ready: async () => {}, executeCommand: async () => {}, ToDisplayDate: (value) => { observedDates.push(value); return `display:${value}`; }
  });
  assert.equal(services.toDisplayDate(zeroPermits.asOf), "display:raw");
  assert.equal(services.toDisplayDate(zeroPermits.valueDate), "display:raw-value");
  assert.deepEqual(observedDates, ["raw", "raw-value"]);
});

test("UAT-202 analytical period requests remain distinct from current snapshot requests", async () => {
  const { client, calls } = makeSyntheticClientCapture();
  await loadCurrentSnapshot(client);
  assert.ok(calls.every(({ options }) => options.body === "{}"));
  const apiSource = await readFile(new URL("../../site/api-client.js", import.meta.url), "utf8");
  assert.match(apiSource, /Use requestCurrent for current snapshot datasets/);
  assert.match(apiSource, /buildSearchBody\(range\)/);
});

test("UAT-205 superseded slow responses cannot replace generation ten", async () => {
  const pending = [];
  const controller = createSnapshotController({ client: {}, load: (_client, { signal }) => new Promise((resolve, reject) => pending.push({ signal, resolve, reject })) });
  const runs = Array.from({ length: 10 }, () => controller.refresh());
  assert.equal(pending.filter((item) => item.signal.aborted).length, 9);
  pending[9].resolve({ generation: 10 });
  await runs[9];
  for (let index = 8; index >= 0; index -= 1) pending[index].resolve({ generation: index + 1 });
  await Promise.all(runs.slice(0, 9));
  assert.equal(controller.getState().data.generation, 10);
});

test("UAT-205 malformed, permission, and invalid JSON failures stay explicit without fabricated metrics", async () => {
  for (const scenario of [
    { fixture: response({ message: `denied ${syntheticToken}` }, 403), kind: "http" },
    { fixture: new Response("not-json", { status: 200 }), kind: "invalid-response" },
    { fixture: response({ Items: [], TotalCount: 1 }), kind: "invalid-response" }
  ]) {
    const context = acceptedContext();
    const client = createApiClient(context, { fetchImpl: async () => scenario.fixture.clone() });
    await assert.rejects(client.requestCurrent("currentEvents"), (error) => {
      assert.equal(error.kind, scenario.kind);
      assert.doesNotMatch(JSON.stringify(error), new RegExp(syntheticToken));
      return true;
    });
  }
});

test("UAT-208 trust boundary supports revocation, late-result denial, and fresh synthetic re-entry", async () => {
  let fetchCount = 0;
  let commandCount = 0;
  const invalid = [
    { source: {}, origin: hostOrigin, data: contextPayload },
    { source: parentWindow, origin: "http://localhost:5500", data: contextPayload },
    { source: parentWindow, origin: hostOrigin, data: { ...contextPayload, ApiAddress: "http://localhost:5721" } },
    { source: parentWindow, origin: hostOrigin, data: { ...contextPayload, ApiAddress: "https://unapproved.example" } },
    { source: parentWindow, origin: hostOrigin, data: "{" }
  ];
  for (const event of invalid) assert.equal(contextFromMessage(event, [hostOrigin], parentWindow), null);
  assert.throws(() => createApiClient(contextPayload, { fetchImpl: () => { fetchCount += 1; } }), /Valid SimplyLog host context/);
  assert.throws(() => createApiClient({ ...contextPayload, __hostContextBound: true, __trustedHostOrigin: hostOrigin }, {
    fetchImpl: () => { fetchCount += 1; }
  }), /Valid SimplyLog host context/);
  const bound = acceptedContext();
  assert.equal(Object.isFrozen(bound), true);
  assert.equal(Object.isFrozen(bound.Token), true);
  assert.throws(() => { bound.Token.access_token = "attacker-replacement"; }, TypeError);
  assert.equal(bound.Token.access_token, syntheticToken);
  const unavailableServices = createHostServices(contextPayload, {
    ready: async () => { commandCount += 1; }, executeCommand: async () => { commandCount += 1; }
  });
  assert.equal(unavailableServices.available, false);
  assert.deepEqual({ fetchCount, commandCount }, { fetchCount: 0, commandCount: 0 });

  let releaseFetch;
  const lateClient = createApiClient(bound, { fetchImpl: () => new Promise((resolve) => { releaseFetch = resolve; }) });
  const lateRequest = lateClient.requestCurrent("currentEquipment");
  assert.equal(revokeHostContext(bound, "synthetic-expiry"), true);
  releaseFetch(response({ Items: [], TotalCount: 0 }));
  await assert.rejects(lateRequest, (error) => error.kind === "authorization-revoked");
  await assert.rejects(lateClient.requestCurrent("currentEquipment"), (error) => error.kind === "authorization-revoked");

  const listeners = new Map();
  const fakeWindow = {
    parent: parentWindow,
    addEventListener: (type, listener) => listeners.set(type, listener),
    removeEventListener: (type) => listeners.delete(type)
  };
  const generations = [];
  const dispose = installHostContextListener(fakeWindow, (context) => generations.push({ context, generation: hostContextGeneration(context) }), [hostOrigin]);
  listeners.get("message")({ source: parentWindow, origin: hostOrigin, data: contextPayload });
  listeners.get("message")({ source: parentWindow, origin: hostOrigin, data: { ...contextPayload, Token: { ...contextPayload.Token, access_token: "fresh-synthetic-token" } } });
  assert.equal(generations.length, 2);
  assert.ok(generations[1].generation > generations[0].generation);
  assert.throws(() => createApiClient(generations[0].context), /Valid SimplyLog host context/);
  assert.doesNotThrow(() => createApiClient(generations[1].context, { fetchImpl: async () => response({ Items: [], TotalCount: 0 }) }));
  dispose();
});

test("UAT-205 failed refresh retains the complete last-good snapshot", async () => {
  let run = 0;
  const controller = createSnapshotController({ client: {}, load: async () => {
    run += 1;
    if (run === 1) return { marker: "last-good", events: eventsEnvelope };
    throw { kind: "network", secret: syntheticToken };
  }});
  await controller.refresh();
  const first = controller.getState().data;
  await controller.refresh();
  assert.equal(controller.getState().status, "stale");
  assert.equal(controller.getState().data, first);
  assert.deepEqual(controller.getState().error, { kind: "network", status: null, dataset: "currentSnapshot" });
});

test("UAT-205/UAT-208 HTTP 500 and 401 refreshes retain last-good data and timestamp", async () => {
  for (const status of [500, 401]) {
    let run = 0;
    const committedAt = new Date("2026-10-25T12:00:00Z");
    const controller = createSnapshotController({ client: {}, now: () => committedAt, load: async () => {
      run += 1;
      if (run === 1) return { marker: `last-good-${status}` };
      throw { kind: "http", status, dataset: "MilgamDashboardCurrentEvents", marker: "DO_NOT_COMMIT" };
    }});
    await controller.refresh();
    const committed = controller.getState();
    await controller.refresh();
    const stale = controller.getState();
    assert.equal(stale.status, "stale");
    assert.equal(stale.data, committed.data);
    assert.equal(stale.lastGoodData, committed.lastGoodData);
    assert.equal(stale.refreshedAt, committedAt);
    assert.deepEqual(stale.error, { kind: "http", status, dataset: "MilgamDashboardCurrentEvents" });
    assert.doesNotMatch(JSON.stringify(stale), /DO_NOT_COMMIT/);
  }
});

test("UAT-208 a 401 terminally denies the rejected synthetic generation", async () => {
  const bound = acceptedContext();
  let calls = 0;
  const client = createApiClient(bound, { fetchImpl: async () => {
    calls += 1;
    return response({ marker: "synthetic-denial" }, 401);
  }});
  await assert.rejects(client.requestCurrent("currentEvents"), (error) => error.kind === "http" && error.status === 401);
  await assert.rejects(client.requestCurrent("currentPermits"), (error) => error.kind === "authorization-revoked");
  await assert.rejects(client.requestCurrent("currentEquipment"), (error) => error.kind === "authorization-revoked");
  assert.equal(calls, 1, "rejected generation must emit zero post-401 requests");

  const fresh = acceptedContext({ ...contextPayload, Token: { ...contextPayload.Token, access_token: "fresh-synthetic-token" } });
  let freshCalls = 0;
  const freshClient = createApiClient(fresh, { fetchImpl: async () => {
    freshCalls += 1;
    return response(equipmentEnvelope);
  }});
  await freshClient.requestCurrent("currentEquipment");
  assert.equal(freshCalls, 1, "a distinct freshly bound context may resume authenticated work");
});

test("UAT-206 permit host chain uses exact unfiltered navigation and is structurally busy-locked", async () => {
  const calls = [];
  const services = createHostServices(acceptedContext(), {
    ready: async () => calls.push(["ready"]),
    executeCommand: async (name, parameter) => calls.push([name, parameter]),
    ToDisplayDate: (value) => value
  });
  await services.ready();
  await services.executeCommand("Navigate", { Url: "#/Permits/Dashboard" });
  assert.deepEqual(calls, [["ready"], ["Navigate", { Url: "#/Permits/Dashboard" }]]);
  const appSource = await readFile(new URL("../../site/app.js", import.meta.url), "utf8");
  assert.match(appSource, /if \(permitNavigationPending\) return/);
  assert.match(appSource, /if \(permitNavigationPending\) return;\s*const activatingElement[\s\S]*permitNavigationPending = true;[\s\S]*await hostBootstrap\.reconnect\(\)/);
  assert.match(appSource, /aria-busy/);
});

test("UAT-209 host navigation failure path preserves data and clears busy state by contract", async () => {
  const appSource = await readFile(new URL("../../site/app.js", import.meta.url), "utf8");
  assert.match(appSource, /הנתונים נשארו זמינים/);
  assert.match(appSource, /finally \{/);
  assert.match(appSource, /permitNavigationPending = false/);
  assert.match(appSource, /removeAttribute\("aria-busy"\)/);
  assert.match(appSource, /const activatingElement = event\.currentTarget/);
  assert.match(appSource, /activatingElement\?\.isConnected/);
  assert.doesNotMatch(appSource, /event\.currentTarget\.focus\(\)/);
});

test("UAT-207 responsive bidi and accessible snapshot shell contracts are present", async () => {
  const [html, css, appSource] = await Promise.all([
    readFile(new URL("../../site/index.html", import.meta.url), "utf8"),
    readFile(new URL("../../site/app.css", import.meta.url), "utf8"),
    readFile(new URL("../../site/app.js", import.meta.url), "utf8")
  ]);
  assert.match(html, /lang="he" dir="rtl"/);
  assert.match(html, /snapshot-status[^>]*aria-live="polite"/);
  assert.match(css, /@media \(max-width: 760px\)/);
  assert.match(css, /:focus-visible/);
  assert.match(css, /margin-inline|padding-inline|inline-size/);
  assert.equal(resolveRuntimeLocale({ LanguageCode: "he-IL" }).direction, "rtl");
  assert.equal(resolveRuntimeLocale({ LanguageCode: "en-US" }).direction, "ltr");
  assert.match(appSource, /סיווג טיפול בתוקף \/ באיחור: <strong>לא זמין/);
});

test("UAT-204 strict contracts and representative volumes remain within mapper budget", () => {
  assert.throws(() => mapCurrentEvents({ ...eventsEnvelope, Items: eventsEnvelope.Items.map((row, index) => index ? row : { ...row, OpenCount: 6 }) }));
  assert.throws(() => mapCurrentPermits({ Items: [], TotalCount: 0 }));
  const metrics = [];
  for (const size of [0, 1, 1_000, 10_000]) {
    const Items = Array.from({ length: size }, (_, index) => ({ EquipmentId: index + 1, IsActive: index % 2 === 0, TreatmentDaysInterval: null, LastTreatmentDate: null, AsOf: "raw" }));
    mapCurrentEquipment({ Items, TotalCount: size });
    const start = performance.now();
    const mapped = mapCurrentEquipment({ Items, TotalCount: size });
    const durationMs = performance.now() - start;
    metrics.push({ rows: size, decodedBytes: Buffer.byteLength(JSON.stringify({ Items, TotalCount: size })), durationMs: Number(durationMs.toFixed(3)), unique: mapped.total });
    if (size === 10_000) assert.ok(durationMs < 100, `10,000-row mapper took ${durationMs.toFixed(3)}ms`);
  }
  console.log(`UAT_PERFORMANCE ${JSON.stringify(metrics)}`);
});

test("UAT-203 and UAT-210 delivery is enabled, CSP-safe, locally pinned, and synthetic", async () => {
  assert.equal(CURRENT_SNAPSHOT_LIVE_CALLS_ENABLED, true);
  const testSource = await readFile(new URL(import.meta.url), "utf8");
  const [html, headers, dependency, appSource, css] = await Promise.all([
    readFile(new URL("../../site/index.html", import.meta.url), "utf8"),
    readFile(new URL("../../site/_headers", import.meta.url), "utf8"),
    readFile(new URL("../../site/assets/xstate-4.38.3.js", import.meta.url)),
    readFile(new URL("../../site/app.js", import.meta.url), "utf8"),
    readFile(new URL("../../site/app.css", import.meta.url), "utf8")
  ]);
  assert.doesNotMatch(testSource, /eyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\./);
  assert.match(testSource, /syntheticToken/);
  assert.deepEqual(Object.keys(contextPayload).sort(), ["ApiAddress", "LanguageCode", "LanguageDirection", "Token"]);
  assert.match(html, /src="\.\/assets\/xstate-4\.38\.3\.js"/);
  assert.doesNotMatch(html, /<script[^>]+https?:\/\//i);
  assert.match(headers, /Content-Security-Policy:/);
  assert.match(headers, /default-src 'self'/);
  assert.match(headers, /script-src 'self'/);
  assert.match(headers, /style-src 'self'/);
  assert.match(headers, /base-uri 'none'/);
  assert.match(headers, /object-src 'none'/);
  assert.doesNotMatch(headers, /unsafe-inline|unsafe-eval|script-src[^\n]*\*/);
  assert.doesNotMatch(appSource, /style=|\.style\b/);
  assert.match(appSource, /<svg class="donut-svg"/);
  assert.match(appSource, /stroke-dasharray=/);
  assert.match(appSource, /magnitudeClass/);
  assert.match(css, /\.color-5/);
  assert.match(css, /\.magnitude-20/);
  assert.equal(dependency.byteLength > 0, true);
});
