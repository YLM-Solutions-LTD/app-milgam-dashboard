# UAT tester memory

## Current batch

- App: `milgam-dashboard`
- Batch: `event-436697-batch-64aedcef61f479aaf509`
- Stage: test authoring cycle 2
- Frozen handled action IDs: `536946`, `536949`, `537034`, `537037`, `537040`
- Scope: define task-traceable end-to-end acceptance coverage for `T-101` through `T-107` and cross-task workflows; no preview execution occurs during plan review.
- Safety boundary: shared plan, task board, app, preview, planner artifacts, and frozen inputs are read-only. UAT writes remain under `.agents/uat-tester/`.

## Durable UAT constraints

- Validate current-snapshot behavior separately from monthly analytics.
- Treat authenticated host integration as proven only when exercised in an approved host or controller-provided host harness against the exact preview.
- Never turn unavailable, malformed, permission-denied, or failed report data into zero.
- Permit controls navigate only to `#/Permits/Dashboard`; equipment validity remains explicitly unavailable.
- Mutating production workflows are out of scope; the planned dashboard interactions are read-only apart from host navigation.
- Preserve stable acceptance IDs `UAT-001` through `UAT-012` across plan revisions; extend their steps rather than renumbering them.
- Final review must record the numeric evidence introduced in plan revision 2: three-call start spread, 0/1/1,000/10,000-row mapper measurements and decoded bytes, 10-refresh newest-generation behavior, 20-activation command count, snapshot DOM cardinality, and phone/desktop render timings.
- Trust-boundary acceptance requires negative proof that non-parent, HTTP, unapproved API, direct, timeout, fallback, malformed, and mismatched-response contexts cause zero authenticated requests and privileged commands.
# Current assignment

- Batch: `event-436697-batch-64aedcef61f479aaf509`
- Stage: `test-authoring-2`
- Scope: deterministic local UAT authoring and execution with synthetic host context/API fixtures; no live host, tenant token, network, or application-source changes.
- Owned paths: `tests/uat/`, this memory, the current run folder, and `.agents/uat-tester/tmp/` only.

## Test-authoring result

- Attempt 2 made T-101 through T-107 traceability executable and strengthened raw-date, zero-effect trust, and identical-ID deduplication coverage.
- Synthetic UAT: 12/13 passed; regression: 47/47 passed on Node.js 20.20.2.
- Finding `uat:equipment-identical-dedup:envelope-cardinality:v1`: envelope cardinality rejects identical duplicate facts before required EquipmentId deduplication. Verdict: reject.
- Browser, exact-preview, and approved live-host integration were not supplied, executed, or claimed.

## Test-authoring cycle 2 intent

- Re-run deterministic, synthetic-only UAT after implementation cycle 2 and retain stable task and case IDs.
- Verify remediation of `uat:equipment-identical-dedup:envelope-cardinality:v1` without weakening trust-boundary, date-range, unavailable-state, or permit-navigation acceptance.
- Write evidence only under `.agents/uat-tester/runs/event-436697-batch-64aedcef61f479aaf509/test-authoring-2/` and executable tests only under `tests/uat/`.

## Test-authoring cycle 2 result

- Verdict: approve for deterministic test authoring.
- Synthetic UAT: 13/13 passed; app regression: 49/49 passed on Node.js v20.20.2.
- Closed regression fingerprint `uat:equipment-identical-dedup:envelope-cardinality:v1`; public-marker forgery and accepted-context immutability are also directly covered.
- Exact-preview browser, viewport/render, and approved live-host integration remain unexecuted because no authorized preview or host harness was supplied.
