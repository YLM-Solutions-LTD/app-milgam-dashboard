# UAT cases and results

| Case | Shared tasks | Result | Exact-preview evidence |
|---|---|---|---|
| UAT-201 authenticated entry | T-201, T-203, T-204 | Pass | Each RTL/LTR desktop/phone load issued exactly three concurrent current-report POSTs with body `{}`; direct entry issued zero API requests. |
| UAT-202 independent analytics | T-201, T-203, T-204 | Pass | Changing analytical month added zero current calls and retained the snapshot. |
| UAT-203 semantic snapshot | T-201, T-203, T-204 | Pass | Events reconcile 12=4+8, permits remain 7/2/1 separate, 10,000 equipment total renders, and treatment classification stays unavailable. |
| UAT-204 transactional refresh | T-203, T-204, T-205 | Pass | HTTP 500 and 401 refreshes retained last-good snapshot data; retry recovered and released its lock. |
| UAT-205 terminal authorization | T-203, T-204, T-205 | Pass | After 401, forced refresh produced zero old-generation current calls; only controller re-entry recovered. |
| UAT-206 fresh re-entry | T-203, T-204, T-205 | Pass | Fresh bridge generation 2 automatically issued exactly the three current routes. |
| UAT-207 exact permit navigation | T-203, T-204, T-205 | Pass | Twenty activations while held caused one exact `Navigate` effect to `#/Permits/Dashboard`. |
| UAT-208 revoke/pending command | T-203, T-204, T-205 | Pass | Revoked generation 1 produced zero old effects; generation 2 produced one exact effect. |
| UAT-209 disposal/race safety | T-203, T-204, T-205 | Pass | Revoke/re-entry recorded no page error or unhandled rejection; complete QC/UAT lifecycle suites passed. |
| UAT-210 release workflow | T-201, T-202, T-203, T-204, T-205 | Pass with limitation | Both refresh controls clicked in one burst caused exactly three calls; ten retry clicks caused exactly three calls and lock release. Strict CSP, zero inline styles, same-origin app execution, and responsive RTL/LTR passed. Synthetic permissions do not prove tenant configuration. |

All six cycle-3 fingerprints were independently not reproduced and are verified closed in the authorized exact-preview fixture: `simplyvibe-auth-lifecycle-401-refresh-reuses-rejected-generation-v1`, `perf-preview-fresh-reentry-does-not-restart-snapshot-generation-v1`, `uat-snapshot-refresh-failure-last-good-cleared-v1`, `uat-authorization-expiry-old-generation-refresh-allowed-v1`, `uat-permit-command-singleflight-race-v1`, and `qc-sdk-reentry-client-disposed-unhandled-v1`. The refresh-amplification follow-up was also not reproduced.
