# Implementation cycle 3 evidence

## Implemented source

- `site/index.html`, `site/assets/xstate-4.38.3.js`, `site/_headers`: replaced jsDelivr execution with the locally shipped 60,210-byte XState 4.38.3 browser distribution. Shipped/source SHA-256 both equal `06f5c308e93a6542c15c13c6bc16ac6841e995538ee48682a13909e298650024`. Static response policy sets `default-src 'self'`, `script-src 'self'`, exact API `connect-src`, exact approved `frame-ancestors`, `base-uri 'none'`, and `object-src 'none'`.
- `site/host-context.js`: module-private capabilities now carry monotonic active generations, are explicitly revoked on authorization loss/replacement/disposal, ignore identical active bootstrap duplicates, notify lifecycle subscribers, and accept a genuinely fresh approved context for re-entry.
- `site/api-client.js`, `site/host-services.js`: every authenticated request/date/command requires an active capability before work; late successful responses are rejected after revocation; 401/403 revoke the generation; stale commands cannot start or resolve successfully.
- `site/dashboard-machine.js`, `site/app.js`, `site/current-snapshot.js`: revocation aborts invoked work, returns analytics to awaiting-host, invalidates snapshot work while retaining last-good data as stale, and fresh context starts a new generation. Permit activation captures its element and services before awaits, unlocks only still-connected controls, and focuses only a still-connected enabled focusable target.
- `site/constants.js`: `CURRENT_SNAPSHOT_LIVE_CALLS_ENABLED` is false in delivered source.
- `site/tests/*`: added revocation/re-entry, zero-request stale client, late API/command response, CSP/local dependency, false flag, and guarded focus contracts. Synthetic data only.

## Local verification

Runtime: Node.js `v20.20.2`; npm `10.8.2`. No tenant credential, live API, provider, or deployment access used.

- `cd site && npm test`: 55 passed, 0 failed, 0 skipped across 53 top-level tests.
- Syntax checks: `node --check` passed for `app.js`, `host-context.js`, `api-client.js`, and `host-services.js`.
- Static scan: no runtime remote script, `/odata/`, `SearchAllEvents`, or API-key header; only the false live-call declaration and its guarded use remain.
- Representative local mapper run in the unchanged controller QC fixture: 10,000 rows, 2,083,924 decoded bytes, five runs 23.646–28.257 ms; aggregate-only mapping preserved.
- Existing controller-owned cycle-2 QC suite: 17/20. Three failures are obsolete expectations that conflict with approved revision 4: reuse of one capability after a simulated 401, exact source regex requiring `hostServices` instead of a captured stable facade, and `CURRENT_SNAPSHOT_LIVE_CALLS_ENABLED === true`.
- Existing controller-owned cycle-2 UAT suite: 12/13. Its sole failure is the obsolete `flag === true` assertion; revision 4 explicitly requires false in delivered source. These controller files were not edited.

## Task traceability

- `T-101`: same-origin pinned dependency, enforcing static-host CSP, exact transports retained, revocable private capability.
- `T-102`: existing strict current adapters retained; mapper/site regressions pass.
- `T-103`: generation revocation, abort/late suppression, stale retention, and fresh re-entry implemented.
- `T-104`: generation-gated dates/commands and stable pre-await permit control cleanup.
- `T-105`: approved aggregate responsive UI retained; safe stale/navigation feedback path preserved.
- `T-106`: 55/55 revised deterministic assertions plus syntax/static/performance evidence.
- `T-107`: false-by-default flag and honest local/external verification boundary.

## Unavailable external evidence

- Exact deployed response headers/network trace, real browser removal/rerender focus cases, and authenticated SimplyLog host/API were not supplied for this implementation run.
- Authorization expiry/revocation and fresh re-entry on an approved real SimplyLog host or controller-owned faithful harness remains a release prerequisite. Local synthetic tests do not close or claim that UAT.
- No Git/provider/deploy/merge/issue/lifecycle API, backend, SQL, or database action was performed.
