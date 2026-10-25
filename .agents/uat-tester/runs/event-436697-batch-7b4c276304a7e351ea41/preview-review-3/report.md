# UAT preview-review cycle 3 report

Verdict: **approve_with_findings**

Role: `uat-tester`

Tasks: `T-201`, `T-202`, `T-203`, `T-204`, `T-205`

Handled action IDs, frozen order: `536946`, `536949`, `537034`, `537037`, `537040`, `547704`, `547710`, `547713`, `569787`, `569843`.

All ten UAT workflows passed against exact preview `https://ef2f1185.app-milgam-dashboard.pages.dev` for supplied head `3dc45f69655efd2a2c6b0ad016b1a8cf8f738066` through the actual packaged SDK and controller-owned GuestBridge. Every cycle-3 lifecycle fingerprint is closed by new browser evidence: terminal 401 denial, automatic three-route fresh re-entry, last-good retention after 500/401, one-chain permit navigation, and no uncaught disposal/reset error. The trusted refresh-guard follow-up also passed: a burst spanning both refresh controls issued exactly three current requests, while ten retry activations issued exactly three and released the lock. Direct entry made zero API requests, private response markers did not enter diagnostics, strict CSP remained enforced, and RTL/LTR desktop/phone views had no horizontal overflow.

Finding `uat:tenant-permission-configuration:not-proven-by-synthetic-fixture:v1` — low severity, high confidence; T-205. The controller fixture deliberately supplies synthetic permission decisions and cannot prove the deployed tenant's permission configuration. No authorized tenant token or tenant request exists. This limitation does not invalidate application lifecycle acceptance, but controller-owned tenant verification remains necessary if release policy requires it.

Fresh deterministic checks passed: site 61/61, complete QC JS+MJS 34/34, UAT MJS 23/23, and controller harness 2/2. Deployed `app.js`, `host-bootstrap.js`, and packaged SDK hashes match the reviewed local bytes; SDK identity is also protected by the passing byte-equivalence suite.

Evidence: `approach.md`, `cases.md`, `evidence/summary.md`, `evidence/observations.json`, four responsive screenshots, and `run-preview.mjs`.
