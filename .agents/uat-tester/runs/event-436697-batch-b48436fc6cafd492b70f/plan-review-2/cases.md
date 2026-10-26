# Milgam dashboard UAT cases — plan review cycle 2

These cases are designed, not executed. Final review records `PASS`, `FAIL`, or `BLOCKED` against the exact authorized preview; skipped steps are not passes.

## UAT-301 — Authorized entry, range seeding, and Apply

- Tasks: `T-301`, `T-302`, `T-304`.
- Through the actual SDK/GuestBridge, verify no API call precedes readiness; non-empty discovery seeds a full month and empty discovery remains usable. Draft edits produce zero calls. Single-day, cross-year, boundary, and out-of-discovery valid ranges each issue exactly four analytical calls with identical timezone-less `T00:00:00`/`T23:59:59.997` bounds and no snapshot call. Refresh and fresh verified re-entry retain the applied range.

## UAT-302 — Invalid dates, focus, and zero effects

- Tasks: `T-301`, `T-304`.
- Submit missing, impossible, non-leap, malformed, reversed, pre-1753, and post-9999 values; accept leap and both year boundaries. Each invalid Apply announces concise Hebrew guidance, marks and focuses the relevant input, retains displayed data, and issues zero effects. Verify keyboard use, 44px targets, and no overflow at 390×844 and 1440×900 in RTL/LTR.

## UAT-303 — Latest analytical generation and isolation

- Tasks: `T-302`, `T-304`.
- Ten draft edits initiate zero calls. Ten rapid valid Applies initiate exactly 40 analytical and zero snapshot calls, peak at four active analytical requests, and allow only the newest four to commit; the prior 36 abort or settle ignored. Delayed stale and revoked-generation responses have zero state effect. Analytics never changes snapshot facts/timestamp, and snapshot refresh never changes the analytical range.

## UAT-304 — Analytical volume and browser budgets

- Tasks: `T-301`, `T-302`, `T-304`.
- For 0, 1, and 1,000 rows per each of four reports, including duplicate-heavy and malformed boundaries, record candidate/browser/viewport/direction, decoded bytes, lifecycle totals, peak concurrency, warmed mapping/render samples, descendants, and long tasks. At 4,000 combined rows require at most 4 MiB decoded, mapping under 100 ms, ready render under 50 ms, no app task ≥50 ms, and at most 600 dashboard descendants.

## UAT-305 — Decimal-string counts and atomic rejection

- Tasks: `T-303`, `T-304`.
- With numeric envelope counts and strict equipment rows, trimmed/leading-zero digit strings for the named event/permit aggregates render as reconciled numbers. Empty, signed, fractional, exponent, negative, unsafe, missing, malformed, over-total, unreconciled, very long, and `9007199254740992` variants reject atomically without fabricated zero, partial render, or nonlinear work. Envelope numeric strings and changed equipment semantics remain invalid.

## UAT-306 — Snapshot recovery, coalescing, and budgets

- Tasks: `T-303`, `T-304`.
- For 0, 1, 1,000, and 10,000 equipment rows, keep aggregate fixtures valid and record the same browser evidence. At 10,000 rows require ≤2.5 MiB decoded, mapping under 100 ms, render under 50 ms, no app task ≥50 ms, and ≤80 snapshot descendants. Ten activations while pending coalesce to exactly three initiated calls, peak three, and one commit. Ordinary errors remain retryable with bounded report guidance. 401/403/revocation retains stale last-good facts, disables retry, permits zero old-generation calls/effects, and recovers only on fresh verified re-entry. No body, address, token, marker, arbitrary exception, or credential reaches DOM/logs/diagnostics.

## UAT-307 — Exact Navigate and complete responsive dashboard

- Tasks: `T-301`, `T-302`, `T-303`, `T-304`.
- Both certificate links emit exactly `Navigate {Url:"#/Permits/Dashboard"}` only after readiness. A held command released after revocation has zero effects; a fresh session succeeds. Across loading/ready/empty/validation/error/stale states at both viewports and directions, verify focus, labels, announcements, non-color chart meaning, no overflow, strict CSP, zero third-party executable requests, and no relevant page errors.

## UAT-308 — Inventory-aware controller release gate

- Tasks: `T-301`, `T-302`, `T-303`, `T-304`.
- Rediscover and explicitly reconcile all applicable JS/MJS/CJS test/spec files before execution. Run configured site plus complete QC, UAT, and harness inventories; record exact commands, totals, skips, and failures. Verify candidate identity, packaged SDK identity, and enabled live-snapshot flag. Any omitted file, required workflow failure, candidate mismatch, missing role, critical high-confidence issue, or absent new authorization blocks readiness. Synthetic permissions, attachments, old approvals, and PR metadata are never tenant/release proof.

## Cross-task workflows

- `X-301`: UAT-301 → UAT-302 → UAT-303 → UAT-304.
- `X-302`: UAT-305 → UAT-306 → UAT-307.
- `X-303`: accepted entry → snapshot/command revocation → fresh verified re-entry.
- `X-304`: UAT-301–UAT-307 → complete inventory and honest gate in UAT-308.

Plan-review execution status: all UAT workflows are designed, not executed against a preview. Existing source-level suites were run only as plan-stage diagnostic evidence; they do not execute or pass these revision-9 exact-preview cases.
