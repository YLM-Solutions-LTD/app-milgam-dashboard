# UAT preview review 2 cases

| Case | Tasks | Result | Observation |
|---|---|---|---|
| UAT-201 | T-201, T-203 | Pass | Verified SDK context starts exactly three concurrent current-report POSTs with `{}`; direct entry starts zero. |
| UAT-202 | T-201, T-203, T-204 | Pass | Events, permits, and 10,000 unique equipment facts render from strict envelopes. |
| UAT-203 | T-203, T-204 | Pass | Permit value date is shown unchanged and equipment classification remains unavailable. |
| UAT-204 | T-201, T-203, T-204 | Pass | Changing analytical month adds zero current calls and retains snapshot text. |
| UAT-205 | T-203, T-204 | Fail | A refresh HTTP 500 clears last-good snapshot content; retry later recovers it. |
| UAT-206 | T-203, T-204, T-205 | Partial | Exact Navigate succeeds, but 20 activations while the first command is pending produce two effects, not one. |
| UAT-207 | T-202, T-204 | Pass | RTL/LTR at 1440×900 and 390×844 has no horizontal overflow; charts render with zero inline styles. |
| UAT-208 | T-203, T-204, T-205 | Fail | A 401 clears last-good data and a forced refresh issues three more current requests before fresh host re-entry. |
| UAT-209 | T-203, T-205 | Pass | Held generation-1 command has zero effects after revoke; re-entry generation 2 performs one exact Navigate. |
| UAT-210 | T-201, T-202, T-203, T-204, T-205 | Fail | Cross-task release workflow is blocked by refresh retention, post-401 denial, and single-flight failures. |

Browser: Chromium 140.0.7339.16. Exact preview/head and raw observations are recorded in `evidence/observations.json`.
