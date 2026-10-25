# QC evidence — exact preview cycle 3

Target: `c9686ba1ad6d4f7b0896ba32c29ad38dcf607022` at `https://5ab11833.app-milgam-dashboard.pages.dev`, Chromium 140.0.7339.16, corrected synthetic host `https://milgam.ylm.co.il/controller-host-fixture/`. All API and fixture traffic was locally fulfilled; no tenant token or tenant request was used.

## Artifact identity

The deployed and local SHA-256 values matched for `index.html`, `app.js`, `app.css`, `constants.js`, `api-client.js`, `current-snapshot.js`, `host-bootstrap.js`, `host-context.js`, `host-services.js`, and `assets/simplyvibe-client.js`. The packaged client also matched the verified fixture client at `ee67f5ae15c70fee8443701b4391946a2275d922acdf9d1797c69dad3c414bf1`.

## Complete local inventory

- `cd site && npm test`: 61/61 pass, 0 fail, 0 skip.
- `node --test tests/qc/*.test.js tests/qc/*.test.mjs`: 30/30 pass, including `operator-reentry-race.test.mjs`, 0 fail, 0 skip.
- `node --test tests/uat/*.test.mjs`: 21/21 pass, 0 fail, 0 skip.
- `cd /workspace/.simplyvibe/input/controller-host-harness && node --test host-fixture.test.mjs`: 2/2 pass, 0 fail, 0 skip.

Runtime: Node.js v20.20.2, npm 10.8.2. Inventory explicitly included all existing `.test.js` and `.test.mjs` files.

## Exact-preview evidence

Full structured evidence and four screenshots are under `evidence/`. At 390×844 and 1440×900 in RTL and LTR, each initial load issued exactly three current-report POSTs with `{}`, analytical period change issued zero current calls, and the snapshot stayed stable. There was no horizontal overflow or clipped button/select, snapshot DOM was 41 elements, no inline styles existed, charts were visible, CSP remained strict, and page errors were empty. Permit 20-activation holding produced one exact generation-1 Navigate and restored focus. Marker response bodies did not appear in console/error serialization. Direct access issued zero API requests.

Cycle-3 fingerprint decisions:

- `simplyvibe-auth-lifecycle-401-refresh-reuses-rejected-generation-v1`: closed for the exact preview. The failing refresh made its expected three requests; a repeated refresh before re-entry made zero. Overlapping fresh re-entry recovered with exactly three requests.
- `perf-preview-fresh-reentry-does-not-restart-snapshot-generation-v1`: closed. Fresh and overlapping re-entry recovered with exactly three current calls.
- `uat-snapshot-refresh-failure-last-good-cleared-v1`: closed. The 401 path retained the visible 10,000-item last-good snapshot; local behavioral suites also cover 500 retention.
- `uat-authorization-expiry-old-generation-refresh-allowed-v1`: closed. Repeated post-401 refresh issued zero calls.
- `uat-permit-command-singleflight-race-v1`: closed. Twenty activations while held yielded one Navigate effect and one pending chain.
- `qc-sdk-reentry-client-disposed-unhandled-v1`: closed. Revoke/release/re-entry and overlapping re-entry produced no pageerror or unhandled rejection.

## New reproducible failure

`qc-revoke-refresh-race-issues-old-generation-requests-v1`: after a ready snapshot and pending real bridge command, call `controllerHarness.revoke()`, release the command, and immediately force the snapshot refresh without re-entry. The harness remained `authorized:false`, `generation:1`, recorded zero Navigate effects, and retained last-good content, but the preview issued three new current-report requests. Expected: zero old-generation authenticated requests until distinct re-entry. Actual evidence: `revocation-reentry.revoked.newCalls === 3` in `evidence/browser-results.json`. This is independent of the passing 401-taint path and violates T-203/T-205's general session-reset revocation boundary.

The fixture does not prove real tenant permission configuration, and no controller deployment/release action is claimed.
