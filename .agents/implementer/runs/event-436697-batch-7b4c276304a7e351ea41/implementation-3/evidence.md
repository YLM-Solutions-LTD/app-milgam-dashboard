# Implementation cycle 3 process attempt 1 evidence

## Source traceability

- `T-201`, `T-202`: `site/constants.js:21` keeps `CURRENT_SNAPSHOT_LIVE_CALLS_ENABLED=true`; `site/_headers:2` retains the existing strict CSP/trusted frame ancestors; `site/assets/simplyvibe-client.js` remains byte-identical to the controller SDK at SHA-256 `ee67f5ae15c70fee8443701b4391946a2275d922acdf9d1797c69dad3c414bf1`.
- `T-203`, `T-205`, `simplyvibe-auth-lifecycle-401-refresh-reuses-rejected-generation-v1`, `uat-authorization-expiry-old-generation-refresh-allowed-v1`: `site/host-bootstrap.js:25-76` terminally denies an SDK session after HTTP 401/403. Reconnect is idempotent when healthy and rejects the unchanged tainted session; only a distinct verified Ready source clears denial.
- `T-203`, `T-205`, `perf-preview-fresh-reentry-does-not-restart-snapshot-generation-v1`: `site/host-bootstrap.js:45-64` detects a distinct bridge session, revokes the old capability, and starts one caught reconnect. `site/app.js:76-101` creates the new application/snapshot generation and immediately loads all three reports.
- `T-203`–`T-205`, `uat-snapshot-refresh-failure-last-good-cleared-v1`: `site/app.js:76-91,152-160` distinguishes ordinary refresh from authority replacement and carries prior last-good data into fresh re-entry. `site/current-snapshot.js:76-108` retains data/time through loading, 500, 401/403, invalidation, and generation replacement.
- `T-203`–`T-205`, `uat-permit-command-singleflight-race-v1`: `site/app.js:274-299` takes the lock before any await and clears it only in that command chain's `finally`; revocation no longer clears the guard.
- `T-203`–`T-205`, `qc-sdk-reentry-client-disposed-unhandled-v1`: `site/host-bootstrap.js:55-61,79-97` catches detached session-rotation handshakes and consumes expected `DISPOSED`/`SESSION_RESET`/`HOST_REVOKED` rejection.
- Production startup uses only `contextFromSdk` via `site/host-bootstrap.js`; `site/app.js` does not install the legacy Context listener. Legacy JSON Context cannot reactivate the app after SDK revocation. `site/host-context.js:8-18,51-75` excludes raw API addresses from diagnostics; `site/api-client.js` retains/logs bounded metadata without response objects/bodies.

## Behavioral evidence

- `site/tests/host-bootstrap.test.js`: ordinary reconnect is idempotent; HTTP 401 taints the unchanged Ready source; repeated reconnect creates zero clients; distinct Ready source automatically creates exactly one new bound generation.
- `site/tests/current-snapshot.test.js`: last-good data survives failed refresh and is inherited by a fresh generation while its automatic refresh is pending/failing.
- `tests/qc/sdk-bridge-qc.test.mjs`: real packaged SDK and GuestBridge exercise Ready, exact Navigate, session rotation, old-command rejection, fresh recovery, and detached-rejection handling.
- UAT suites cover 500/401 stale retention, terminal denial, exact permit chain, SDK recovery, and response-body-free diagnostics.

## Exact commands and results

- `cd site && npm test` — PASS, 61 tests, 0 failed, 0 skipped.
- `node --test tests/qc/*.test.js tests/qc/*.test.mjs` — PASS, 29 tests, 0 failed, 0 skipped; both extensions selected.
- `node --test tests/uat/*.test.mjs` — PASS, 18 tests, 0 failed, 0 skipped.
- `cd /workspace/.simplyvibe/input/controller-host-harness && node --test host-fixture.test.mjs` — PASS, 2 tests, 0 failed, 0 skipped.
- Syntax checks for all changed JS passed. SDK hashes both equal `ee67f5ae15c70fee8443701b4391946a2275d922acdf9d1797c69dad3c414bf1`.

## Deferred controller stages

No tenant, deployed preview, provider, lifecycle API, or external host request was made. Exact deployed-preview checks (browser page errors/unhandled rejections, request/effect counts, screenshots, accessibility, headers, timings, and node budgets) and actual tenant permission verification remain controller-owned `T-204`/`T-205` stages. Local readiness is not deployment or production approval.
