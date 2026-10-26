# Exact-preview performance evidence

Reviewed exact supplied identity `3dc45f69655efd2a2c6b0ad016b1a8cf8f738066` at `https://ef2f1185.app-milgam-dashboard.pages.dev/` in Chromium 140.0.7339.16 / Node v20.20.2. The preview ran only inside the corrected `https://milgam.ylm.co.il/controller-host-fixture/` boundary. The controller-provided real GuestBridge and packaged guest SDK were used; host files and every API response were fulfilled locally. No tenant token or real tenant request was used. SHA-256 comparison confirmed that deployed `app.js`, `host-bootstrap.js`, and `current-snapshot.js` equal the reviewed local source.

## T-201 / T-203 / T-204 request and browser budgets

- At 390x844 and 1440x900, initial load, ordinary refresh, ten-click snapshot refresh burst, and fresh re-entry each made exactly three current-report POSTs, one per required route, with body `{}`. Peak current concurrency was 3. One generation decoded 4,070,881 current-response bytes.
- The 10,000-row equipment fixture rendered `10,000` while retaining 41 snapshot descendants (budget <=80). Warm mapping samples ranged 10.6-21.4 ms (budget <100 ms). Post-response snapshot render measured 18-19 ms (budget <50 ms). Document width was 374/374 and 1424/1424, so neither viewport overflowed.
- A ten-dispatch burst through the analytical `#refresh-button` listener produced one analytical call plus exactly three current calls. A failed HTTP-500 refresh retained byte-identical last-good snapshot HTML; ten stale retry dispatches produced exactly three current calls and no analytical call. A subsequent successful retry produced exactly three current calls, proving guard release after error.
- The deployed guard is source-backed at `site/app.js:44-45,154-176`: it acquires `refreshPending` before awaiting SDK verification, synchronously disables both visible refresh controls, shares the promise across callers, validates context identity, and clears the lock in `finally`. Both analytical and retry listeners route through it (`site/app.js:255-256,273-284`). This resolves `perf-preview-refresh-verification-burst-request-amplification-v1`.

## T-203 / T-205 lifecycle efficiency

- HTTP 401 retained byte-identical last-good data, tainted the generation, and a forced ordinary refresh caused zero calls. Fresh controller re-entry automatically issued exactly three current calls (plus the expected analytical call) with new-generation authority. Silent bridge revoke followed by refresh issued zero calls; fresh re-entry again issued exactly three current calls.
- Overlapping `reenter()` plus microtask `reenter()` settled at generation 5 and emitted only the final generation's three current calls plus its analytical call. No dropped fresh re-entry or page error occurred.
- Twenty permit activations while the command was held produced zero early effects and exactly one Navigate effect after release. Revoked/old-generation work produced no post-revocation requests.
- HTTP 500 and 401 response-body markers were absent from diagnostics. There were no page errors, failed requests, or relevant console errors in the two-viewport measurement.

## T-202 resource behavior

Executable assets came only from the locally fulfilled trusted fixture and the exact preview origin. The preview retained strict CSP (`default-src 'self'; script-src 'self'; style-src 'self'; ... object-src 'none'; base-uri 'none'`). No third-party executable request or relevant CSP failure was observed.

Two 74-83 ms long-task observations occurred while handling the intentionally large ~4.07 MB/10,000-row fixture. The separately measured mapper and post-response render phases remained within their explicit budgets, DOM size stayed constant, and the result caused no overflow or interaction failure; this is recorded as measurement context, not a release finding.

Artifacts: `browser-measurements.json`, `lifecycle-measurements.json`, `measure-preview.cjs`, and `measure-lifecycle.cjs` in this run folder.
