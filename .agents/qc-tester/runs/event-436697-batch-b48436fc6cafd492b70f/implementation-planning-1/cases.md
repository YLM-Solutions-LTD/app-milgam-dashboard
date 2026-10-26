# QC cases for T-301 through T-305

## Deterministic functional and lifecycle checks

### QC-301 — date parsing and exact SQL bounds (T-301 AC1-AC3)

Table-drive leap day, ordinary day, single-day, cross-month, cross-year, discovery-external, empty-discovery, years 1753 and 9999. Assert strict real `YYYY-MM-DD`, `From <= To`, exact `T00:00:00` / `T23:59:59.997`, and no `Z`. Missing, impossible, signed, malformed, reversed, 1752, and 10000 cases must announce the localized inline error, set `aria-invalid`, focus the relevant control, and issue zero analytical and snapshot requests.

### QC-302 — draft/applied separation and accessible controls (T-301 AC2-AC5)

At 390x844 and 1440x900 in RTL and LTR, keyboard-edit ten draft values and assert zero requests and unchanged displayed range/data. Apply one valid range and assert four analytical requests, zero snapshot requests, 44px targets, programmatic labels, logical order, visible focus, polite announcement, no clipping/overlap/horizontal scroll, render under 50 ms, and zero app-attributable long tasks >=50 ms.

### QC-303 — one analytical generation (T-302 AC1-AC5)

Assert division, summary, category, and closure start concurrently exactly once with byte-equivalent FromDate/ToDate bodies. Ten rapid valid Applies must initiate 40 analytical and zero snapshot calls, peak at four active analytical calls, abort or ignore the first 36, and commit only the newest four. Record initiated/aborted/completed/committed counts, decoded bytes, warmed mapping/render samples, peak concurrency, descendants, and long tasks.

### QC-304 — refresh, re-entry, and subsystem isolation (T-301 AC3; T-302 AC3-AC4)

In ready and empty analytics, Refresh reuses the displayed applied range. Fresh authorized SDK re-entry retains and reloads it. Applying/refreshing analytics never issues, cancels, clears, commits, or changes the independent snapshot facts/timestamp; snapshot refresh never edits the range or starts analytics. Exercise slow/out-of-order success, error, abort, and re-entry generations.

### QC-305 — decimal-string normalization (T-303 AC1-AC2, AC6)

End-to-end HTTP-200 fixtures keep envelope `TotalCount` numeric and supply event/permit fields as safe numbers or trimmed digit-only strings. Assert normalized numeric rendering, event reconciliation, separate permit categories, and no fabricated zero. Reject empty/whitespace, signs, fraction, exponent, negative, unsafe, missing, malformed, unreconciled, extremely long digits, and `9007199254740992` without partial commit or nonlinear work. Confirm equipment/envelope contracts remain unchanged.

### QC-306 — bounded recovery and disclosure (T-303 AC3-AC5)

For each snapshot report exercise 400, 404/unavailable, 500, invalid JSON/envelope, timeout/offline/network, 401, and 403. Assert concise Hebrew report-specific guidance and diagnostics limited to a fixed known endpoint plus bounded class/status; body markers, API address, exception text, token, and credentials must be absent from DOM, console, serialized errors, and evidence. After good data, 401/403/revocation retains stale facts, disables ineffective retry, and a ten-activation burst issues zero old-generation calls until distinct verified re-entry.

### QC-307 — snapshot single-flight and performance (T-303 AC5-AC6; T-304 AC3)

While one generation is pending, ten refresh/retry activations coalesce to three initiated calls, peak concurrency three, and one commit. Exercise equipment sizes 0/1/1,000/10,000 with valid aggregates; at 10,000 require <=2.5 MiB decoded, warmed mapping <100 ms, rendering <50 ms, no app task >=50 ms, and <=80 snapshot descendants at both viewports/directions.

### QC-308 — real bridge and Navigate behavior (T-304 AC2, AC4)

Using the actual packaged SDK and supplied GuestBridge, prove Ready precedes authenticated work, both certificate links issue exactly one `Navigate` with `{Url:"#/Permits/Dashboard"}`, pending activation is single-flight, focus survives success/rejection/removal, and revocation/held old response causes zero navigation effects. Fresh re-entry rotates the session and rejects old responses. Establish packaged SDK byte identity, candidate identity, and `CURRENT_SNAPSHOT_LIVE_CALLS_ENABLED === true`.

## Release-footer checks

### QC-309 — static footer contract (T-304 AC6; T-305 AC1, AC6)

Assert every index has exactly one `footer[data-simplyvibe-release]` outside state-dependent main content, one semantic `dl`, all `data-release-label`/`data-release-value` hooks, and relative same-origin packaged CSS/module loads. Assert no footer network/auth path and no user, tenant, token, controller-internal, or refresh-time metadata.

### QC-310 — metadata truth table (T-305 AC2-AC4, AC6)

Run explicit synthetic attributes for unstamped; missing, empty, unsupported, and case/whitespace-altered environment; malformed SHA/date; valid preview; and valid production. Invalid/missing environments make all three values localized Unavailable. Preview accepts only a 12-lowercase-hex version, displays explicit Preview, valid source time, and Not released. Production displays version plus both frozen valid timestamps. Freeze the clock and prove page-open/current/data-refresh/event time is never substituted. Change `lang`/`dir` at runtime and verify relocalization.

### QC-311 — all-state footer resilience (T-305 AC1, AC5)

Transition through host-waiting, loading, no-context, empty, error, stale, and ready states and assert the same single footer remains visible, in document flow, and distinct from dashboard Last refresh. At 390x844 and 1440x900, RTL/LTR, keyboard navigation, 200% and 400% zoom: no duplication, obstruction, fixed overlay, clipping, or horizontal overflow; labels/values wrap readably and meet contrast/focus/accessibility expectations.

## Full browser, performance, and inventory gates

### QC-312 — analytical fixture budgets (T-302 AC5; T-304 AC3)

Exercise 0/1/1,000 rows per analytical report, including duplicates and malformed boundaries, capped at 4,000 rows and 4 MiB combined. Require warmed aggregate mapping <100 ms, post-response render <50 ms, no app task >=50 ms, and <=600 dashboard descendants. Record browser/version, candidate, viewport/direction, rows, bytes, request lifecycle totals, peak concurrency, timing samples, DOM count, long tasks, and third-party executable requests (zero).

### QC-313 — responsive, visual, accessibility, and failure matrix (T-301 AC4-AC5; T-304 AC2, AC6; T-305 AC5)

At both required viewports in RTL and LTR capture screenshots and computed geometry for every app state. Exercise mouse, touch-sized targets, Tab/Shift+Tab, Enter/Space, refresh/retry/apply/navigation, validation focus, rapid/double activation, slow/out-of-order replies, offline recovery, language changes, back/forward, and zoom. Check names/labels, live/error associations, focus visibility/order/restoration, contrast, mixed-language bidi, charts, CSP, assets, console errors, unhandled rejections, failed requests, and unintended scroll.

### QC-314 — complete inventory and suites (T-304 AC1, AC4-AC5)

Rediscover all `*.test.{js,mjs,cjs}` and `*.spec.{js,mjs,cjs}` immediately before execution. Run the configured site suite and complete explicit QC, UAT, and controller-harness inventories without a partial extension glob. Preserve exact commands, totals, skips, failures, runtime versions, candidate/SDK identity, and raw failure evidence. Any unexplained failure, missing role/review, critical high-confidence issue, false enabled flag, or incomplete required workflow blocks readiness.

### QC-315 — preview/release boundary (T-304 AC2, AC5-AC6; T-305 AC3-AC6)

In a later authorized preview review, verify delivered headers/assets, zero third-party executable requests, footer preview version equals reviewed head's first 12 characters, Preview/Not released truth, and every QC-301..QC-314 browser gate against the exact controller preview. Do not access the currently denied origin. Synthetic permissions do not prove tenant configuration; production publication time, tenant reconciliation, approval, and release remain controller-owned.

## Acceptance-criterion trace completeness

| Task | Covered criteria | Cases |
|---|---|---|
| T-301 | AC1-AC5 | QC-301, QC-302, QC-304, QC-313 |
| T-302 | AC1-AC5 | QC-303, QC-304, QC-312 |
| T-303 | AC1-AC6 | QC-305, QC-306, QC-307 |
| T-304 | AC1-AC6 | QC-307-QC-315 |
| T-305 | AC1-AC6 | QC-309-QC-311, QC-313, QC-315 |

