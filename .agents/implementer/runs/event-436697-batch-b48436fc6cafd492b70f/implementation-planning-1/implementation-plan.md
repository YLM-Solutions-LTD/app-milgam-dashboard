# Concrete browser implementation plan

## T-301 — From/To controls and inclusive date contract

1. Replace `buildMonthRange` as the applied-range path in `site/date-range.js` with strict helpers that parse canonical `YYYY-MM-DD`, prove a real Gregorian date, enforce years 1753–9999 and `from <= to`, and return timezone-less `T00:00:00` / `T23:59:59.997` bounds. Retain discovery helpers only to choose an initial default month; discovery must never whitelist later user ranges.
2. Replace year/month `<select>` controls in `site/app.js` with native `type=date` From and To inputs, an Apply button, analytical Refresh, a dedicated inline error/status relationship, and Hebrew labels. Keep draft input values in the view until Apply; set `aria-invalid`, announce validation failure, focus the first relevant input, and send no machine/API event for invalid input.
3. Add responsive logical CSS in `site/app.css`: 44px minimum targets, visible focus, wrapping controls and error copy at 390×844 and 1440×900 in RTL/LTR. Preserve Arial, named weights, and `#1e6bd6` accent.
4. Extend date and UI tests for leap/non-leap dates, one-day `.997`, year bounds, impossible/missing/reversed input, cross-year and out-of-discovery ranges, empty discovery, no `Z`, ten draft edits with zero effects, keyboard/focus, and overflow.

## T-302 — generation-bound analytical lifecycle

1. Refactor `site/dashboard-machine.js` context from `selectedPeriod` to separate discovered periods, draft range, and `selectedRange`. Discovery success seeds a default full-month range and starts one analytical generation; `RANGE_APPLIED` accepts only a prevalidated range. Ready/empty `REFRESH` reloads that selected range; `RETRY` remains error-only.
2. Make every analytical generation own a monotonically increasing request ID and one abort controller. Update `site/dashboard-data.js`/API calls so division, summary, category, and closure start concurrently exactly once with the identical range and shared cancellation signal. Superseded request or authorization generations may settle but cannot commit.
3. Split `site/app.js` refresh entry points: Apply/analytical Refresh verify the current capability and send only analytical events; snapshot refresh calls only the snapshot controller. Preserve the selected range across fresh verified host re-entry and do not clear existing displayed data on draft edits.
4. Preserve existing mappings, charts, strict CSP, sanitized diagnostics, empty/error rendering, host capability checks, and `CURRENT_SNAPSHOT_LIVE_CALLS_ENABLED=true`.
5. Add deterministic request accounting for four exact bodies, invalid-zero requests, ready/empty refresh, delayed reverse-order generations, analytics/snapshot isolation, and ten rapid Applies: 40 analytical requests, zero snapshot requests, peak analytical concurrency <=4, newest generation only committed.
6. Add measured 0/1/1,000-row-per-report fixtures (<=4,000 rows and <=4 MiB decoded), warmed aggregate mapping <100 ms, browser render <50 ms, no app long task >=50 ms, and <=600 dashboard descendants at both viewports/directions.

## T-303 — decimal-string snapshot counts and bounded recovery

1. Replace the event/permit `count` helper in `site/current-snapshot.js` with a bounded normalizer: accept safe non-negative integer numbers or trimmed ASCII digit-only strings whose conversion is safe; reject empty, signs, fractions, exponent notation, negatives, unsafe/very-long values, and malformed input.
2. Apply normalization only to event `TotalCount`/`OpenCount` and permit `ValidCount`/`MissingCount`/`OverdueCount`. Keep envelope `TotalCount` numeric; keep equipment rows, deduplication/population reconciliation, scope reconciliation, separate permit categories, required dates, and no-fabricated-zero behavior unchanged.
3. Preserve dataset and bounded classification/status through `safeError` and render concise report-specific Hebrew guidance in `site/app.js`. Diagnostics may expose only fixed endpoint identifiers and bounded kind/status; never body text, arbitrary exception strings, API address, token, credential, or fixture markers.
4. Preserve last-good facts/timestamp as stale on 401/403/revocation, disable ineffective retry for the tainted generation, and recover only on a distinct verified SDK/GuestBridge re-entry. Ordinary bounded failures remain retryable.
5. Retain exactly three concurrent snapshot requests per load/refresh and coalesce ten pending refresh/retry activations to one three-request generation, peak concurrency three, one commit. Terminal denial produces zero new effects until re-entry.
6. Test string counts from HTTP transport through rendered numeric facts, whitespace/leading zeros, all rejection forms, reconciliation, 400/404/500/network/invalid-response guidance, disclosure resistance, stale retention, and re-entry. Measure 0/1/1,000/10,000 equipment rows: <=2.5 MiB decoded, warmed mapping <100 ms, browser render <50 ms, no app long task >=50 ms, and <=80 snapshot descendants.

## T-305 — truthful all-state release footer

1. Copy the builder's repaired packaged `release-footer.js` and `release-footer.css` unchanged into `site/assets/`; verify copied hashes against the selected skill assets. Add the stylesheet and module using relative same-origin URLs.
2. Copy exactly one packaged `footer[data-simplyvibe-release]` semantic `<dl>` into `site/index.html` after state-dependent `<main>` and before scripts. Keep source attributes unstamped and initial values unavailable; do not add `release.json`, a runtime fetch, authentication, hand-maintained version, current time, refresh time, or event time.
3. Preserve the repaired exact environment rule: only `preview` or `production` may expose otherwise-valid metadata. Missing, empty, or unsupported environments make all three values Unavailable; preview adds the localized Preview label and Not released; production requires valid frozen release time.
4. Keep the footer in normal flow, bidi-isolated, visually distinct from dashboard refresh copy, and wrapping without overlap/overflow at both required viewports/directions and zoom. Language changes must relocalize labels/values.
5. Add source and synthetic browser tests for one marker, all labels/hooks, host-waiting/loading/no-context/empty/error/stale/ready persistence, absent/malformed metadata, five unsupported-environment variants, valid preview/production, timezone formatting, language/direction changes, zero footer fetch/host/auth effects, and no sensitive metadata. Synthetic stamps are never release evidence.

## T-304 — complete verification and controller handoff

1. Rediscover all JS/MJS/CJS test/spec files immediately before execution, reconcile the inventory, and run the unchanged site command plus explicit complete QC, UAT, and harness lists. Preserve exact commands, totals, skips, and every failure; any unexplained failure blocks readiness.
2. Verify JavaScript syntax, strict `_headers`, same-origin executable assets, actual packaged SDK identity, footer asset identity, exactly one footer marker, no inline-CSP regression, and `CURRENT_SNAPSHOT_LIVE_CALLS_ENABLED=true` in the exact candidate.
3. Use Playwright routing only with the actual packaged SDK and unmodified GuestBridge at fully intercepted `https://milgam.ylm.co.il/controller-host-fixture/`. Fulfill all host/API traffic synthetically, abort every real tenant/API request, and never inject a fake adapter or readiness promise.
4. At 390×844 and 1440×900 in RTL and LTR, exercise ranges, snapshot strings/errors, authorization/re-entry, stale data, navigation, footer states, keyboard/focus/announcements, CSP/page errors, responsive/zoom behavior, and all performance budgets. Both certificate controls must produce exactly `Navigate {Url:'#/Permits/Dashboard'}`; held old commands must have zero navigation effects after revocation.
5. Record browser/version, candidate identity, viewport/direction, rows/bytes, initiated/aborted/completed/committed totals, peak concurrency, warmed mapping/render samples, descendant counts, long tasks, and third-party executable requests (zero expected).
6. Hand implementation evidence to fresh controller reviews. Do not reuse attachment claims, prior approval, PR metadata, or fixture permissions as release authority. Exact-preview metadata/head matching, deployed tenant permissions, approval, publication, and completion remain controller-owned; the prohibited deployed origin stays unaccessed in local work.
