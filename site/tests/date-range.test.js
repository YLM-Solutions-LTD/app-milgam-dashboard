import test from "node:test";
import assert from "node:assert/strict";
import { buildInclusiveRange } from "../date-range.js";

test("inclusive ranges support one day and cross-year values without timezone suffix", () => {
  assert.deepEqual(buildInclusiveRange("2024-02-29", "2024-02-29"), {
    from: "2024-02-29", to: "2024-02-29",
    FromDate: "2024-02-29T00:00:00", ToDate: "2024-02-29T23:59:59.997"
  });
  assert.equal(buildInclusiveRange("2025-12-31", "2026-01-01").ToDate, "2026-01-01T23:59:59.997");
});

test("inclusive ranges reject missing, impossible, reversed, and out-of-bound values", () => {
  for (const pair of [["", "2026-01-01"], ["2023-02-29", "2023-03-01"], ["2026-02-01", "2026-01-31"], ["1752-12-31", "1753-01-01"]]) {
    assert.throws(() => buildInclusiveRange(...pair));
  }
  assert.equal(buildInclusiveRange("1753-01-01", "9999-12-31").from, "1753-01-01");
});
