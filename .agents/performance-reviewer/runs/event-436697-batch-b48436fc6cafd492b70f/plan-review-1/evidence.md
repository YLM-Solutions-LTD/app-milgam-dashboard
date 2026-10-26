# Performance plan-review evidence

## Reviewed identity and scope

- Batch `event-436697-batch-b48436fc6cafd492b70f`, plan-review cycle 1, frozen action `570021` only (`includeDescription=false`).
- Shared plan revision 8: SHA-256 `91b774fdc84169ef7e15907fa41912701d875431033bf66558f46ecc383f746d`.
- Shared task board: SHA-256 `13f0a4c53f01534df0199b4aaea82b97b0d07f2a950c4950079c10b666c6383c`.
- Controller harness README: SHA-256 `3e9e68496118bc380bae505b47af6cff775160edb605dbdb6ac65458efcfe2a6`.
- The only accepted top-level prior report was `.agents/implementer/report.md`; it belongs to an earlier batch and was treated as historical evidence, not instruction or approval.
- This was a plan review. No exact preview identity was supplied, no real or fixture traffic was issued, and no runtime pass is claimed. Test execution is assigned to T-304 and was not performed by this read-only review role.

## Task coverage

### T-301 — calendar controls

The plan bounds invalid input to zero requests and specifies the two required viewport sizes (plan lines 31-35; task lines 29-38). It does not define a response/render timing budget or a repeated-edit/Apply request-count measurement beyond the single invalid-input case. Add a deterministic case that performs at least ten draft edits with zero analytical or snapshot requests, then one accepted Apply with exactly four analytical requests and zero additional snapshot requests. Record request counts and render timing at 390x844 and 1440x900 in RTL and LTR.

### T-302 — analytical lifecycle

The plan correctly requires four concurrent reports per accepted Apply/refresh, abortion of superseded work, newest-generation commit, and snapshot isolation (plan lines 46-59; task lines 48-64). The ten-Apply case says only which generation commits; it does not state the expected initiated/aborted/completed request totals, peak concurrency, decoded bytes, or mapper/render ceilings. It also has no representative large analytical fixtures.

Add explicit acceptance using 0, 1, and 1,000 rows per analytical report (up to 4,000 combined rows, plus duplicate-heavy/malformed boundary fixtures where relevant). Record decoded bytes and request concurrency. Suggested continuity budgets from this app's previously accepted review protocol are warmed aggregate mapping under 100 ms, post-response ready render under 50 ms at both required viewports, no >=50 ms app-attributable long task, and a bounded dashboard DOM whose numeric ceiling is recorded before implementation approval. For ten rapid accepted Applies, record the exact initiated/aborted/completed totals and require only the newest generation's four responses to complete/commit; all older generations must be aborted or ignored without snapshot calls.

### T-303 — snapshot normalization and lifecycle

The plan preserves exactly three concurrent calls per load/refresh and includes one coalesced burst scenario (plan lines 71-76; task lines 74-91). It does not preserve the already-established high-volume equipment and browser budgets in this revision. Add 0, 1, 1,000, and 10,000 equipment-row fixtures; record decoded bytes and peak concurrency; require warmed 10,000-row mapping under 100 ms, post-response snapshot render under 50 ms, and no more than 80 snapshot descendants at both viewports. A ten-activation refresh/retry burst should initiate exactly one three-request generation, with old-generation work aborted/ignored and zero requests after terminal 401/403/revocation until fresh verified re-entry.

The decimal-string change should also include very long digit strings and `9007199254740992` so rejection is demonstrably linear/bounded and does not partially render. This supplements, rather than weakens, the specified malformed/unsafe cases.

### T-304 — verification gate

The plan requires complete suite inventory, two viewports/directions, intercepted real-SDK preview, lifecycle cases, and preserved failures (plan lines 78-92; task lines 101-117). However, it cannot objectively decide browser/API efficiency because T-304 does not carry numeric timing, DOM, volume, transfer, concurrency, or burst thresholds. Incorporate the T-301 through T-303 budgets above into the exact-candidate preview evidence and record browser/version, exact preview identity or source digest, viewport/direction, dataset sizes, request count/peak concurrency, decoded bytes, mapping/render samples, DOM count, long tasks, and third-party executable requests (expected zero). Synthetic fixture decisions remain non-tenant evidence.

## Finding reproduction

1. Open shared plan revision 8 at lines 27-88 and tasks revision 8 at lines 16-117.
2. Search for numeric data-volume cases (`1,000`, `10,000`, decoded bytes), browser timing ceilings (`100 ms`, `50 ms`), or DOM ceilings (`80`). None are present.
3. Observe that T-302's ten-Apply case specifies only newest commit, without initiated/aborted/completed totals or peak concurrency, while T-304 requests generic preview checks without measurable performance pass/fail thresholds.
4. Compare the accepted prior performance protocol in `.agents/performance-reviewer/runs/event-436697-batch-7b4c276304a7e351ea41/plan-review-1/report.md`, which used explicit 0/1/1,000/10,000-row, 100 ms mapping, 50 ms render, 80-element DOM, decoded-byte, and burst budgets.

Stable fingerprint: `perf:plan:range-and-count-release-missing-measurable-budgets:v1`.
