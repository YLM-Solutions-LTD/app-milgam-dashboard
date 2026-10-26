# Milgam dashboard UAT cases — revision 12

Designed only; final review must record PASS/FAIL/BLOCKED with exact candidate, browser, viewport/direction, preconditions, observations, and request accounting.

## UAT-301 — Authorized inclusive range (`T-301`, `T-302`, `T-304`)
Actual SDK/GuestBridge; zero effects before readiness. Cover empty/non-empty discovery, ten draft edits with zero calls, and one-day/cross-year/year-bound/out-of-discovery Apply. Each accepted Apply makes four analytical calls with identical timezone-less `T00:00:00`/`T23:59:59.997`, no `Z`, and zero snapshot calls. Refresh and fresh re-entry retain the range.

## UAT-302 — Invalid range/accessibility (`T-301`, `T-304`)
Missing, malformed, impossible, non-leap, reversed, pre-1753, and post-9999 dates produce announced Hebrew guidance, `aria-invalid`, useful focus, retained data, and zero effects; leap/boundary dates pass. Verify keyboard, 44px targets, zoom, and no overflow at 390x844 and 1440x900 RTL/LTR.

## UAT-303 — Latest analytics/isolation (`T-302`, `T-304`)
Ten rapid Applies initiate 40 analytical and zero snapshot calls, peak concurrency <=4, and only newest generation commits. Old/out-of-order/revoked results have zero effect. Analytics leaves snapshot unchanged and snapshot refresh leaves range unchanged.

## UAT-304 — Analytical performance (`T-301`, `T-302`, `T-304`)
Exercise 0/1/1,000 rows per report, duplicates and malformed boundaries. At 4,000 rows enforce <=4MiB decoded, warmed mapping <100ms, render <50ms, no app task >=50ms, <=600 descendants. Record request totals, bytes, peak, timings, long tasks, viewport/direction/browser/candidate.

## UAT-305 — Snapshot normalization (`T-303`, `T-304`)
Accept trimmed digit-only safe strings only for five named aggregates; envelope remains numeric and equipment unchanged. Atomically reject empty, signed, fractional, exponent, negative, missing, unsafe, unreconciled, very-long, and `9007199254740992` values.

## UAT-306 — Snapshot recovery/performance (`T-303`, `T-304`)
Exercise 0/1/1,000/10,000 equipment rows. Enforce <=2.5MiB, warmed mapping <100ms, render <50ms, no app task >=50ms, <=80 descendants. Ten pending activations coalesce to three calls/peak three/one commit. Check bounded ordinary recovery; 401/403/revocation retains stale facts, disables retry, and makes zero calls until fresh re-entry. No untrusted data or secrets reach UI/logs/diagnostics.

## UAT-307 — Navigate/state matrix (`T-301`–`T-304`)
Both links emit exactly `Navigate {Url:"#/Permits/Dashboard"}` through the real bridge; held old-session commands have zero effect and fresh session succeeds. Cover waiting/loading/ready/empty/validation/recoverable/terminal/stale states at both viewport/direction pairs, CSP, chart semantics, focus/announcements, overflow, page errors, and third-party executable requests.

## UAT-308 — Complete release gate (`T-301`–`T-305`)
Rediscover every `*.test.{js,mjs,cjs}` and `*.spec.{js,mjs,cjs}` file; run unchanged configured site plus complete QC/UAT/harness inventories, preserving commands/totals/skips/failures. Candidate/SDK mismatch, disabled snapshot, omission, failure, missing review/authorization, critical finding, or footer failure blocks readiness.

## UAT-309 — Truthful all-state footer (`T-304`, `T-305`)
Across waiting/loading/no-context/empty/error/stale/ready require one visible in-flow semantic footer with all three fields. Exercise unstamped, malformed, preview, and production metadata. Only exact `preview`/`production` environments are valid; missing/unsupported makes all values Unavailable. Preview says Preview/Not released; only valid frozen production stamps format dates. Verify Hebrew/English, RTL/LTR, `bdi`, zoom/wrapping, both viewports, no overlap, distinction from refresh time, and zero network/auth effects. Exact-preview version equals reviewed head's first 12 lowercase hex.

Cross-task paths: authorized entry → apply → superseding apply → refresh; snapshot success → ordinary failure → stale terminal denial → fresh re-entry; every state → footer; all cases → release gate.

