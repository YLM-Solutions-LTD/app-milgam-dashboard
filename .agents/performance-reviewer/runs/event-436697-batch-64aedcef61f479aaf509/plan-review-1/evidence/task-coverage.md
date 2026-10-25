# Performance task coverage

| Task | Existing performance control | Missing measurable validation |
|---|---|---|
| T-101 | Exactly three concurrent POSTs; `{}` bodies; cancellation; no pagination | Assert 3 requests/refresh, 0 on period change, 0 automatic retries, and maximum 3 active requests for the current generation. Record aggregate response bytes and duration. |
| T-102 | Map-keyed equipment dedupe and linear mapping | Add 0/1/1,000/10,000-row equipment fixtures, including duplicate-heavy and nullable-field cases; measure mapping time and retained output size. |
| T-103 | Request IDs, AbortController, late-result suppression | Add a 10-refresh burst case; assert superseded work is aborted, only the newest generation commits, and no retry/request storm occurs. |
| T-104 | Pending-navigation busy lock | Add a rapid activation case; assert one `ready`/`Navigate` chain is in flight per control interaction lock. |
| T-105 | Only aggregate equipment total is rendered; responsive stacking | Assert snapshot DOM count stays constant as equipment input grows and set a narrow/wide render budget. |
| T-106 | Deterministic local contract/regression tests | No explicit data-volume fixtures, timing ceiling, DOM ceiling, request-count ceiling, or byte measurements are required. |
| T-107 | Exact local-check reporting and flag reset | Verification record does not require performance metrics or environment metadata. |

## Proposed acceptance budgets

These budgets make the existing design claims testable without changing the supplied API contract:

- Network: exactly 3 snapshot HTTP requests for initial load or one refresh; 0 for year/month changes; 0 automatic retries; no pagination; at most 3 requests belonging to the current generation active at once.
- Orchestration: all 3 requests initiated within 50 ms of one another under a mocked transport; a 10-refresh burst commits only generation 10 and retains only one `lastGoodData` snapshot.
- Adapter: a synthetic 10,000-row equipment envelope, including nullable fields, maps/deduplicates in at most 100 ms after one warm-up on the project CI runtime; record actual time and runtime version. A duplicate-heavy 10,000-row input must remain linear and produce the expected unique count.
- Rendering: equipment input growth from 1 to 10,000 rows adds 0 metric/list DOM nodes because only aggregate total/classification is rendered; snapshot region stays at or below 80 elements. One ready-state render should complete within 50 ms at 390×844 and 1440×900 in the chosen browser, with browser/version recorded.
- Transfer evidence: record decoded response bytes for each of the three mocked 10,000-row envelopes and report them; do not introduce an arbitrary client rejection cap because the server contract says the complete unpaged response is authoritative.
- Navigation: 20 rapid activations while pending produce exactly one host navigation command, and interaction unlocks after resolve/reject.

Timing ceilings are local regression budgets, not claims about live SimplyLog latency. Live latency cannot be judged until an exact preview and authenticated environment are supplied.
