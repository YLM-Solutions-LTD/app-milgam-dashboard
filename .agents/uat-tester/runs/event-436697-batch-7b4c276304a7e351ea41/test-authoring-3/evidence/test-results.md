# Test evidence — recovered attempt 1

Runtime: Node.js v20.20.2. Inventory discovered `tests/uat/current-snapshot.uat.test.mjs`, `tests/uat/verified-host-bridge.uat.test.mjs`, `tests/qc/snapshot-qc.test.js`, `tests/qc/sdk-bridge-qc.test.mjs`, and `tests/qc/operator-reentry-race.test.mjs`. All traffic was synthetic/local; no real tenant token or request was used.

## Commands and results

- `cd /workspace/src/apps/milgam-dashboard/site && npm test` — 61 passed, 0 failed, 0 skipped; TAP duration 317.492 ms.
- `cd /workspace/src/apps/milgam-dashboard && node --test tests/qc/*.test.js tests/qc/*.test.mjs` — 30 passed, 0 failed, 0 skipped; TAP duration 490.335 ms. This includes `operator-reentry-race.test.mjs`; no extension was omitted.
- `cd /workspace/src/apps/milgam-dashboard && node --test tests/uat/*.test.mjs` — 21 passed, 0 failed, 0 skipped; TAP duration 190.315 ms.
- `cd /workspace && node --test .simplyvibe/input/controller-host-harness/*.test.mjs` — 2 passed, 0 failed, 0 skipped; TAP duration 78.095 ms.

The UAT equipment measurements were 0 rows/0.007 ms/27 bytes, 1 row/0.011 ms/127 bytes, 1,000 rows/2.872 ms/103,422 bytes, and 10,000 rows/26.375 ms/1,043,924 bytes after warm-up. The 10,000-row acceptance budget of 100 ms passed.

The packaged SDK test compares the guest SDK byte-for-byte with the controller copy, initializes it at the corrected Milgam origin, completes Ready through the real supplied GuestBridge, verifies exact Navigate, rotates the session, rejects the old pending command with zero effects, and accepts fresh generations. The added overlap case calls `reenter()` and a microtask `reenter()`, observes generation 3, automatically starts exactly events/permits/equipment for that newest context, and captures zero unhandled rejections. API fixtures are intercepted and synthetic.

Behavioral evidence also proves: HTTP 500/401 refresh keeps the identical committed data and timestamp stale; post-401 requests on the rejected generation remain zero; legacy unbound context cannot create API/host authority; held old commands have zero effects and fresh Navigate succeeds; diagnostics omit distinctive response-body markers and API addresses; permit guard ordering remains synchronous and settlement-bound. Source contract checks are supplementary, not the sole lifecycle evidence.

## Limitations

No exact preview was authorized for this stage. Therefore deployed bytes and headers, browser viewports, runtime CSP/network behavior, DOM/render budgets, and app-level 20-activation behavior were not executed or claimed. The faithful harness proves protocol behavior but not real tenant permissions. The controller owns final review and release.
