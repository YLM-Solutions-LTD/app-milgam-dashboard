# Cycle 3 deterministic UAT cases

Stable workflows `UAT-201`–`UAT-210` trace to every task `T-201`–`T-205`.

- `UAT-201`/`UAT-202`: a verified bound context starts exactly three concurrent current-report POSTs with `{}`; analytical periods remain independent.
- `UAT-203`/`UAT-204`/`UAT-207`: enabled flag, strict CSP-compatible charts, exact semantics, raw date delegation, RTL/LTR and accessible shell contracts.
- `UAT-205`: generation-ten wins; malformed/error states never fabricate zeros; 500 and 401 refresh failures retain the identical last-good object and timestamp as stale; 10,000 equipment rows stay below 100 ms.
- `UAT-206`: packaged controller SDK completes real Ready/Navigate through GuestBridge with exact `{Url:"#/Permits/Dashboard"}`; the application acquires its navigation guard synchronously before any await.
- `UAT-208`: revocation denies late results; HTTP 401 makes the generation terminal, producing zero subsequent old-generation requests; only a distinctly bound fresh context resumes work.
- `UAT-208` overlapping re-entry regression: two controller re-entries in one turn must converge on generation 3, automatically start exactly the three current-snapshot routes for that newest generation, and leak no disposed-handshake rejection.
- `UAT-208` live verification regression: 20 concurrent user effects share one disposable real-SDK `Ready` handshake without reminting context; silent bridge loss produces zero authenticated effects and remains denied until distinct controller re-entry, after which one three-report effect may resume.
- `UAT-209`: old held bridge commands reject with zero effects across rotation, generation 2 succeeds, and failure cleanup preserves content and safe focus behavior.
- `UAT-210`: synthetic error-body markers do not appear in console or serialized errors; local assets and restrictions remain intact.

Fingerprint coverage: `simplyvibe-auth-lifecycle-401-refresh-reuses-rejected-generation-v1`, `perf-preview-fresh-reentry-does-not-restart-snapshot-generation-v1`, `uat-snapshot-refresh-failure-last-good-cleared-v1`, `uat-authorization-expiry-old-generation-refresh-allowed-v1`, `uat-permit-command-singleflight-race-v1`, `qc-sdk-reentry-client-disposed-unhandled-v1`, and the operator overlapping-reentry/live-verification races are exercised behaviorally across UAT, QC, and site suites. Exact deployed viewports, response headers, runtime browser CSP/network observations, and full app-level 20-click behavior remain final-review checks.

Process-attempt-2 refresh-guard acceptance for `T-203`/`T-204`/`T-205`: while one snapshot refresh is held, repeated activation of the header refresh, snapshot-status retry, and analytical retry paths must share one application refresh promise and issue exactly three current requests total, with all three started before release. Controls must disable synchronously. After a 500/401, a distinct verified re-entry, or ordinary completion, the guard must settle and permit exactly one later three-request generation. The independent exact-preview review must reproduce this with the real controls; this UAT role does not claim browser-control evidence during local test authoring.
