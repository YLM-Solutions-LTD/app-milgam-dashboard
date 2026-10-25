# UAT evidence — test authoring cycle 3, process attempt 2

Runtime: Node.js v20.20.2. No browser or deployed preview was used. All authorization, API, and host effects were synthetic and locally fulfilled.

Inventories:

- UAT: `tests/uat/current-snapshot.uat.test.mjs`, `tests/uat/verified-host-bridge.uat.test.mjs`.
- QC: `tests/qc/snapshot-qc.test.js`, `tests/qc/sdk-bridge-qc.test.mjs`, `tests/qc/operator-reentry-race.test.mjs`. Both `.js` and `.mjs` extensions were included.

Exact commands and results:

- `cd /workspace/src/apps/milgam-dashboard && find tests/uat -type f -print | sort` — two UAT `.test.mjs` files; none omitted.
- `cd /workspace/src/apps/milgam-dashboard && node --test tests/uat/*.test.mjs` — 23 passed, 0 failed, 0 skipped. Coverage includes a three-request pre-release concurrency barrier, 20-way shared live verification, silent disconnect denial, terminal 401 taint, 500/401 stale retention, exact Navigate, overlapping re-entry to generation 3, and zero unhandled disposal rejection. The 10,000-row mapper run was 26.514 ms for 1,043,924 decoded bytes.
- `cd /workspace/src/apps/milgam-dashboard/site && npm test` — 61 passed, 0 failed, 0 skipped.
- `cd /workspace/src/apps/milgam-dashboard && node --test tests/qc/*.test.js tests/qc/*.test.mjs` — 33 passed, 0 failed, 0 skipped across the complete QC inventory.
- `cd /workspace/.simplyvibe/input/controller-host-harness && node --test host-fixture.test.mjs` — 2 passed, 0 failed, 0 skipped.

The packaged and supplied SimplyVibeClient files are byte-identical: SHA-256 `ee67f5ae15c70fee8443701b4391946a2275d922acdf9d1797c69dad3c414bf1`.

Current-finding evidence:

- Terminal 401/403 and zero unchanged-generation traffic: UAT-208 and site authorization-rejection tests.
- Fresh and overlapping re-entry, exactly three snapshot routes, no lost newest generation: UAT-208 faithful GuestBridge tests and `operator-reentry-race.test.mjs`.
- 500/401 last-good retention with unchanged timestamp: UAT-205/UAT-208 snapshot-controller behavior.
- Permit Navigate generation binding and expected disposal/reset rejection handling: UAT-206/UAT-209 and faithful GuestBridge tests.
- Legacy-context denial and metadata-only errors: UAT-208/UAT-210.
- Silent disconnect and shared verification: faithful SDK UAT with 20 concurrent verification calls.
- Refresh request amplification: current UAT proves all three current routes start before release and the complete QC suite passes. Full app-control coalescing across header refresh, status retry, and analytical retry requires independent browser reproduction in exact-preview review; accepted operator measurements were not reused as this role's approval.

Limitations: the faithful controller fixture proves local SDK/GuestBridge protocol behavior, not real tenant permissions. Exact deployed viewport, CSP/network, DOM/render, 20-activation, and refresh-control/retry-path browser checks were not authorized in this stage and are not claimed.
