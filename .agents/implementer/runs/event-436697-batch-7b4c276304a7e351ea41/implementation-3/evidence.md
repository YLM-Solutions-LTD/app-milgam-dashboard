# Implementation cycle 3 attempt 1 evidence

Runtime: Node.js v20.20.2. SDK/bridge tests used only local synthetic fixture traffic. No tenant, provider, deployment, Git, database, OData, backend, or lifecycle call was made.

## Complete inventory

- `cd site && npm test` — PASS: 61 passed, 0 failed, 0 skipped; all `site/tests/*.test.js`.
- `node --test tests/qc/*.test.js tests/qc/*.test.mjs` — PASS: 33 passed, 0 failed, 0 skipped; both extensions, including `operator-reentry-race.test.mjs`.
- `node --test tests/uat/*.test.mjs` — PASS: 21 passed, 0 failed, 0 skipped.
- `cd /workspace/.simplyvibe/input/controller-host-harness && node --test host-fixture.test.mjs` — PASS: 2 passed, 0 failed, 0 skipped with the unmodified SDK/GuestBridge.
- Syntax checks passed for `host-bootstrap.js`, `app.js`, `host-context.js`, `api-client.js`, and `current-snapshot.js`.

## Task and finding evidence

- T-201: `site/constants.js:21` keeps the live flag true; `site/current-snapshot.js:8-14` launches exactly three current calls concurrently. Site test 19 and QC test 31 protect the flag.
- T-202: `site/_headers:2`, `site/app.css`, and `site/app.js` retain strict CSP and class/SVG chart presentation. Site tests 53/58 and QC tests 32/33 passed; no runtime inline-style write or CSP executable relaxation was found.
- T-203: `site/host-bootstrap.js:25-132` implements terminal denial, disposable verification handshakes, automatic fresh-session recovery, overlap ordering, and handled detached rejections. `site/api-client.js:49-60` revokes on 401/403. `site/app.js:126-163,274-305` verifies before effects. `site/current-snapshot.js:76-108` retains last-good state.
- T-204/T-205: QC/UAT behaviorally cover shared verification for 20 callers, silent disconnect with zero work, distinct-session recovery, overlapping re-entry, real-bridge Navigate, ten-refresh newest-wins, 10,000-row mapping under 100 ms, stale 500/401 retention, exact three-route re-entry, no old command effect, and zero unhandled reset/disposal rejection.

Closed locally: `simplyvibe-auth-lifecycle-401-refresh-reuses-rejected-generation-v1`, `perf-preview-fresh-reentry-does-not-restart-snapshot-generation-v1`, `uat-snapshot-refresh-failure-last-good-cleared-v1`, `uat-authorization-expiry-old-generation-refresh-allowed-v1`, `uat-permit-command-singleflight-race-v1`, `qc-sdk-reentry-client-disposed-unhandled-v1`, `unchanged-sdk-session-capability-remint-v1`, `permit-single-flight-cleared-by-revocation-v1`, `legacy-context-remains-independent-authority-v1`, `host-context-diagnostics-expose-runtime-address-v1`, `operator-overlapping-reentry-newest-generation-recovery-v1`, `qc-revoke-refresh-race-issues-old-generation-requests-v1`, and `perf-preview-revoked-bridge-refresh-emits-old-generation-requests-v1`.

Production startup has no legacy listener/source-to-effect path: `app.js` imports no legacy authority function and `host-bootstrap.js` binds only `contextFromSdk` from an actual `SimplyVibeClient`; unbound contexts cannot construct API/host authority. Compatibility parsers remain uninstalled. `summarizeContext` excludes API address and UAT test 21 proves raw body markers do not enter logs/serialized errors.

SDK SHA-256 `ee67f5ae15c70fee8443701b4391946a2275d922acdf9d1797c69dad3c414bf1` matches the controller asset byte-for-byte. XState SHA-256 is `06f5c308e93a6542c15c13c6bc16ac6841e995538ee48682a13909e298650024`.

Exact deployed-preview browser/header/network/screenshot/timing review and real tenant permission/production-host verification remain later controller gates and are not claimed passed.
