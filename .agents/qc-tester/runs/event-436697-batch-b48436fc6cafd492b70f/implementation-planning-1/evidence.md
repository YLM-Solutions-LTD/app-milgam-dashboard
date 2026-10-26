# QC planning evidence

## Inputs reconciled

- `.agents/shared/plan.md` and `.agents/shared/tasks.json`, revision 12.
- Accepted planner report and current-batch plan-review-3 reports for UI, security, performance, and UAT.
- Frozen action input: exactly `[570021]`; `includeDescription=false`.
- Builder release-footer contract and packaged renderer/assets, including repaired exact environment handling.
- Controller host harness README: corrected fully intercepted `https://milgam.ylm.co.il/controller-host-fixture/`, actual SDK/GuestBridge, no fake adapter/readiness, no tenant traffic.
- `/workspace/AGENTS.md`: deployed origin is denied and was not accessed.

## Complete discovered test inventory

No `*.test.cjs` or `*.spec.{js,mjs,cjs}` files were found.

- Site JS: `site/tests/api-client.test.js`, `current-snapshot.test.js`, `dashboard-data.test.js`, `dashboard-machine.test.js`, `data-mappers.test.js`, `host-bootstrap.test.js`, `host-context.test.js`, `host-services.test.js`, `ui-contract.test.js`.
- QC: `tests/qc/snapshot-qc.test.js`, `operator-reentry-race.test.mjs`, `sdk-bridge-qc.test.mjs`.
- UAT: `tests/uat/current-snapshot.uat.test.mjs`, `verified-host-bridge.uat.test.mjs`.
- Controller harness: `/workspace/.simplyvibe/input/controller-host-harness/host-fixture.test.mjs`.

## Fresh baseline execution

1. From `site/`: `npm test` -> 61 tests passed, 0 failed, 0 skipped; exit 0.
2. From app root: `node --test tests/qc/*.test.js tests/qc/*.test.mjs` -> 34 passed, 0 failed, 0 skipped; exit 0.
3. From app root: `node --test tests/uat/*.test.mjs` -> 23 passed, 0 failed, 0 skipped; exit 0.
4. From controller harness: `node --test host-fixture.test.mjs` -> 2 passed, 0 failed, 0 skipped; exit 0.

These are unchanged-source baseline results. They do not claim the requested range, decimal-string, or release-footer implementation exists.

## Open implementation requirements

- `qc-range-controls-current-source-month-only-v1`: current month-only bounds/control lifecycle must be replaced by T-301/T-302 and then pass QC-301..QC-304.
- `qc-snapshot-decimal-string-counts-rejected-v1`: current number-only aggregate validation must implement T-303 and then pass QC-305..QC-307.
- `qc-release-footer-missing-current-source-v1`: current source lacks the mandatory all-state packaged footer and must pass QC-309..QC-311 plus later preview truth checks.

The repaired footer renderer/environment behavior and restored XState dependency are accepted prerequisites, not app implementation evidence. The absent remediation-cycle-3 manifest is a controller-packaging limitation and no unknown finding was invented.

