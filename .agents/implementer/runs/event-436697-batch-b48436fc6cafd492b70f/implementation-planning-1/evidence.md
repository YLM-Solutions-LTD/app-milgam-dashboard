# Planning evidence

## Current-source requirements reproduced

- `site/date-range.js` still creates month bounds ending `T23:59:59`; it has no strict arbitrary From/To parser or inclusive `.997` end.
- `site/dashboard-machine.js` still stores `selectedPeriod` and reacts to year/month selection; it does not model draft/applied ranges.
- `site/app.js` renders year/month selectors and `refreshAuthorization()` can couple analytical retry with snapshot refresh.
- `site/current-snapshot.js` accepts event/permit counts only when already `Number.isSafeInteger`, rejecting legitimate decimal strings.
- `site/index.html` has no `footer[data-simplyvibe-release]`; `site/assets/` has no packaged release-footer JS/CSS.
- `site/constants.js` retains `CURRENT_SNAPSHOT_LIVE_CALLS_ENABLED=true`; this must remain true.

These are implementation requirements, not completed fixes.

## Accepted planning inputs

- Shared plan/tasks revision 12 covers `T-301`–`T-305` and action `[570021]`.
- Planner report: ready.
- Cycle-3 UI, security, performance, and UAT reports: approved.
- Repaired packaged footer renderer was inspected directly. It accepts only exact `preview` or `production`; all other environment values return Unavailable for version, update, and release.
- Controller harness README requires actual SDK/GuestBridge, the fully intercepted `https://milgam.ylm.co.il/controller-host-fixture/` origin, exact Navigate behavior, and no real tenant traffic/fake adapter.

## Complete discovered inventory

Site JS (9):

- `site/tests/api-client.test.js`
- `site/tests/current-snapshot.test.js`
- `site/tests/dashboard-data.test.js`
- `site/tests/dashboard-machine.test.js`
- `site/tests/data-mappers.test.js`
- `site/tests/host-bootstrap.test.js`
- `site/tests/host-context.test.js`
- `site/tests/host-services.test.js`
- `site/tests/ui-contract.test.js`

QC (3):

- `tests/qc/snapshot-qc.test.js`
- `tests/qc/operator-reentry-race.test.mjs`
- `tests/qc/sdk-bridge-qc.test.mjs`

UAT (2):

- `tests/uat/current-snapshot.uat.test.mjs`
- `tests/uat/verified-host-bridge.uat.test.mjs`

Controller harness (1):

- `/workspace/.simplyvibe/input/controller-host-harness/host-fixture.test.mjs`

No `*.test.cjs`, `*.spec.js`, `*.spec.mjs`, or `*.spec.cjs` files exist in the app or harness inventory.

## Exact baseline commands and results

1. Working directory `site/`: `npm test`
   - Executes configured `node --test tests/*.test.js`.
   - Result: 61 passed, 0 failed, 0 cancelled, 0 skipped, 0 todo.
   - Includes `dashboard-machine.test.js`; restored locked XState 4.38.3 resolved the archived missing-dependency environment failure.
2. Working directory app root: `node --test tests/qc/snapshot-qc.test.js tests/qc/operator-reentry-race.test.mjs tests/qc/sdk-bridge-qc.test.mjs`
   - Result: 34 passed, 0 failed, 0 cancelled, 0 skipped, 0 todo.
3. Working directory app root: `node --test tests/uat/current-snapshot.uat.test.mjs tests/uat/verified-host-bridge.uat.test.mjs`
   - Result: 23 passed, 0 failed, 0 cancelled, 0 skipped, 0 todo.
4. Working directory `/workspace/.simplyvibe/input/controller-host-harness`: `node --test host-fixture.test.mjs`
   - Result: 2 passed, 0 failed, 0 cancelled, 0 skipped, 0 todo.

The baseline is 120/120 passing across the four configured groups. It validates preserved behavior only; existing tests still encode month-only analytics and number-only snapshot aggregate expectations, and the current source lacks the footer. Candidate implementation must add the T-301/T-303/T-305 coverage before a release-readiness claim.

## Limits

- The denied deployed preview was not accessed and no alternative route was used.
- No real tenant, credential, provider, Git, deployment, merge, issue, lifecycle API, or approval action was accessed.
- No browser preview measurements were executed in this planning role; they are explicit T-304 implementation/review gates.
- Synthetic host permissions and metadata are test fixtures, not deployed tenant or release proof.
