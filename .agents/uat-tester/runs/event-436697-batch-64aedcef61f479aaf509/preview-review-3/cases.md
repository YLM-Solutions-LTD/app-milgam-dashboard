# UAT execution — preview review cycle 3

Target: `https://c9756759.app-milgam-dashboard.pages.dev` (controller-supplied head `50972d0b555115d3b1c9da90f7df0dc4790c6e8e`). Chromium `140.0.7339.16`; 390×844 and 1440×900; RTL and LTR. Synthetic parent/API context used no real tenant token.

| Case | Tasks | Result | Exact-preview observation |
|---|---|---|---|
| UAT-001 | T-101,T-102,T-103,T-105 | FAIL/BLOCKED | Accepted context started analytics but issued zero current-report requests because the deployed flag is false. No coherent current snapshot appeared. |
| UAT-002 | T-102,T-104,T-105,T-106 | BLOCKED | Permit units, equipment total/unavailable classification, and report-date delegation were absent because snapshot loading was disabled. Local deterministic coverage passed only. |
| UAT-003 | T-103,T-105,T-106 | BLOCKED | Analytics rendered, but snapshot/month independence cannot be observed when the snapshot never loads. |
| UAT-004 | T-101,T-103,T-106 | BLOCKED | Refresh is disabled, so overlapping/10-refresh deployed behavior cannot execute. Synthetic local suite passed. |
| UAT-005 | T-101,T-102,T-103,T-105,T-106 | BLOCKED | No current request occurs, so deployed permission/malformed/retry workflows cannot execute. |
| UAT-006 | T-101,T-103,T-104,T-106 | PARTIAL/BLOCKED | Direct access timed out with zero API calls. No approved real SimplyLog host/harness was supplied for expiry/re-entry and the disabled snapshot prevents deployed synthetic lifecycle exercise. |
| UAT-007 | T-103,T-105,T-106 | BLOCKED | Refresh is disabled, so deployed last-good stale retention cannot execute. |
| UAT-008 | T-104,T-105,T-106 | BLOCKED | Permit controls are not rendered, so exact navigation and 20-activation locking cannot execute on the exact preview. |
| UAT-009 | T-104,T-105,T-106 | BLOCKED | Permit controls are not rendered, so rejection/surviving/removed/rerendered focus cleanup cannot execute on the exact preview. |
| UAT-010 | T-105,T-106 | PARTIAL | Disabled state has no horizontal overflow at tested RTL/LTR phone/desktop viewports; the required ready snapshot was not rendered. |
| UAT-011 | T-101,T-102,T-106 | BLOCKED | Exact deployed current transport was not invoked. Representative-volume local deterministic case passed. |
| UAT-012 | T-106,T-107 | PARTIAL/BLOCKED | Enforcing self-only script CSP is present; all executable requests are same-origin; deployed/local XState SHA-256 is `06f5c308e93a6542c15c13c6bc16ac6841e995538ee48682a13909e298650024`; constants match local and leave the flag false. Required enabled exact-preview and approved real-host lifecycle evidence are unavailable. |

Supporting suites passed 13/13 UAT and 55/55 site assertions on Node.js v20.20.2. They do not replace exact-preview workflow evidence.

