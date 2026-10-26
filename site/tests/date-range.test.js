import test from "node:test";
import assert from "node:assert/strict";
import { buildDateRange } from "../date-range.js";
import { loadDashboard } from "../dashboard-data.js";
import { snapshotErrorCopy } from "../snapshot-error.js";

test("ranges include a single final calendar day at SQL datetime precision without timezone conversion", () => {
  const range = buildDateRange("2024-02-29", "2024-02-29");
  assert.deepEqual(range, { FromDate: "2024-02-29T00:00:00", ToDate: "2024-02-29T23:59:59.997" });
  assert.ok("2024-02-29T23:59:59.997" <= range.ToDate);
  assert.ok("2024-03-01T00:00:00" > range.ToDate);
});

test("ranges may span months and years, including SQL datetime date limits", () => {
  assert.deepEqual(buildDateRange("2025-12-20", "2026-02-03"), {
    FromDate: "2025-12-20T00:00:00", ToDate: "2026-02-03T23:59:59.997"
  });
  assert.equal(buildDateRange("1753-01-01", "9999-12-31").ToDate, "9999-12-31T23:59:59.997");
});

test("invalid, reversed, non-calendar and unsupported ranges are rejected before requests", async () => {
  for (const [fromDate, toDate] of [
    ["2026-02-01", "2026-01-31"], ["2025-02-29", "2025-03-01"],
    ["2026-04-31", "2026-05-01"], ["", "2026-01-01"], ["2026-1-1", "2026-01-02"],
    ["1752-12-31", "1753-01-01"], ["2026-00-01", "2026-01-01"]
  ]) {
    let calls = 0;
    await assert.rejects(loadDashboard({ requestItems() { calls++; } }, { fromDate, toDate }), RangeError);
    assert.equal(calls, 0);
  }
});

test("snapshot errors identify the report without exposing response text, credentials, or untrusted diagnostics", () => {
  const failure = snapshotErrorCopy({ kind: "http", status: 500, dataset: "MilgamDashboardCurrentEquipment", body: "secret-token-and-personal-data", detail: "private" });
  assert.match(failure.message, /הציוד/);
  assert.equal(failure.diagnostic, "/api/Entity/MilgamDashboardCurrentEquipment/Search · HTTP 500");
  assert.doesNotMatch(JSON.stringify(failure), /secret|personal|private/);
  assert.equal(snapshotErrorCopy({ dataset: "secret-token", kind: "private" }).diagnostic, "currentSnapshot · unknown");
});

test("snapshot permission failures require re-entry; network, server and contract errors stay distinct", () => {
  assert.equal(snapshotErrorCopy({ status: 403 }).retry, false);
  assert.match(snapshotErrorCopy({ status: 403 }).message, /אין הרשאה/);
  assert.equal(snapshotErrorCopy({ status: 401 }).retry, false);
  assert.equal(snapshotErrorCopy({ kind: "authorization-revoked" }).retry, false);
  assert.match(snapshotErrorCopy({ kind: "network" }).message, /להתחבר לשרת/);
  assert.match(snapshotErrorCopy({ kind: "invalid-response" }).message, /מבנה נתונים/);
});
