# Performance plan review — cycle 1

## Result

- Verdict: `changes_required`
- Batch: `event-436697-batch-64aedcef61f479aaf509`
- App: `milgam-dashboard`
- Reviewed tasks: `T-101` through `T-107`
- Handled action IDs: `536946`, `536949`, `537034`, `537037`, `537040`
- Runtime/preview measurement: not available at plan-review stage

The design is directionally efficient: it fixes request fan-out at three, forbids pagination and automatic parameter expansion, starts calls concurrently, aborts superseded loads, ignores stale results, uses map-based equipment deduplication, and renders only equipment aggregates. One release-relevant planning gap remains: the test and delivery tasks provide no numeric budgets or high-volume cases with which to verify those claims.

## Findings

### PERF-PLAN-001 — Performance requirements are qualitative and omit volume/budget acceptance tests

- Stable fingerprint: `perf:plan:snapshot-missing-measurable-budgets-and-volume-cases:v1`
- Severity: `medium`
- Confidence: `high`
- Tasks: `T-101`, `T-102`, `T-103`, `T-104`, `T-105`, `T-106`, `T-107`
- Evidence: the plan specifies “exactly three,” concurrent fetching, linear rendering, map deduplication, and no obsolete raw response retention. However, `T-106` requires no large equipment fixture, timing ceiling, DOM ceiling, response-byte measurement, refresh-burst bound, or navigation burst case. `T-107` requires exact check results but no performance measurements or browser/runtime identity.
- Impact: the equipment contract is a complete, unpaged facts response. Without a representative large-result case, an implementation can satisfy functional tests while adding quadratic deduplication, retaining multiple raw generations, expanding one DOM node per fact, or creating a refresh/navigation request storm. Reviewers would have no objective pass/fail threshold.
- Reproduction: inspect the requirements, acceptance criteria, and validation scenarios for `T-101`–`T-107`; search for numeric limits on rows, mapping/render time, DOM nodes, bytes, refresh bursts, or in-flight requests. Only the three-request functional count is explicit.
- Required plan change: incorporate the budgets and cases in `evidence/task-coverage.md` into `T-101`–`T-107`, especially `T-106` and `T-107`. If the controller chooses different ceilings, they must still be numeric, reproducible, and record browser/runtime plus fixture size.

## Non-findings and constraints

- No pagination recommendation is made: the supplied contract explicitly says each report returns a complete result once. Client-side pagination would invent a contract.
- No arbitrary response-size rejection is required: record transfer/decoded bytes and test representative volumes; server-side population constraints are not supplied.
- There is no observed preview regression because no exact preview, digest, browser trace, or live dataset was supplied.
- Existing source sizes were inspected only to calibrate the plan review; source and shared artifacts were not modified.

## Evidence

- `evidence/review-scope.md`
- `evidence/task-coverage.md`

## Scope integrity

No app source, shared plan/task artifact, provider, Git state, deployment, SimplyLog lifecycle, or external system was changed. Writes are confined to the performance-reviewer role home.
