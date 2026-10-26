# Milgam dashboard UAT cases — revision 12

These cases are designed, not executed against an authorized preview. Final review must record PASS, FAIL, or BLOCKED with exact candidate identity, browser, viewport, direction, preconditions, observations, and evidence.

## UAT-301 — Authorized entry and inclusive Apply

- Tasks: `T-301`, `T-302`, `T-304`.
- Through the actual packaged SDK/GuestBridge, verify zero API effects before readiness. Non-empty discovery seeds a full month; empty discovery leaves Apply usable. Ten draft edits issue zero calls. Valid one-day, cross-year, year-boundary, and out-of-discovery ranges each issue exactly four analytical calls with identical timezone-less `T00:00:00`/`T23:59:59.997` bounds, no `Z`, and zero snapshot calls. Analytical refresh and verified fresh re-entry retain the applied range.

## UAT-302 — Invalid dates, focus, and zero effects

- Tasks: `T-301`, `T-304`.
- Submit missing, impossible, non-leap, malformed, reversed, pre-1753, and post-9999 values; accept leap dates and both year boundaries. Every invalid Apply announces bounded Hebrew guidance, sets `aria-invalid`, focuses the relevant input, retains displayed data, and issues zero effects. Verify keyboard use, 44px targets, zoom, and no overflow at 390x844 and 1440x900 in RTL/LTR.

## UAT-303 — Latest analytical generation and snapshot isolation

- Tasks: `T-302`, `T-304`.
- Ten rapid valid Applies initiate exactly 40 analytical and zero snapshot calls with peak analytical concurrency at most four. Only the newest four may complete and commit; the prior 36 abort or settle ignored. Delayed old and revoked-generation results have zero state effect. Analytics leaves snapshot facts/timestamp unchanged; snapshot refresh leaves the applied analytical range unchanged.

## UAT-304 — Analytical volume budgets

- Tasks: `T-301`, `T-302`, `T-304`.
- Exercise 0, 1, and 1,000 rows for each analytical report, including duplicate-heavy and malformed boundaries. At 4,000 combined rows require at most 4 MiB decoded, warmed mapping under 100 ms, post-response rendering under 50 ms, no app-attributable task of 50 ms or more, and at most 600 dashboard descendants. Record initiated/aborted/completed/committed totals, bytes, peak concurrency, timing samples, long tasks, candidate/browser, viewport, and direction.

## UAT-305 — Decimal-string counts and atomic rejection

- Tasks: `T-303`, `T-304`.
- With numeric envelopes and unchanged equipment rows, accept trimmed/leading-zero digit strings only for the five named event/permit aggregates and render reconciled numeric facts. Reject empty, signed, fractional, exponent, negative, unsafe, missing, malformed, over-total, unreconciled, very-long, and `9007199254740992` values atomically. Numeric-string envelopes and altered equipment semantics remain invalid.

## UAT-306 — Snapshot recovery, coalescing, and budgets

- Tasks: `T-303`, `T-304`.
- Exercise 0, 1, 1,000, and 10,000 equipment rows with valid aggregates. At 10,000 rows require at most 2.5 MiB decoded, warmed mapping under 100 ms, rendering under 50 ms, no app-attributable task of 50 ms or more, and at most 80 snapshot descendants. Ten pending refresh/retry activations coalesce to three initiated calls, peak three, and one commit. Ordinary failures remain retryable with bounded report-specific guidance; 401/403/revocation retains visibly stale last-good facts, disables retry, issues zero old-generation effects, and recovers only after verified fresh re-entry. No untrusted body, address, token, marker, arbitrary exception, or credential reaches UI, logs, or diagnostics.

## UAT-307 — Exact Navigate and responsive state matrix

- Tasks: `T-301`, `T-302`, `T-303`, `T-304`.
- Both certificate links issue exactly `Navigate {Url:"#/Permits/Dashboard"}` after readiness through the real SDK/GuestBridge. A held command released after revocation has zero effect; a fresh session succeeds. Across host-waiting, loading, ready, empty, validation, recoverable error, terminal error, and stale states at both viewports/directions, verify labels, focus, announcements, non-color chart semantics, strict CSP, no overflow, zero third-party executable requests, and no relevant page errors.

## UAT-308 — Inventory-aware release gate

- Tasks: `T-301`, `T-302`, `T-303`, `T-304`, `T-305`.
- Rediscover all `*.test.{js,mjs,cjs}` and `*.spec.{js,mjs,cjs}` files. Run the configured site suite and complete explicit QC/UAT/harness inventories with commands, totals, skips, and failures. Verify exact candidate identity, packaged-SDK identity, and enabled live snapshot. Any omitted test, required failure, candidate mismatch, missing reviewer, critical high-confidence finding, absent new authorization, or footer gate failure blocks readiness.

## UAT-309 — Truthful all-state release footer

- Tasks: `T-305`, `T-304`.
- In host-waiting, loading, no-context, empty, recoverable error, terminal stale authorization, and ready states, assert the same single in-flow `footer[data-simplyvibe-release]` remains visible with semantic `dl`, all three labels/values, and no duplication or content obstruction. Exercise absent/malformed synthetic attributes, valid preview metadata with empty release time, and valid production metadata: unavailable stays unavailable, preview explicitly labels Preview and Not released, and only valid frozen production stamps format a release date. Switch Hebrew RTL/English LTR and both required viewports; verify `bdi`, wrapping, zoom, no horizontal overflow, and visual distinction from data-refresh time. Instrument fetch and host-command paths and require zero footer network/authentication effects. On the exact preview require version equals the reviewed head's first 12 lowercase hex characters and do not substitute page-open, viewer-current, event, or data-refresh time.

Cross-task sequences: `UAT-301 -> UAT-302 -> UAT-303 -> UAT-304`; `UAT-305 -> UAT-306 -> UAT-307`; authorized entry -> terminal revocation -> fresh re-entry; every runtime state -> `UAT-309`; all cases -> `UAT-308`.
