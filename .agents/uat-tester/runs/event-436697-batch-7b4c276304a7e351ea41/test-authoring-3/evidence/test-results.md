# UAT evidence — test authoring cycle 3, attempt 1

Runtime: Node.js v20.20.2. No browser or deployed preview was used. All authorization, API, and host effects were synthetic and locally fulfilled.

Inventory:

- `tests/uat/current-snapshot.uat.test.mjs`
- `tests/uat/verified-host-bridge.uat.test.mjs`

Exact commands and results:

- `cd /workspace/src/apps/milgam-dashboard && find tests/uat -type f -print | sort` — 2 `.test.mjs` files discovered; neither was omitted.
- `cd /workspace/src/apps/milgam-dashboard && node --test tests/uat/*.test.mjs` — 23 passed, 0 failed, 0 skipped. Includes 20-way shared verification, silent disconnect denial, 401 terminal taint, 500/401 stale retention, exact Navigate, overlapping re-entry to generation 3, and zero unhandled disposal rejection.
- `cd /workspace/src/apps/milgam-dashboard/site && npm test` — 61 passed, 0 failed, 0 skipped.
- `cd /workspace/.simplyvibe/input/controller-host-harness && node --test host-fixture.test.mjs` — 2 passed, 0 failed, 0 skipped.

The packaged and supplied SimplyVibeClient files are byte-identical (SHA-256 `ee67f5ae15c70fee8443701b4391946a2275d922acdf9d1797c69dad3c414bf1`). The 10,000-row UAT mapper sample completed in 25.028 ms (1,043,924 decoded bytes), below the 100 ms contract.

Limitations: this stage does not authorize an exact deployed preview, a real tenant token, or tenant permission checks. The faithful fixture validates protocol/lifecycle behavior but does not prove deployed tenant permission configuration. Browser viewport, deployed CSP/network, DOM/render budgets, and exact-preview 20-activation behavior remain final-review work.
