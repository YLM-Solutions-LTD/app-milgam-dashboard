# Milgam dashboard UAT cases — revision 11

These cases are designed, not executed against an authorized preview. Final review must record PASS, FAIL, or BLOCKED with exact candidate/browser/viewport/direction evidence.

## UAT-301 — Authorized entry and inclusive Apply

- Tasks: `T-301`, `T-302`, `T-304`.
- Via the actual packaged SDK/GuestBridge, verify no API call before readiness; non-empty discovery seeds a full month and empty discovery remains usable. Ten draft edits issue zero calls. Valid one-day, cross-year, boundary, and out-of-discovery ranges each issue exactly four analytical calls with identical timezone-less `T00:00:00`/`T23:59:59.997` bounds, no `Z`, and zero snapshot calls. Refresh and fresh authorized re-entry retain the applied range.

## UAT-302 — Invalid dates, focus, and zero effects

- Tasks: `T-301`, `T-304`.
- Submit missing, impossible, non-leap, malformed, reversed, pre-1753, and post-9999 values; accept leap and both year boundaries. Every invalid Apply announces bounded Hebrew guidance, marks and focuses the relevant input, retains displayed data, and issues zero effects. Verify keyboard use, 44px targets, and no overflow at 390x844 and 1440x900 in RTL/LTR.

## UAT-303 — Latest analytical generation and snapshot isolation

- Tasks: `T-302`, `T-304`.
- Ten rapid valid Applies initiate exactly 40 analytical and zero snapshot calls with peak analytical concurrency at most four. Only the newest four may complete and commit; the prior 36 abort or settle ignored. Delayed old and revoked-generation results have zero state effect. Analytics leaves snapshot facts/timestamp unchanged; snapshot refresh leaves the analytical range unchanged.

## UAT-304 — Analytical volume budgets

- Tasks: `T-301`, `T-302`, `T-304`.
- Exercise 0, 1, and 1,000 rows for each report, including duplicate-heavy and malformed boundaries. At 4,000 combined rows require at most 4 MiB decoded, warmed mapping under 100 ms, post-response render under 50 ms, no app task at least 50 ms, and at most 600 dashboard descendants. Record request lifecycle totals, bytes, concurrency, timing samples, long tasks, candidate/browser, viewport, and direction.

## UAT-305 — Decimal-string counts and atomic rejection

- Tasks: `T-303`, `T-304`.
- With numeric envelopes and unchanged equipment rows, accept trimmed/leading-zero digit strings only for the five named event/permit aggregates and render reconciled numeric facts. Reject empty, signed, fractional, exponent, negative, unsafe, missing, malformed, over-total, unreconciled, very-long, and `9007199254740992` values atomically. Numeric-string envelopes and changed equipment semantics remain invalid.

## UAT-306 — Snapshot recovery, coalescing, and budgets

- Tasks: `T-303`, `T-304`.
- Exercise 0, 1, 1,000, and 10,000 equipment rows with valid aggregates. At 10,000 rows require at most 2.5 MiB decoded, mapping under 100 ms, render under 50 ms, no app task at least 50 ms, and at most 80 snapshot descendants. Ten pending activations coalesce to three initiated calls, peak three, and one commit. Ordinary failures remain retryable with bounded report guidance; 401/403/revocation retains stale facts, disables retry, issues zero old-generation effects, and recovers only after fresh verified re-entry. No untrusted body/address/token/marker/exception/credential reaches UI, logs, or diagnostics.

## UAT-307 — Exact Navigate and responsive state matrix

- Tasks: `T-301`, `T-302`, `T-303`, `T-304`.
- Both certificate links issue exactly `Navigate {Url:"#/Permits/Dashboard"}` after readiness. A held command released after revocation has zero effect; a fresh session succeeds. Across loading, ready, empty, validation, error, and stale states at both viewports/directions, verify labels, focus, announcements, non-color chart semantics, strict CSP, no overflow, zero third-party executable requests, and no relevant page errors.

## UAT-308 — Inventory-aware release gate

- Tasks: `T-301`, `T-302`, `T-303`, `T-304`.
- Rediscover all `*.test.{js,mjs,cjs}` and `*.spec.{js,mjs,cjs}` files. Run the configured site suite and complete explicit QC/UAT/harness inventories with commands, totals, skips, and failures. Verify exact candidate and packaged-SDK identity and enabled live snapshot. Any omitted test, required failure, candidate mismatch, missing reviewer, critical high-confidence finding, or absent new authorization blocks readiness.

Cross-task sequences: `UAT-301 -> UAT-302 -> UAT-303 -> UAT-304`; `UAT-305 -> UAT-306 -> UAT-307`; authorized entry -> terminal revocation -> fresh re-entry; all cases -> `UAT-308`.
