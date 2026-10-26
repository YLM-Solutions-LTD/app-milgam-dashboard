# Implementation evidence

## Implemented tasks

- `T-301`: `site/date-range.js`, `site/app.js`, and `site/app.css` now provide native From/To controls, strict Gregorian validation for years 1753–9999, inclusive timezone-less `.997` bounds, inline announced errors, focus, and responsive logical layout.
- `T-302`: `site/dashboard-data.js` and `site/dashboard-machine.js` use a generation-bound `selectedRange`; four report calls share identical bounds, superseded loads abort, refresh retains the applied range, re-entry preserves it, and snapshot refresh is separate.
- `T-303`: `site/current-snapshot.js` normalizes only the five approved aggregate fields from safe numbers or trimmed digit-only strings while retaining numeric envelopes and unchanged equipment/reconciliation rules.
- `T-305`: packaged `site/assets/release-footer.js` and `.css` match the repaired skill hashes; exactly one semantic footer is outside state-dependent main content and defaults truthfully to unavailable.
- `T-304`: expanded site tests cover strict ranges, decimal strings, and footer metadata rules; complete configured inventories were executed.

## Discovered inventory

- Site: 11 `*.test.js` files.
- QC: one `*.test.js`, two `*.test.mjs` files.
- UAT: two `*.test.mjs` files.
- Controller harness: one `*.test.mjs` file.
- No `*.test.cjs` or `*.spec.{js,mjs,cjs}` files were found.

## Process-attempt-2 commands and results

1. `cd site && npm test` — 67 passed, 0 failed, 0 skipped.
2. `node --test tests/qc/snapshot-qc.test.js tests/qc/operator-reentry-race.test.mjs tests/qc/sdk-bridge-qc.test.mjs` — 33 passed, 1 failed, 0 skipped. The failure is `every refresh entry point shares the application single-flight through settlement`; its source regex requires the prior coupled analytics+snapshot refresh implementation, conflicting with revision 12 isolation.
3. `node --test tests/uat/current-snapshot.uat.test.mjs tests/uat/verified-host-bridge.uat.test.mjs` — 23 passed, 0 failed, 0 skipped when run sequentially as configured.
4. `cd /workspace/.simplyvibe/input/controller-host-harness && node --test host-fixture.test.mjs` — 2 passed, 0 failed, 0 skipped using the actual packaged SDK/GuestBridge and local synthetic traffic.
5. `node --check site/app.js`, `dashboard-machine.js`, `current-snapshot.js`, and `assets/release-footer.js` — passed.
6. `sha256sum` — copied footer JS `bd3aa96202a55cd9533d2d4dca2c2c49e62aafc6035fe81448fe809a0959c08a`; CSS `8630140fc81581724156afa21d80393359561fdcc8c11d1567aab1385c1daa31`, both identical to packaged skill assets.

An exploratory parallel invocation exposed shared-process timing interference (QC 32/34 and UAT 22/23). Each configured suite was then rerun sequentially; the authoritative results are the numbered results above. No parallel result was represented as a configured-suite pass.

Two earlier diagnostic commands from `site/` mistakenly prefixed paths with `site/`; they failed with missing-path errors and were corrected from app root. These were command-path errors, not application test failures.

## Limitations

- The prohibited deployed origin was not accessed. Exact-preview version/head matching, viewport browser measurements, and deployed host/tenant authorization remain later controller-stage checks.
- Synthetic fixture permissions and release attributes are not tenant permission or publication facts.
- No deployment, provider, Git mutation, lifecycle API, database, OData, or real tenant access occurred.
