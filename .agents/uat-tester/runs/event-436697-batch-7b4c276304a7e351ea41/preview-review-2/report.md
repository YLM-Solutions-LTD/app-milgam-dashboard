# UAT preview review 2

## Verdict: reject

The packaged SDK now reaches the actual controller bridge, exact permit navigation works, and old command responses are suppressed across session rotation. Release acceptance still fails because refresh errors erase last-good snapshot data, a 401 does not prevent another old-session authenticated refresh, and permit activation is not fully single-flight.

## Findings

### `uat:snapshot-refresh-failure:last-good-cleared:v1`

- Severity: high; confidence: high; tasks: T-203, T-204, T-205; cases: UAT-205, UAT-208, UAT-210.
- Reproduction: load a valid snapshot through the supplied fixture, click refresh, and return HTTP 500 or 401 for one current route.
- Observed: `#snapshot-content` changes from populated facts to empty text. A normal 500 retry later recovers.
- Expected: retain and mark the last-good snapshot stale with actionable retry; authorization loss must also retain stale data.

### `uat:authorization-expiry:old-generation-refresh-allowed:v1`

- Severity: high; confidence: high; tasks: T-203, T-205; cases: UAT-208, UAT-210.
- Reproduction: after a valid load, return 401 for a current refresh, then activate refresh again before `controllerHarness.reenter()`.
- Observed: three additional authenticated current-report requests are issued through the old fixture session.
- Expected: 401 revokes the matching application capability, denies subsequent authenticated work, and requires fresh verified SDK re-entry.

### `uat:permit-command-singleflight:race:v1`

- Severity: medium; confidence: high; tasks: T-203, T-204, T-205; cases: UAT-206, UAT-210.
- Reproduction: hold the first real bridge command, dispatch 20 rapid permit activations, then release it.
- Observed: two generation-1 Navigate effects commit.
- Expected: exactly one command chain/effect while pending.

## Passed boundaries

T-201 and T-202 pass their exact-preview UAT coverage. T-203–T-205 remain rejected by the findings above. Evidence is in `cases.md`, `evidence/summary.md`, `evidence/observations.json`, and four viewport screenshots.
