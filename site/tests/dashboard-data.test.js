import test from "node:test";
import assert from "node:assert/strict";

import { loadDashboard, loadPeriods } from "../dashboard-data.js";

test("period discovery uses the long discovery range and latest available month", async () => {
  const calls = [];
  const client = {
    async requestItems(key, range) {
      calls.push({ key, range });
      return [
        { Year: 2026, Month: 7, Label: "7/26", EventCount: 1 },
        { Year: 2026, Month: 8, Label: "8/26", EventCount: 2 }
      ];
    }
  };

  const result = await loadPeriods(client, { now: new Date(2026, 7, 20) });
  assert.deepEqual(calls, [{
    key: "periods",
    range: { FromDate: "2000-01-01T00:00:00", ToDate: "2026-08-31T23:59:59.997" }
  }]);
  assert.deepEqual(result.selectedRange, {
    from: "2026-08-01", to: "2026-08-31",
    FromDate: "2026-08-01T00:00:00", ToDate: "2026-08-31T23:59:59.997"
  });
});

test("four analytical datasets start in parallel with the exact same inclusive range and signal", async () => {
  const calls = [];
  const resolvers = new Map();
  const controller = new AbortController();
  const client = {
    requestItems(key, range, options) {
      calls.push({ key, range, signal: options.signal });
      return new Promise((resolve) => resolvers.set(key, resolve));
    }
  };

  const promise = loadDashboard(client, { from: "2024-02-01", to: "2024-02-29" }, { signal: controller.signal });
  await Promise.resolve();
  assert.deepEqual(calls.map((call) => call.key), ["division", "summary", "category", "closure"]);
  assert.equal(calls.every((call) => call.signal === controller.signal), true);
  assert.equal(calls.every((call) => call.range.FromDate === "2024-02-01T00:00:00"), true);
  assert.equal(calls.every((call) => call.range.ToDate === "2024-02-29T23:59:59.997"), true);

  resolvers.get("division")([]);
  resolvers.get("summary")([
    zeroSummary("headquarters", "מטה", 1),
    zeroSummary("branches", "סניפים", 2)
  ]);
  resolvers.get("category")([]);
  resolvers.get("closure")([]);
  const result = await promise;
  assert.equal(result.isEmpty, true);
});

function zeroSummary(ScopeKey, ScopeLabel, ScopeOrder) {
  return {
    ScopeKey,
    ScopeLabel,
    ScopeOrder,
    EventCount: 0,
    ClosedCount: 0,
    EligibleDurationCount: 0,
    InvalidDurationCount: 0,
    AverageCloseDays: null
  };
}
