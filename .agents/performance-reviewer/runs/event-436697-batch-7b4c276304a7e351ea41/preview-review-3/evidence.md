# Exact-preview performance evidence

Exact supplied identity: head `b138df3040ab4468220a29f595d0caa62920f679`, preview `https://42ad1c5f.app-milgam-dashboard.pages.dev/`. Chromium 140.0.7339.16. The preview was loaded only through `https://milgam.ylm.co.il/controller-host-fixture/`; the fixture, real GuestBridge, and all API responses were fulfilled locally. No tenant credential or request was used.

## Passing measurements

- Both 390x844 and 1440x900 began with exactly three concurrent current-report POSTs, each body `{}`. Representative current-response decoded bytes per generation were 4,070,881.
- The 10,000-row equipment adapter samples were 10.9-14.5 ms, under the 100 ms budget. Snapshot descendants were 41, under 80. Post-response ready rendering measured 25 ms where observed, under 50 ms. Neither viewport overflowed.
- A held 20-activation permit burst produced exactly one Navigate effect. Revoked refresh produced zero API calls. Fresh re-entry produced exactly three generation-2 current calls; silent-revoke recovery produced exactly three generation-3 current calls; overlapping re-entry settled on generation 5 with exactly three current calls. No page error or private 500/401 marker leak occurred.
- HTTP 500 and 401 retained byte-identical last-good snapshot HTML. Refresh after the rejected 401 made zero calls. The old `simplyvibe-auth-lifecycle-401-refresh-reuses-rejected-generation-v1`, `perf-preview-fresh-reentry-does-not-restart-snapshot-generation-v1`, `uat-snapshot-refresh-failure-last-good-cleared-v1`, `uat-authorization-expiry-old-generation-refresh-allowed-v1`, `uat-permit-command-singleflight-race-v1`, and `qc-sdk-reentry-client-disposed-unhandled-v1` reproductions all passed.
- Executable requests were limited to the intercepted controller fixture and exact preview origins; delivered CSP remained strict.

## Reproducible API-efficiency defect

Ten synchronous clicks on the enabled refresh button started 29 current-report requests at 390x844 and 33 at 1440x900 instead of one three-request generation. Peak current concurrency was therefore 29 and 33, with 27 and 30 aborted requests. Because each 10,000-row equipment response is about 4.07 MB decoded, the burst starts roughly ten equipment transfers before stale generations are aborted. A 72-75 ms long task was also recorded during the burst.

Source evidence: `site/app.js:149-160` starts `refreshAuthorization()` without a pre-verification single-flight guard. Every click awaits the shared `hostBootstrap.verify()` while the refresh button remains enabled; when that promise resolves, each continuation sends analytical retry work and calls `snapshotController.refresh()`. `site/current-snapshot.js:87-103` aborts the prior snapshot only after the next refresh begins, so it provides stale-response safety but does not prevent request amplification.

Artifacts: `evidence/browser-measurements.json`, `evidence/lifecycle-measurements.json`, `measure-preview.cjs`, and `measure-lifecycle.cjs`.

