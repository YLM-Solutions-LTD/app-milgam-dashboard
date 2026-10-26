import test from "node:test";
import assert from "node:assert/strict";
import { ANALYTICAL_PAGE_SIZE, pageWindow } from "../pagination.js";

test("analytical pages are bounded, stable, complete, and clamp safely", () => {
  const rows = Array.from({ length: 1_000 }, (_, index) => ({ id: index }));
  const visited = [];
  for (let page = 0; page < Math.ceil(rows.length / ANALYTICAL_PAGE_SIZE); page += 1) {
    const window = pageWindow(rows, page);
    assert.ok(window.items.length <= ANALYTICAL_PAGE_SIZE);
    visited.push(...window.items.map(({ id }) => id));
  }
  assert.deepEqual(visited, rows.map(({ id }) => id));
  assert.equal(pageWindow(rows, 10_000).page, 99);
  assert.equal(pageWindow(rows, -4).page, 0);
});

test("empty and partial analytical pages expose correct ranges", () => {
  assert.deepEqual(pageWindow([], 0), { items: [], page: 0, pageCount: 1, start: 0, end: 0, total: 0, hasPrevious: false, hasNext: false });
  const final = pageWindow(Array.from({ length: 13 }, (_, id) => ({ id })), 1);
  assert.deepEqual(final.items.map(({ id }) => id), [10, 11, 12]);
  assert.equal(final.start, 10);
  assert.equal(final.end, 13);
});
