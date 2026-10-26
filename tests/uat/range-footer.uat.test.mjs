import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

import { loadDashboard, loadPeriods } from "../../site/dashboard-data.js";
import { buildInclusiveRange } from "../../site/date-range.js";
import { mapCurrentEvents, mapCurrentPermits } from "../../site/current-snapshot.js";
import { releaseFields, renderReleaseFooters } from "../../site/assets/release-footer.js";

const TRACE = Object.freeze({
  "UAT-301": ["T-301", "T-302"],
  "UAT-302": ["T-301", "T-302", "T-304"],
  "UAT-303": ["T-303", "T-304"],
  "UAT-304": ["T-302", "T-303", "T-304"],
  "UAT-305": ["T-304", "T-305"]
});

test("UAT-301 through UAT-305 trace every revision-12 task", () => {
  assert.deepEqual([...new Set(Object.values(TRACE).flat())].sort(), ["T-301", "T-302", "T-303", "T-304", "T-305"]);
});

test("UAT-301 accepts inclusive boundary, leap-day, one-day, and cross-year ranges", () => {
  for (const [from, to] of [
    ["1753-01-01", "9999-12-31"],
    ["2024-02-29", "2024-02-29"],
    ["2025-12-31", "2026-01-01"]
  ]) {
    const result = buildInclusiveRange(from, to);
    assert.equal(result.FromDate, `${from}T00:00:00`);
    assert.equal(result.ToDate, `${to}T23:59:59.997`);
    assert.doesNotMatch(JSON.stringify(result), /Z/);
  }
  for (const pair of [["", "2026-01-01"], ["2023-02-29", "2023-03-01"], ["2026-02-01", "2026-01-31"], ["1752-12-31", "1753-01-01"]]) {
    assert.throws(() => buildInclusiveRange(...pair));
  }
});

test("UAT-302 empty discovery seeds a usable default and an Apply loads exactly four identical bodies", async () => {
  const periodBodies = [];
  const empty = await loadPeriods({ requestItems: async (_name, body) => { periodBodies.push(body); return []; } }, { now: new Date("2026-03-15T12:00:00Z") });
  assert.deepEqual(empty.selectedRange, {
    from: "2026-03-01", to: "2026-03-31",
    FromDate: "2026-03-01T00:00:00", ToDate: "2026-03-31T23:59:59.997"
  });
  assert.equal(periodBodies.length, 1);

  const calls = [];
  await assert.rejects(loadDashboard({ requestItems: async (name, body) => {
    calls.push({ name, body });
    return [];
  } }, { from: "2025-12-31", to: "2026-01-01" }), /returned invalid data/);
  assert.deepEqual(calls.map(({ name }) => name).sort(), ["category", "closure", "division", "summary"]);
  assert.equal(calls.length, 4);
  const bounds = calls.map(({ body }) => ({ FromDate: body.FromDate, ToDate: body.ToDate }));
  assert.ok(bounds.every((body) => JSON.stringify(body) === JSON.stringify(bounds[0])));
  assert.deepEqual(bounds[0], { FromDate: "2025-12-31T00:00:00", ToDate: "2026-01-01T23:59:59.997" });
});

test("UAT-303 HTTP-200 decimal strings normalize end-to-end while unsafe forms fail closed", () => {
  const events = mapCurrentEvents({ Items: [
    { ScopeKey: "overall", TotalCount: " 12 ", OpenCount: "5", AsOf: "2026-10-26" },
    { ScopeKey: "headquarters", TotalCount: "4", OpenCount: "2", AsOf: "2026-10-26" },
    { ScopeKey: "branches", TotalCount: "8", OpenCount: "3", AsOf: "2026-10-26" }
  ], TotalCount: 3 });
  assert.deepEqual([events.overall.total, events.overall.open], [12, 5]);
  const permits = mapCurrentPermits({ Items: [{ ValidCount: "7", MissingCount: "3", OverdueCount: "2", AsOf: "a", ValueDate: "v" }], TotalCount: 1 });
  assert.deepEqual([permits.valid, permits.missing, permits.overdue], [7, 3, 2]);

  for (const invalid of ["", " ", "+1", "-1", "1.0", "1e2", "9007199254740992", "12345678901234567", null, undefined]) {
    assert.throws(() => mapCurrentPermits({ Items: [{ ValidCount: invalid, MissingCount: 0, OverdueCount: 0, AsOf: "a", ValueDate: "v" }], TotalCount: 1 }));
  }
});

test("UAT-304 source preserves analytics/snapshot isolation, enabled live calls, and exact Navigate", async () => {
  const [app, constants, html] = await Promise.all([
    readFile(new URL("../../site/app.js", import.meta.url), "utf8"),
    readFile(new URL("../../site/constants.js", import.meta.url), "utf8"),
    readFile(new URL("../../site/index.html", import.meta.url), "utf8")
  ]);
  assert.match(constants, /CURRENT_SNAPSHOT_LIVE_CALLS_ENABLED\s*=\s*true/);
  assert.match(app, /function refreshAnalyticsAuthorization\(\)/);
  assert.match(app, /function refreshSnapshot\(\)/);
  assert.match(app, /Navigate[\s\S]*#\/Permits\/Dashboard/);
  assert.match(html, /assets\/simplyvibe-client\.js/);
  assert.doesNotMatch(html, /SimplyVibeHostAdapter/);
});

function footerDocument(dataset, lang = "en") {
  const values = new Map();
  const labels = new Map();
  for (const name of ["version", "updated", "released"]) {
    values.set(name, { textContent: "" });
    labels.set(name, { textContent: "" });
  }
  const footer = {
    dataset,
    attributes: {},
    setAttribute(name, value) { this.attributes[name] = value; },
    querySelector(selector) {
      const match = /data-release-(label|value)="([^"]+)"/.exec(selector);
      return match?.[1] === "label" ? labels.get(match[2]) : values.get(match?.[2]);
    }
  };
  return { documentElement: { lang }, querySelectorAll: () => [footer], footer, values, labels };
}

test("UAT-305 release footer is singular, external to main, packaged unchanged, and network independent", async () => {
  const [html, appRenderer, packagedRenderer, appCss, packagedCss] = await Promise.all([
    readFile(new URL("../../site/index.html", import.meta.url), "utf8"),
    readFile(new URL("../../site/assets/release-footer.js", import.meta.url), "utf8"),
    readFile("/home/codex/.codex/skills/simplylog-mini-app-builder/assets/release-footer.js", "utf8"),
    readFile(new URL("../../site/assets/release-footer.css", import.meta.url), "utf8"),
    readFile("/home/codex/.codex/skills/simplylog-mini-app-builder/assets/release-footer.css", "utf8")
  ]);
  assert.equal((html.match(/<footer\b[^>]*data-simplyvibe-release/g) || []).length, 1);
  assert.ok(html.indexOf("</main>") < html.indexOf("data-simplyvibe-release"));
  assert.equal(appRenderer, packagedRenderer);
  assert.equal(appCss, packagedCss);
  assert.doesNotMatch(appRenderer, /fetch\s*\(|XMLHttpRequest|Authorization|access_token/);
  assert.match(appCss, /flex-wrap:\s*wrap/);

  for (const releaseEnvironment of [undefined, "", "staging", "PREVIEW", "production "]) {
    assert.deepEqual(Object.values(releaseFields({ releaseEnvironment, releaseVersion: "abcdef123456", releaseUpdatedAt: "2026-01-01T00:00:00Z" }, "en", "UTC")).slice(1), ["Unavailable", "Unavailable", "Unavailable"]);
  }
  const preview = releaseFields({ releaseEnvironment: "preview", releaseVersion: "abcdef123456", releaseUpdatedAt: "2026-01-01T00:00:00Z", releaseReleasedAt: "" }, "en", "UTC");
  assert.deepEqual([preview.version, preview.released], ["abcdef123456 (Preview)", "Not released"]);
  const production = releaseFields({ releaseEnvironment: "production", releaseVersion: "abcdef123456", releaseUpdatedAt: "2026-01-01T00:00:00Z", releaseReleasedAt: "2026-01-02T00:00:00Z" }, "he", "UTC");
  assert.notEqual(production.updated, "לא זמין");
  assert.notEqual(production.released, "לא זמין");

  const doc = footerDocument({ releaseEnvironment: "preview", releaseVersion: "abcdef123456", releaseUpdatedAt: "2026-01-01T00:00:00Z", releaseReleasedAt: "" }, "he");
  renderReleaseFooters(doc);
  assert.equal(doc.labels.get("version").textContent, "גרסה");
  doc.documentElement.lang = "en";
  renderReleaseFooters(doc);
  assert.equal(doc.labels.get("version").textContent, "Version");
  assert.equal(doc.values.get("released").textContent, "Not released");
});
