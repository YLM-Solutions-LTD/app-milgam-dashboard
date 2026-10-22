import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { performance } from "node:perf_hooks";

import { createApiClient } from "../../site/api-client.js";
import { createSnapshotController, loadCurrentSnapshot, mapCurrentEquipment, mapCurrentEvents, mapCurrentPermits } from "../../site/current-snapshot.js";
import { contextFromMessage, installHostContextListener, resolveRuntimeLocale, validateHostContext } from "../../site/host-context.js";
import { createHostServices } from "../../site/host-services.js";
import { CURRENT_SNAPSHOT_LIVE_CALLS_ENABLED } from "../../site/constants.js";

const HOST = "https://localhost:5500";
const API = "https://localhost:5721";
const TOKEN = "qc-synthetic-token-never-live";
const rawContext = { ApiAddress: API, Token: { access_token: TOKEN }, LanguageCode: "he" };
const parentWindow = Object.freeze({ name: "synthetic-parent" });
const TASKS = Object.freeze(["T-101", "T-102", "T-103", "T-104", "T-105", "T-106", "T-107"]);
const CASE_TRACE = Object.freeze({
  "QC-201": ["T-101", "T-106"], "QC-202": ["T-101", "T-103", "T-104", "T-106"],
  "QC-203": ["T-102", "T-105", "T-106"], "QC-204": ["T-101", "T-102", "T-106"],
  "QC-205": ["T-103", "T-106"], "QC-206": ["T-104", "T-105", "T-106"],
  "QC-207": ["T-103", "T-105", "T-106"], "QC-208": ["T-105", "T-106"],
  "QC-209": ["T-105", "T-106"], "QC-210": ["T-105", "T-106"],
  "QC-211": ["T-101", "T-103", "T-105", "T-106"], "QC-212": ["T-106", "T-107"]
});

function acceptedContext(overrides = {}) {
  return contextFromMessage({ source: parentWindow, origin: HOST, data: { ...rawContext, ...overrides } }, [HOST], parentWindow);
}

const events = { Items: [
  { ScopeKey: "overall", TotalCount: 9, OpenCount: 4, AsOf: "2026-09-23T08:00:00" },
  { ScopeKey: "headquarters", TotalCount: 4, OpenCount: 1, AsOf: "2026-09-23T08:00:00" },
  { ScopeKey: "branches", TotalCount: 5, OpenCount: 3, AsOf: "2026-09-23T08:00:00" }
], TotalCount: 3 };
const permits = { Items: [{ ValidCount: 7, MissingCount: 2, OverdueCount: 1, AsOf: "raw-asof", ValueDate: "raw-value" }], TotalCount: 1 };
const oneEquipment = { Items: [{ EquipmentId: "EQP-1", IsActive: false, NextTreatmentDate: null, AsOf: "raw" }], TotalCount: 1 };

function response(value, status = 200) {
  return { ok: status >= 200 && status < 300, status, text: async () => JSON.stringify(value) };
}

test("QC-201..QC-212 traceability preserves every shared task ID", () => {
  assert.deepEqual(Object.keys(CASE_TRACE), Array.from({ length: 12 }, (_, index) => `QC-${201 + index}`));
  assert.deepEqual([...new Set(Object.values(CASE_TRACE).flat())].sort(), TASKS);
});

test("T-101/T-103: accepted synthetic postMessage context fans out exactly three concurrent empty-body calls", async () => {
  const context = acceptedContext();
  assert.ok(context?.__hostContextBound);
  const calls = [];
  const client = createApiClient(context, { fetchImpl: async (url, options) => {
    calls.push({ url, options, at: performance.now() });
    const fixture = url.includes("CurrentEvents") ? events : url.includes("CurrentPermits") ? permits : oneEquipment;
    return response(fixture);
  }});
  const mapped = await loadCurrentSnapshot(client);
  assert.equal(calls.length, 3);
  assert.deepEqual(calls.map(({ url }) => new URL(url).pathname).sort(), [
    "/api/Entity/MilgamDashboardCurrentEquipment/Search",
    "/api/Entity/MilgamDashboardCurrentEvents/Search",
    "/api/Entity/MilgamDashboardCurrentPermits/Search"
  ]);
  assert.ok(Math.max(...calls.map((call) => call.at)) - Math.min(...calls.map((call) => call.at)) < 50);
  assert.ok(calls.every(({ options }) => options.method === "POST" && options.body === "{}"));
  assert.ok(calls.every(({ options }) => options.headers.Authorization === `Bearer ${TOKEN}`));
  assert.equal(mapped.events.overall.total, 9);
  assert.deepEqual(mapped.permits, { valid: 7, missing: 2, overdue: 1, asOf: "raw-asof", valueDate: "raw-value" });
  assert.equal(mapped.equipment.classification, "unavailable");
});

test("T-101/T-104: an unbound object cannot construct an authorization-bearing API client", () => {
  const forgedUnboundContext = { ...rawContext, __trustedHostOrigin: HOST };
  assert.throws(
    () => createApiClient(forgedUnboundContext, { fetchImpl: async () => { throw new Error("must not fetch"); } }),
    /host context/i
  );
});

test("T-101/T-104: synthetic postMessage trust rejects wrong source, origin, HTTP, and cross-environment API", () => {
  const cases = [
    { source: {}, origin: HOST, data: rawContext },
    { source: parentWindow, origin: "https://evil.invalid", data: rawContext },
    { source: parentWindow, origin: "http://localhost:5500", data: rawContext },
    { source: parentWindow, origin: HOST, data: { ...rawContext, ApiAddress: "https://api.ylm.co.il" } }
  ];
  for (const message of cases) assert.equal(contextFromMessage(message, [HOST], parentWindow), null);
});

test("T-101/T-103/T-104: public markers, direct access and mutation cannot cross the host capability boundary", () => {
  let fetchCount = 0;
  for (const forged of [rawContext, { ...rawContext, __trustedHostOrigin: HOST }, { ...rawContext, __trustedHostOrigin: HOST, __hostContextBound: true }]) {
    assert.equal(validateHostContext(forged), false);
    assert.throws(() => createApiClient(forged, { fetchImpl: async () => { fetchCount += 1; } }), /host context/i);
    assert.equal(createHostServices(forged, { ready: async () => {}, executeCommand: async () => {} }).available, false);
  }
  const payload = { ...rawContext, Token: { ...rawContext.Token }, nested: { enabled: true } };
  const accepted = acceptedContext(payload);
  payload.Token.access_token = "mutated";
  payload.nested.enabled = false;
  assert.equal(Object.isFrozen(accepted), true);
  assert.equal(Object.isFrozen(accepted.Token), true);
  assert.equal(accepted.Token.access_token, TOKEN);
  assert.equal(accepted.nested.enabled, true);
  assert.equal(fetchCount, 0);
});

test("T-101/T-103: late valid host message recovers once after rejected and malformed messages", () => {
  const listeners = new Map();
  const fakeWindow = { parent: parentWindow, addEventListener: (type, fn) => listeners.set(type, fn), removeEventListener: (type) => listeners.delete(type) };
  const received = [];
  const dispose = installHostContextListener(fakeWindow, (context) => received.push(context), [HOST]);
  listeners.get("message")({ source: {}, origin: HOST, data: rawContext });
  listeners.get("message")({ source: parentWindow, origin: HOST, data: "{" });
  assert.equal(received.length, 0);
  listeners.get("message")({ source: parentWindow, origin: HOST, data: rawContext });
  listeners.get("message")({ source: parentWindow, origin: HOST, data: rawContext });
  assert.equal(received.length, 1);
  assert.equal(validateHostContext(received[0]), true);
  dispose();
  assert.equal(listeners.has("message"), false);
});

test("T-102: identical equipment rows deduplicate to the complete population while conflicts reject", () => {
  const fact = { EquipmentId: "EQP-DUP", IsActive: true, LastTreatmentDate: null, AsOf: "raw" };
  const mapped = mapCurrentEquipment({ Items: [fact, { ...fact }], TotalCount: 1 });
  assert.equal(mapped.total, 1);
  assert.equal(mapped.facts.length, 1);
  assert.throws(
    () => mapCurrentEquipment({ Items: [fact, { ...fact, IsActive: false }], TotalCount: 1 }),
    /invalid data/i
  );
});

test("T-102: current-equipment transport preserves duplicate rows for mapper deduplication", async () => {
  const fact = { EquipmentId: "EQP-DUP", IsActive: true, AsOf: "raw" };
  const client = createApiClient(acceptedContext(), { fetchImpl: async () => response({ Items: [fact, { ...fact }], TotalCount: 1 }) });
  const envelope = await client.requestCurrent("currentEquipment");
  assert.equal(envelope.Items.length, 2);
  assert.equal(envelope.TotalCount, 1);
});

test("T-102/T-105: strict event and permit adapters reject semantic lies and preserve valid zero", () => {
  assert.equal(mapCurrentEvents(events).overall.total, 9);
  assert.deepEqual(mapCurrentPermits({ Items: [{ ValidCount: 0, MissingCount: 0, OverdueCount: 0, AsOf: "raw", ValueDate: "raw-value" }], TotalCount: 1 }),
    { valid: 0, missing: 0, overdue: 0, asOf: "raw", valueDate: "raw-value" });
  const invalidEvents = [
    { ...events, Items: events.Items.slice(0, 2), TotalCount: 2 },
    { ...events, Items: events.Items.map((row, i) => i === 2 ? { ...row, ScopeKey: "headquarters" } : row) },
    { ...events, Items: events.Items.map((row, i) => i === 0 ? { ...row, OpenCount: 10 } : row) },
    { ...events, Items: events.Items.map((row, i) => i === 0 ? { ...row, TotalCount: 10 } : row) },
    { ...events, Items: events.Items.map((row, i) => i === 0 ? { ...row, AsOf: "" } : row) }
  ];
  for (const fixture of invalidEvents) assert.throws(() => mapCurrentEvents(fixture), /invalid data/i);
  for (const fixture of [
    { Items: [], TotalCount: 0 },
    { Items: [{ ValidCount: 1, MissingCount: -1, OverdueCount: 0, AsOf: "raw", ValueDate: "raw" }], TotalCount: 1 },
    { Items: [{ ValidCount: 1, MissingCount: 0, OverdueCount: 0, AsOf: "raw", ValueDate: null }], TotalCount: 1 }
  ]) assert.throws(() => mapCurrentPermits(fixture), /invalid data/i);
});

test("T-102/T-106: representative equipment volumes stay linear, nullable and aggregate-only", () => {
  const metrics = [];
  for (const size of [0, 1, 1_000, 10_000]) {
    const Items = Array.from({ length: size }, (_, index) => ({
      EquipmentId: index + 1, LocationEntityId: null, IsActive: index % 2 === 0,
      TreatmentDaysInterval: null, NextTreatmentDate: null, LastTreatmentEventId: null,
      LastTreatmentDate: null, LastTreatmentStatus: null, AsOf: "raw"
    }));
    mapCurrentEquipment({ Items, TotalCount: size });
    const durations = [];
    for (let run = 0; run < 5; run += 1) {
      const started = performance.now();
      const mapped = mapCurrentEquipment({ Items, TotalCount: size });
      durations.push(performance.now() - started);
      assert.equal(mapped.total, size);
      assert.equal(mapped.classification, "unavailable");
    }
    const metric = { rows: size, decodedBytes: Buffer.byteLength(JSON.stringify({ Items, TotalCount: size })), durationsMs: durations.map((x) => Number(x.toFixed(3))) };
    metrics.push(metric);
    if (size === 10_000) assert.ok(Math.max(...durations) < 100, `10,000-row runs exceeded budget: ${durations.join(", ")}`);
  }
  console.log(`QC_EQUIPMENT_METRICS ${JSON.stringify(metrics)}`);
});

test("T-103: newest refresh wins and failed refresh retains only last good snapshot", async () => {
  const pending = [];
  const controller = createSnapshotController({ client: {}, now: () => new Date("2026-09-23T10:00:00Z"), load: (_client, { signal }) => new Promise((resolve, reject) => pending.push({ signal, resolve, reject })) });
  const first = controller.refresh();
  const second = controller.refresh();
  assert.equal(pending[0].signal.aborted, true);
  pending[1].resolve({ marker: "generation-2" });
  await second;
  pending[0].resolve({ marker: "generation-1" });
  await first;
  assert.equal(controller.getState().data.marker, "generation-2");
  const third = controller.refresh();
  pending[2].reject({ kind: "network", detail: TOKEN });
  await third;
  assert.equal(controller.getState().status, "stale");
  assert.deepEqual(controller.getState().error, { kind: "network", status: null, dataset: "currentSnapshot" });
  assert.equal(JSON.stringify(controller.getState()).includes(TOKEN), false);
});

test("T-103/T-106: burst of ten refreshes commits generation ten with no retry storm", async () => {
  const pending = [];
  let changeCount = 0;
  const controller = createSnapshotController({ client: {}, onChange: () => { changeCount += 1; }, load: (_client, { signal }) => new Promise((resolve, reject) => pending.push({ signal, resolve, reject })) });
  const runs = Array.from({ length: 10 }, () => controller.refresh());
  assert.equal(pending.filter(({ signal }) => signal.aborted).length, 9);
  pending[9].resolve({ generation: 10 });
  await runs[9];
  for (let index = 8; index >= 0; index -= 1) pending[index].resolve({ generation: index + 1 });
  await Promise.all(runs.slice(0, 9));
  assert.equal(controller.getState().data.generation, 10);
  assert.equal(controller.getState().lastGoodData.generation, 10);
  assert.equal(changeCount, 11);
});

test("T-104: host date and navigation boundaries preserve exact arguments and sequencing", async () => {
  const log = [];
  const adapter = {
    ready: async () => log.push(["ready"]),
    executeCommand: async (name, parameter) => log.push(["command", name, parameter]),
    ToDisplayDate: (value) => { log.push(["date", value]); return `formatted:${value}`; }
  };
  const services = createHostServices(acceptedContext(), adapter);
  const raw = "2026-09-23T23:59:59+03:00";
  assert.equal(services.toDisplayDate(raw), `formatted:${raw}`);
  await services.ready();
  await services.executeCommand("Navigate", { Url: "#/Permits/Dashboard" });
  assert.deepEqual(log, [["date", raw], ["ready"], ["command", "Navigate", { Url: "#/Permits/Dashboard" }]]);
});

test("T-105/T-106: static UI contract exposes one polite non-atomic status, semantic controls, focus, responsive stack and bidi", async () => {
  const [html, css, app] = await Promise.all([
    readFile(new URL("../../site/index.html", import.meta.url), "utf8"),
    readFile(new URL("../../site/app.css", import.meta.url), "utf8"),
    readFile(new URL("../../site/app.js", import.meta.url), "utf8")
  ]);
  assert.match(html, /<section id="snapshot-region"[^>]*aria-labelledby="snapshot-heading"/);
  assert.match(html, /id="snapshot-status"[^>]*role="status"[^>]*aria-live="polite"[^>]*aria-atomic="false"/);
  assert.match(html, /<button id="snapshot-refresh"[^>]*type="button"/);
  assert.match(app, /<button class="permit-metric" type="button"/);
  assert.match(app, /aria-label="\$\{label\}: \$\{formatInteger\(value\)\}; פתיחת לוח האישורים"/);
  assert.match(css, /:focus-visible\s*\{[^}]*outline:\s*3px solid/);
  assert.match(css, /\.button\s*\{[^}]*min-block-size:\s*44px/s);
  assert.match(css, /@media \(max-width: 900px\)\s*\{\s*\.snapshot-grid\s*\{\s*grid-template-columns:\s*1fr/);
  assert.deepEqual(resolveRuntimeLocale({ LanguageCode: "he" }), { language: "he", direction: "rtl" });
  assert.deepEqual(resolveRuntimeLocale({ LanguageCode: "en", LanguageDirection: "ltr" }), { language: "en", direction: "ltr" });
});

test("T-101/T-103/T-106: HTTP, offline, timeout-like abort, malformed, and valid-zero responses stay distinguishable", async () => {
  const context = acceptedContext();
  for (const status of [400, 401, 403, 500]) {
    const client = createApiClient(context, { fetchImpl: async () => response({ message: `status-${status}`, access_token: TOKEN }, status) });
    await assert.rejects(
      client.requestCurrent("currentEvents"),
      (error) => error.kind === "http" && error.status === status && !JSON.stringify(error).includes(TOKEN)
    );
  }
  const offline = createApiClient(context, { fetchImpl: async () => { throw new Error(`offline ${TOKEN}`); } });
  await assert.rejects(offline.requestCurrent("currentEvents"), (error) => error.kind === "network" && !JSON.stringify(error).includes(TOKEN));
  const malformed = createApiClient(context, { fetchImpl: async () => ({ ok: true, status: 200, text: async () => "not-json" }) });
  await assert.rejects(malformed.requestCurrent("currentEvents"), (error) => error.kind === "invalid-response");
  const abortController = new AbortController();
  abortController.abort();
  const aborted = createApiClient(context, { fetchImpl: async (_url, { signal }) => {
    assert.equal(signal.aborted, true);
    throw Object.assign(new Error("timed out"), { name: "AbortError" });
  }});
  await assert.rejects(aborted.requestCurrent("currentEvents", { signal: abortController.signal }), (error) => error.kind === "aborted");
  const zeroPermits = createApiClient(context, { fetchImpl: async () => response({ Items: [{ ValidCount: 0, MissingCount: 0, OverdueCount: 0, AsOf: "raw", ValueDate: "raw" }], TotalCount: 1 }) });
  const envelope = await zeroPermits.requestCurrent("currentPermits");
  assert.equal(envelope.Items[0].ValidCount, 0);
});

test("T-104/T-105: repeated permit activation performs one ready-command pair per activation in stable order", async () => {
  const log = [];
  const services = createHostServices(acceptedContext(), {
    ready: async () => log.push("ready"),
    executeCommand: async (name, parameter) => log.push([name, parameter]),
    ToDisplayDate: (value) => value
  });
  for (let activation = 0; activation < 3; activation += 1) {
    await services.ready();
    await services.executeCommand("Navigate", { Url: "#/Permits/Dashboard" });
  }
  assert.deepEqual(log, [
    "ready", ["Navigate", { Url: "#/Permits/Dashboard" }],
    "ready", ["Navigate", { Url: "#/Permits/Dashboard" }],
    "ready", ["Navigate", { Url: "#/Permits/Dashboard" }]
  ]);
});

test("T-104/T-105/T-106: permit navigation is exact, pending-locked, recoverable and retains focus contract", async () => {
  const app = await readFile(new URL("../../site/app.js", import.meta.url), "utf8");
  assert.match(app, /if \(permitNavigationPending\) return/);
  assert.match(app, /button\.disabled = true; button\.setAttribute\("aria-busy", "true"\)/);
  assert.match(app, /await hostServices\.ready\(\);\s*await hostServices\.executeCommand\("Navigate", \{ Url: "#\/Permits\/Dashboard" \}\)/s);
  assert.doesNotMatch(app, /#\/Permits\/Dashboard\?/);
  assert.match(app, /הנתונים נשארו זמינים/);
  assert.match(app, /permitNavigationPending = false/);
  assert.match(app, /removeAttribute\("aria-busy"\)/);
  assert.match(app, /event\.currentTarget\.focus\(\)/);
});

test("T-105/T-106: source-level responsive, zoom, bidi, accessibility and bounded aggregate UI contracts", async () => {
  const [html, css, app] = await Promise.all([
    readFile(new URL("../../site/index.html", import.meta.url), "utf8"),
    readFile(new URL("../../site/app.css", import.meta.url), "utf8"),
    readFile(new URL("../../site/app.js", import.meta.url), "utf8")
  ]);
  assert.match(html, /<a class="skip-link" href="#main-content">/);
  assert.ok(html.indexOf('id="snapshot-region"') < html.indexOf('id="controls"'));
  assert.equal((html.match(/id="snapshot-status"/g) || []).length, 1);
  assert.match(html, /role="status" aria-live="polite" aria-atomic="false"/);
  assert.match(css, /body\s*\{[^}]*min-inline-size:\s*320px[^}]*overflow-x:\s*hidden/s);
  assert.match(css, /\.snapshot-card\s*\{[^}]*min-inline-size:\s*0/s);
  assert.match(css, /@media \(max-width: 900px\)\s*\{\s*\.snapshot-grid\s*\{\s*grid-template-columns:\s*1fr/);
  assert.match(css, /@media \(max-width: 760px\)/);
  assert.match(css, /:focus-visible\s*\{[^}]*outline:\s*3px solid/);
  assert.match(css, /\.permit-metric\s*\{[^}]*min-block-size:\s*88px/s);
  assert.match(app, /<article class="snapshot-card"><h3>אירועים/);
  assert.match(app, /<article class="snapshot-card"><h3>אישורים/);
  assert.match(app, /<article class="snapshot-card"><h3>ציוד/);
  assert.equal((app.match(/class="permit-metric"/g) || []).length, 1, "one template creates exactly the three mapped permit controls");
  assert.doesNotMatch(app, /data\.equipment\.facts\.map|equipment\.facts\.map/);
  assert.match(app, /לא זמין/);
});

test("T-101/T-106: analytical body builder and snapshot transport remain isolated", async () => {
  const [api, dateRange] = await Promise.all([
    readFile(new URL("../../site/api-client.js", import.meta.url), "utf8"),
    readFile(new URL("../../site/date-range.js", import.meta.url), "utf8")
  ]);
  assert.match(api, /if \(CURRENT_DATASET_KEYS\.includes\(datasetKey\)\) throw new TypeError\("Use requestCurrent/);
  assert.match(api, /const requestBody = buildSearchBody\(range\)/);
  assert.match(api, /async function requestCurrent[\s\S]*body: "\{\}"/);
  assert.doesNotMatch(dateRange, /currentEvents|currentPermits|currentEquipment/);
});

test("T-107: local current-snapshot live-call flag remains false", () => {
  assert.equal(CURRENT_SNAPSHOT_LIVE_CALLS_ENABLED, false);
});
