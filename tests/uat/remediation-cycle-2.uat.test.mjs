import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

import { pageWindow, ANALYTICAL_PAGE_SIZE } from "../../site/pagination.js";
import { createSnapshotController } from "../../site/current-snapshot.js";

const REMEDIATION_TRACE = Object.freeze({
  "perf-preview-analytical-1000-row-unbounded-dom-long-tasks-v1": ["T-302", "T-304"],
  "uat-snapshot-terminal-401-retry-enabled-v1": ["T-303", "T-304"],
  "qc-footer-320-rtl-edge-clipping-v1": ["T-305"]
});

test("UAT-306 cycle-2 remediation fingerprints trace every affected structure task", () => {
  assert.deepEqual(Object.keys(REMEDIATION_TRACE), [
    "perf-preview-analytical-1000-row-unbounded-dom-long-tasks-v1",
    "uat-snapshot-terminal-401-retry-enabled-v1",
    "qc-footer-320-rtl-edge-clipping-v1"
  ]);
  assert.deepEqual([...new Set(Object.values(REMEDIATION_TRACE).flat())].sort(), ["T-302", "T-303", "T-304", "T-305"]);
});

test("UAT-307 representative 1,000-row analytical detail stays in bounded ten-item windows", () => {
  const rows = Array.from({ length: 1_000 }, (_, index) => ({ id: index + 1 }));
  assert.equal(ANALYTICAL_PAGE_SIZE, 10);
  const visited = [];
  for (let page = 0; page < 100; page += 1) {
    const window = pageWindow(rows, page);
    assert.equal(window.items.length, 10);
    assert.equal(window.pageCount, 100);
    assert.ok(window.items.length <= ANALYTICAL_PAGE_SIZE);
    visited.push(...window.items.map(({ id }) => id));
  }
  assert.deepEqual(visited, Array.from({ length: 1_000 }, (_, index) => index + 1));
  assert.deepEqual(pageWindow(rows, 10_000).items.map(({ id }) => id), rows.slice(-10).map(({ id }) => id));
});

test("UAT-308 terminal 401 retains last-good data and admits no retry in the rejected generation", async () => {
  let loads = 0;
  const committed = Object.freeze({ marker: "synthetic-last-good" });
  const controller = createSnapshotController({ client: {}, load: async () => {
    loads += 1;
    if (loads === 1) return committed;
    throw { kind: "http", status: 401, dataset: "MilgamDashboardCurrentEvents" };
  }});

  await controller.refresh();
  await controller.refresh();
  const denied = controller.getState();
  assert.equal(denied.status, "stale");
  assert.equal(denied.data, committed);
  assert.equal(denied.terminalAuthorization, true);
  assert.deepEqual(denied.error, { kind: "http", status: 401, dataset: "MilgamDashboardCurrentEvents" });

  await Promise.all(Array.from({ length: 10 }, () => controller.refresh()));
  assert.equal(loads, 2, "terminal generation must initiate zero retry effects");
  assert.equal(controller.getState(), denied, "blocked retry activations must not mutate terminal state");

  const appSource = await readFile(new URL("../../site/app.js", import.meta.url), "utf8");
  assert.match(appSource, /snapshotRefreshElement\.disabled\s*=\s*[^;]*\|\| terminal/);
  assert.match(appSource, /ההרשאה לתמונת המצב פגה/);
  assert.match(appSource, /terminal[\s\S]*יש להיכנס מחדש דרך SimplyLog/);
});

test("UAT-309 supplemental 320px RTL footer fix preserves packaged assets and recoverable wrapping", async () => {
  const [appCss, footerCss, packagedFooterCss, footerJs, packagedFooterJs] = await Promise.all([
    readFile(new URL("../../site/app.css", import.meta.url), "utf8"),
    readFile(new URL("../../site/assets/release-footer.css", import.meta.url), "utf8"),
    readFile("/home/codex/.codex/skills/simplylog-mini-app-builder/assets/release-footer.css", "utf8"),
    readFile(new URL("../../site/assets/release-footer.js", import.meta.url), "utf8"),
    readFile("/home/codex/.codex/skills/simplylog-mini-app-builder/assets/release-footer.js", "utf8")
  ]);
  assert.equal(footerCss, packagedFooterCss);
  assert.equal(footerJs, packagedFooterJs);
  assert.match(appCss, /@media \(max-width: 320px\)[\s\S]*body\s*\{\s*min-inline-size:\s*0/);
  assert.match(appCss, /\.release-footer\s*\{[\s\S]*max-inline-size:\s*calc\(100% - 2rem\)/);
  assert.match(appCss, /\.release-footer bdi[\s\S]*min-inline-size:\s*0[\s\S]*overflow-wrap:\s*anywhere/);
  assert.doesNotMatch(appCss, /\.release-footer[^{]*\{[^}]*overflow-x:\s*hidden/);
});
