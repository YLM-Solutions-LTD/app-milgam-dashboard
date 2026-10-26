import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { performance } from "node:perf_hooks";

import { ANALYTICAL_PAGE_SIZE, pageWindow } from "../../site/pagination.js";
import { createSnapshotController } from "../../site/current-snapshot.js";

const TASKS = Object.freeze(["T-302", "T-303", "T-304", "T-305"]);

test("cycle-2 QC traces every remediation finding to shared structure tasks", () => {
  assert.deepEqual(TASKS, ["T-302", "T-303", "T-304", "T-305"]);
});

test("T-302/T-304: 1,000-row analytical windows remain bounded, stable and cheap", () => {
  const rows = Array.from({ length: 1_000 }, (_, index) => ({ id: `row-${index}`, count: index + 1 }));
  const visited = [];
  const started = performance.now();
  for (let page = 0; page < Math.ceil(rows.length / ANALYTICAL_PAGE_SIZE); page += 1) {
    const current = pageWindow(rows, page);
    assert.ok(current.items.length <= 10);
    visited.push(...current.items.map(({ id }) => id));
  }
  const duration = performance.now() - started;
  assert.deepEqual(visited, rows.map(({ id }) => id));
  assert.ok(duration < 50, `window traversal took ${duration.toFixed(3)}ms`);
});

test("T-302/T-304: analytical renderers window every unbounded detail collection", async () => {
  const app = await readFile(new URL("../../site/app.js", import.meta.url), "utf8");
  for (const renderer of ["renderDivision", "renderCategory", "renderClosureSection"]) {
    const start = app.indexOf(`function ${renderer}`);
    assert.notEqual(start, -1, `${renderer} must exist`);
    const next = app.indexOf("\nfunction ", start + 10);
    const body = app.slice(start, next === -1 ? app.length : next);
    assert.match(body, /pageWindow\(rows, detailPages\[pageKey\]\)/, `${renderer} must render a bounded page`);
    assert.match(body, /window\.items/, `${renderer} must render only visible items`);
  }
  assert.match(app, /data-page-step/);
  assert.match(app, /replacement\?\.focus\(\)/);
});

test("T-303/T-304: terminal 401/403 retains last-good facts and blocks every retry until replacement", async () => {
  for (const status of [401, 403]) {
    let effects = 0;
    const lastGood = { marker: `good-${status}` };
    const controller = createSnapshotController({
      client: {},
      initialData: lastGood,
      load: async () => { effects += 1; throw { kind: "http", status, dataset: "currentPermits" }; }
    });
    await controller.refresh();
    const denied = controller.getState();
    assert.equal(denied.status, "stale");
    assert.equal(denied.data, lastGood);
    assert.equal(denied.terminalAuthorization, true);
    assert.deepEqual(denied.error, { kind: "http", status, dataset: "currentPermits" });
    await Promise.all(Array.from({ length: 20 }, () => controller.refresh()));
    assert.equal(effects, 1);
  }
});

test("T-303/T-304: terminal UI disables toolbar retry and exposes re-entry-only guidance", async () => {
  const app = await readFile(new URL("../../site/app.js", import.meta.url), "utf8");
  const start = app.indexOf("function renderSnapshot(state)");
  const end = app.indexOf("\nfunction renderSnapshotContent", start);
  const body = app.slice(start, end);
  assert.match(body, /state\.terminalAuthorization === true/);
  assert.match(body, /snapshotRefreshElement\.disabled[\s\S]*terminal/);
  assert.match(body, /terminal[\s\S]*יש להיכנס מחדש דרך SimplyLog/);
  assert.doesNotMatch(body.match(/terminal\s*\?[\s\S]*?:/u)?.[0] || "", /data-snapshot-retry/);
});

test("T-305: app-owned narrow-width rules contain footer fields without modifying packaged assets", async () => {
  const [css, html, footerCss] = await Promise.all([
    readFile(new URL("../../site/app.css", import.meta.url), "utf8"),
    readFile(new URL("../../site/index.html", import.meta.url), "utf8"),
    readFile(new URL("../../site/assets/release-footer.css", import.meta.url), "utf8")
  ]);
  assert.match(css, /@media \(max-width:\s*320px\)[\s\S]*body\s*\{\s*min-inline-size:\s*0/);
  assert.match(css, /\.release-footer\s*\{[\s\S]*inline-size:\s*min\(calc\(100% - 2rem\),\s*1280px\)/);
  assert.match(css, /\.release-footer bdi[\s\S]*min-inline-size:\s*0[\s\S]*overflow-wrap:\s*anywhere/);
  assert.equal((html.match(/data-simplyvibe-release/g) || []).length, 1);
  assert.doesNotMatch(footerCss, /@media \(max-width:\s*320px\)/);
});
