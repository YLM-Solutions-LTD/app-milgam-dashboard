# UAT execution — preview review cycle 2

Target: `https://1de11912.app-milgam-dashboard.pages.dev` (controller-supplied PR head `d9ef28ddc6be1d9b6b9fb2f066bcde19c53c193b`). Chromium `140.0.7339.16`. Synthetic API routes and a synthetic parent message used no real tenant token.

| Case | Tasks | Result | Observation |
|---|---|---|---|
| UAT-001 | T-101,T-102,T-103,T-105 | PASS (synthetic) | Exactly three current POSTs, `{}` bodies, 3 ms maximum start spread; reconciled snapshot and analytics rendered. |
| UAT-002 | T-102,T-104,T-105,T-106 | PASS (synthetic/local) | Separate permit units, equipment total/unavailable classification, and unchanged raw dates observed. Strict zero/duplicate variants pass deterministic suite. |
| UAT-003 | T-103,T-105,T-106 | PASS | Month change updated analytics with zero additional current calls and unchanged snapshot text. |
| UAT-004 | T-101,T-103,T-106 | PASS (local deterministic evidence) | Stale suppression, ten-refresh generation behavior, and concurrency assertions passed in 13/13 UAT suite. |
| UAT-005 | T-101,T-102,T-103,T-105,T-106 | PASS (synthetic) | Three 403 fixtures produced an empty snapshot-local error; retry recovered without fabricated values. Other malformed variants pass deterministic suite. |
| UAT-006 | T-101,T-103,T-104,T-106 | BLOCKED/PARTIAL | Direct timeout made zero API requests; synthetic accepted context worked. No approved real SimplyLog host/harness was available to prove real host acceptance, expiry, or re-entry. |
| UAT-007 | T-103,T-105,T-106 | PASS (local deterministic evidence) | Atomic last-good/stale behavior covered by passing UAT suite. |
| UAT-008 | T-104,T-105,T-106 | PASS (synthetic/local) | Exact `ready` then `Navigate` with `{Url:"#/Permits/Dashboard"}` observed. Burst lock covered locally. |
| UAT-009 | T-104,T-105,T-106 | PASS (local deterministic evidence) | Navigation rejection/recovery and data retention covered by passing suite. |
| UAT-010 | T-105,T-106 | PASS | 390×844 RTL and 1440×900 RTL/LTR had no horizontal overflow; 41 snapshot descendants; screenshots captured. |
| UAT-011 | T-101,T-102,T-106 | PASS (local deterministic evidence) | Representative-volume and strict-contract case passed; current browser requests used exact endpoints and bodies. |
| UAT-012 | T-106,T-107 | BLOCKED/PARTIAL | Exact preview core artifacts hash-match local reviewed files and local suites pass 13/13 and 49/49. Authenticated live-host verification was unavailable. |

Cross-task synthetic workflows X-01, X-02, X-03, and X-05 completed. X-04 real authorization lifecycle and the live-host portion of X-06 remain blocked.
