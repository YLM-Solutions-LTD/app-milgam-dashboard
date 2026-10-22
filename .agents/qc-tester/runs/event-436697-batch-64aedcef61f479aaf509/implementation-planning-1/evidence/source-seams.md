# Attempt-2 read-only source seam audit

The inspected source is the pre-implementation baseline. It does not implement the accepted current-snapshot plan and therefore is used only to anchor future checks and regressions.

| Existing seam | Current behavior to preserve or extend | QC attachment |
|---|---|---|
| `constants.js` | Monthly datasets/endpoints and runtime direction constants | assert three new exact current endpoints without changing monthly constants; verify default flag false |
| `api-client.js` | Authenticated POST, typed errors, redaction, monthly body builder | spy on exact `{}` current operation and `{Items,TotalCount}` preservation; retain monthly date-body snapshots and error redaction |
| `host-context.js` | Context parsing, origin filtering, locale application | negative parent/source/origin/API matrix; late-valid-context recovery; same-boundary date/command responses |
| `dashboard-data.js` | Period and four-dataset monthly orchestration | prove snapshot lifecycle is orthogonal and period changes issue zero current calls |
| `data-mappers.js` | Strict monthly normalization/reconciliation | add strict current adapters; measure map/dedupe; preserve existing mapper suite |
| `dashboard-machine.js` | Host/period/dashboard request IDs and abort behavior | state ledger for separate snapshot request ID/controller/status/error/last-good; reverse-completion and burst cases |
| `index.html` / `app.js` | Skip link, controls/state/dashboard roots, live regions, dynamic renderer | snapshot precedes controls; native permit controls; non-atomic polite status; focus retention; existing charts remain functional |
| `app.css` | Logical properties, 44 px controls, 3 px focus outline, responsive analytical grid | four-viewport/two-direction geometry, 200% reflow, contrast, target size, and aggregate-only DOM checks |
| `tests/*.test.js` | Node-only deterministic test runner | implementation may extend local tests; QC stage creates no tests and final browser evidence remains independently required |

Observed baseline facts that implementation tests must deliberately catch rather than silently inherit include HTTP entries in the current origin allowlist, absent `event.source===window.parent` enforcement, permissive HTTP(S) API validation, and no current-snapshot datasets/UI/state. These are expected pre-implementation gaps covered by T-101–T-107, not separate QC findings at this planning stage.

Source hashes are recorded in `input-manifest.md`. No source or existing test file was changed.
