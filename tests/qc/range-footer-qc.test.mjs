import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { performance } from "node:perf_hooks";

import { buildInclusiveRange } from "../../site/date-range.js";
import { loadDashboard } from "../../site/dashboard-data.js";
import { mapCurrentEvents, mapCurrentPermits } from "../../site/current-snapshot.js";
import { releaseFields } from "../../site/assets/release-footer.js";

const TASKS = Object.freeze(["T-301", "T-302", "T-303", "T-304", "T-305"]);
const TRACE = Object.freeze({
  "QC-301": ["T-301"],
  "QC-302": ["T-301", "T-302"],
  "QC-303": ["T-302", "T-304"],
  "QC-304": ["T-303"],
  "QC-305": ["T-303", "T-304"],
  "QC-306": ["T-304", "T-305"],
  "QC-307": ["T-305"],
  "QC-308": ["T-301", "T-304", "T-305"]
});

test("QC-301..QC-308 trace every shared task", () => {
  assert.deepEqual([...new Set(Object.values(TRACE).flat())].sort(), TASKS);
});

test("T-301: inclusive date contract accepts boundary/leap/cross-year and rejects invalid input before effects", () => {
  for (const [from, to] of [["1753-01-01", "1753-01-01"], ["2024-02-29", "2024-03-01"], ["2025-12-31", "2026-01-01"], ["9999-12-31", "9999-12-31"]]) {
    const range = buildInclusiveRange(from, to);
    assert.equal(range.FromDate, `${from}T00:00:00`);
    assert.equal(range.ToDate, `${to}T23:59:59.997`);
    assert.doesNotMatch(JSON.stringify(range), /Z/);
  }
  for (const pair of [["", "2026-01-01"], ["2023-02-29", "2023-03-01"], ["2026-02-01", "2026-01-31"], ["1752-12-31", "1753-01-01"], ["9999-12-31", "10000-01-01"]]) {
    assert.throws(() => buildInclusiveRange(...pair));
  }
});

test("T-301/T-302: one accepted range fans out four identical concurrent analytical bodies and zero snapshot calls", async () => {
  const calls = [];
  let active = 0;
  let peak = 0;
  let release;
  const gate = new Promise(resolve => { release = resolve; });
  const client = {
    requestItems: async (name, range) => {
      active += 1;
      peak = Math.max(peak, active);
      calls.push({ name, range: { ...range } });
      await gate;
      active -= 1;
      return [];
    },
    requestCurrent: async () => { throw new Error("analytics must not issue snapshot requests"); }
  };
  const pending = loadDashboard(client, { from: "2025-12-31", to: "2026-01-01" });
  await new Promise(resolve => setImmediate(resolve));
  assert.equal(calls.length, 4);
  assert.equal(peak, 4);
  assert.deepEqual(calls.map(call => call.name).sort(), ["category", "closure", "division", "summary"]);
  assert.ok(calls.every(call => call.range.FromDate === "2025-12-31T00:00:00" && call.range.ToDate === "2026-01-01T23:59:59.997"));
  release();
  await assert.rejects(pending, /invalid data/i);
});

test("T-302/T-304: 1,000-row-per-report analytical dispatch remains bounded", async () => {
  const rows = Array.from({ length: 1_000 }, (_, index) => ({ marker: index }));
  const decodedBytes = Buffer.byteLength(JSON.stringify(rows)) * 4;
  assert.ok(decodedBytes < 4 * 1024 * 1024);
  const started = performance.now();
  const calls = [];
  const client = { requestItems: async (name, range) => { calls.push({ name, range }); return rows; } };
  await assert.rejects(loadDashboard(client, { from: "2026-01-01", to: "2026-01-31" }), /invalid|missing|required/i);
  assert.equal(calls.length, 4, "malformed boundaries still exercise every report exactly once");
  assert.ok(performance.now() - started < 100, "bounded malformed mapping must fail promptly");
});

test("T-303: aggregate decimal strings normalize only for five count fields", () => {
  const mappedEvents = mapCurrentEvents({ Items: [
    { ScopeKey: "overall", TotalCount: " 9 ", OpenCount: "4", AsOf: "a" },
    { ScopeKey: "headquarters", TotalCount: "4", OpenCount: "1", AsOf: "a" },
    { ScopeKey: "branches", TotalCount: "5", OpenCount: "3", AsOf: "a" }
  ], TotalCount: 3 });
  assert.deepEqual([mappedEvents.overall.total, mappedEvents.overall.open], [9, 4]);
  assert.deepEqual(mapCurrentPermits({ Items: [{ ValidCount: "7", MissingCount: " 2 ", OverdueCount: "1", AsOf: "a", ValueDate: "v" }], TotalCount: 1 }),
    { valid: 7, missing: 2, overdue: 1, asOf: "a", valueDate: "v" });
});

test("T-303/T-304: malformed, unsafe and unreconciled aggregates are rejected without partial facts", () => {
  const bad = ["", " ", "+1", "-1", "1.0", "1e2", "9007199254740992", "9".repeat(10_000), null, undefined];
  for (const value of bad) {
    assert.throws(() => mapCurrentPermits({ Items: [{ ValidCount: value, MissingCount: 0, OverdueCount: 0, AsOf: "a", ValueDate: "v" }], TotalCount: 1 }), /invalid data/i);
  }
  assert.throws(() => mapCurrentEvents({ Items: [
    { ScopeKey: "overall", TotalCount: "10", OpenCount: "4", AsOf: "a" },
    { ScopeKey: "headquarters", TotalCount: "4", OpenCount: "1", AsOf: "a" },
    { ScopeKey: "branches", TotalCount: "5", OpenCount: "3", AsOf: "a" }
  ], TotalCount: 3 }), /invalid data/i);
});

test("T-304/T-305: release footer uses one all-state semantic shell and same-origin packaged assets", async () => {
  const [html, css, renderer] = await Promise.all([
    readFile(new URL("../../site/index.html", import.meta.url), "utf8"),
    readFile(new URL("../../site/assets/release-footer.css", import.meta.url), "utf8"),
    readFile(new URL("../../site/assets/release-footer.js", import.meta.url), "utf8")
  ]);
  assert.equal((html.match(/<footer\b[^>]*data-simplyvibe-release/g) || []).length, 1);
  assert.ok(html.indexOf("data-simplyvibe-release") > html.indexOf("</main>"));
  for (const name of ["version", "updated", "released"]) {
    assert.equal((html.match(new RegExp(`data-release-label="${name}"`, "g")) || []).length, 1);
    assert.equal((html.match(new RegExp(`data-release-value="${name}"`, "g")) || []).length, 1);
  }
  assert.match(html, /href="\.\/assets\/release-footer\.css"/);
  assert.match(html, /src="\.\/assets\/release-footer\.js"/);
  assert.match(css, /flex-wrap:\s*wrap/);
  assert.doesNotMatch(css, /position:\s*fixed/);
  assert.doesNotMatch(renderer, /fetch\s*\(|XMLHttpRequest|Authorization|access_token/);
});

test("T-305: footer truth table localizes unavailable, preview and production without invented current time", () => {
  for (const environment of [undefined, "", "staging", "PREVIEW", "production "]) {
    assert.deepEqual(Object.values(releaseFields({ releaseEnvironment: environment, releaseVersion: "abcdef123456", releaseUpdatedAt: "2026-01-01T00:00:00Z" }, "en", "UTC")).slice(1), ["Unavailable", "Unavailable", "Unavailable"]);
  }
  const preview = releaseFields({ releaseEnvironment: "preview", releaseVersion: "abcdef123456", releaseUpdatedAt: "2026-01-01T00:00:00Z", releaseReleasedAt: "" }, "he", "UTC");
  assert.equal(preview.version, "abcdef123456 (תצוגה מקדימה)");
  assert.equal(preview.released, "טרם פורסם");
  const production = releaseFields({ releaseEnvironment: "production", releaseVersion: "abcdef123456", releaseUpdatedAt: "2026-01-01T00:00:00Z", releaseReleasedAt: "2026-01-02T00:00:00Z" }, "en", "UTC");
  assert.equal(production.version, "abcdef123456");
  assert.notEqual(production.updated, "Unavailable");
  assert.notEqual(production.released, "Unavailable");
});

test("T-301/T-304/T-305: responsive RTL/LTR and accessible control contracts are present at required widths", async () => {
  const [html, css, footerCss, app] = await Promise.all([
    readFile(new URL("../../site/index.html", import.meta.url), "utf8"),
    readFile(new URL("../../site/app.css", import.meta.url), "utf8"),
    readFile(new URL("../../site/assets/release-footer.css", import.meta.url), "utf8"),
    readFile(new URL("../../site/app.js", import.meta.url), "utf8")
  ]);
  assert.match(html, /<html lang="he" dir="rtl">/);
  assert.match(app, /id="from-date" type="date"/);
  assert.match(app, /id="to-date" type="date"/);
  assert.match(app, /aria-invalid/);
  assert.match(app, /\.focus\(\)/);
  assert.match(css, /min-block-size:\s*44px/);
  assert.match(css, /@media \(max-width:\s*760px\)/);
  assert.match(css, /overflow-x:\s*hidden/);
  assert.match(footerCss, /\.release-footer/);
  assert.match(footerCss, /flex-wrap:\s*wrap/);
  assert.match(css, /:focus-visible/);
});
