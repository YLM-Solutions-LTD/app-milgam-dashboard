# UAT preview-review cycle 3 report

Verdict: **approve_with_findings**

Role: `uat-tester`

Tasks: `T-201`, `T-202`, `T-203`, `T-204`, `T-205`

Handled action IDs, frozen order: `536946`, `536949`, `537034`, `537037`, `537040`, `547704`, `547710`, `547713`, `569787`, `569843`.

All ten stable UAT workflows passed against exact preview `https://42ad1c5f.app-milgam-dashboard.pages.dev` for supplied head `b138df3040ab4468220a29f595d0caa62920f679` through the actual packaged SDK and controller-owned GuestBridge. Every cycle-3 remediation fingerprint is closed by browser evidence: terminal 401 denial, automatic three-route fresh re-entry, last-good retention after 500/401, one-chain permit navigation, and zero uncaught disposal/reset errors. Legacy/direct entry made zero API requests, body markers were absent from diagnostics, CSP remained strict, and responsive RTL/LTR evidence passed.

Finding `uat:tenant-permission-configuration:not-proven-by-synthetic-fixture:v1` — low severity, high confidence; T-205. The controller fixture deliberately supplies synthetic permission decisions and cannot prove actual deployed tenant permission configuration. Reproduction: compare the fixture README boundary with the executed local-only route setup; no authorized real-tenant request or token exists. This does not invalidate the exact-preview application lifecycle acceptance and requires controller-owned tenant verification if release policy demands it.

Fresh UAT passed 23/23 and the controller harness passed 2/2. Deployed hashes for the reviewed runtime modules and verified SDK match local reviewed bytes.

Evidence: `approach.md`, `cases.md`, `evidence/summary.md`, `evidence/observations.json`, four responsive screenshots, and `run-preview.mjs`.
