# QC cases — revision 13 remediation

## Preserved range and isolation contracts

### QC-321 — inclusive range validation and accessible controls (T-301, T-304)

Table-drive real/leap/impossible/boundary/reversed, one-day, cross-month/year, discovery-external, and empty-discovery ranges. Assert exact timezone-less `T00:00:00` / `T23:59:59.997`, no `Z`, invalid-input announcement/`aria-invalid`/focus, and zero invalid effects. At 390x844 and 1440x900 RTL/LTR verify 44px targets, logical order, visible focus, and no overflow. Ten draft edits issue zero requests; Apply alone changes the analytical range.

### QC-322 — analytical generation, refresh, and snapshot isolation (T-301, T-302, T-304)

One accepted Apply/refresh starts exactly four concurrent analytical calls with byte-equivalent bounds and zero snapshot calls. Ten rapid Applies initiate 40 analytical requests, peak concurrency at most four, abort or ignore the first 36, and commit only the newest generation. Ready/empty refresh and fresh verified re-entry retain the applied range. Snapshot calls/facts/timestamp remain unchanged.

## Cycle-2 fingerprint gates

### QC-323 — before/after unbounded analytical DOM reproduction (T-302, T-304)

Before change, use valid 1,000-row division/category/closure fixtures and preserve the accepted reproduction: eager per-row render from `app.js` yields 13,066 dashboard descendants and app tasks of 115–152 ms. After change, at 1440x900 RTL and 390x844 LTR require complete aggregate totals, no more than 600 descendants, warmed mapping under 100 ms, post-response render under 50 ms, and zero app-attributable tasks at or above 50 ms. Record browser/version, candidate identity, row counts, decoded bytes (<=4 MiB combined), timings, long tasks, and DOM count. Closes `perf-preview-analytical-1000-row-unbounded-dom-long-tasks-v1` only on fresh passing evidence.

### QC-324 — accessible bounded analytical detail (T-302, T-304)

For 0, 1, and 1,000 rows per report, traverse every division/category/closure page or window by keyboard. Reconcile every stable source ID exactly once with no silent truncation; full-data totals stay constant. Previous/next disabled states, localized visible-range/total text, semantic headings/tables, polite range announcement, predictable focus, window reset/clamp after data change, and RTL/LTR order must pass. Page changes issue zero API calls, do not remap the full payload, and keep render/DOM/long-task budgets from QC-323.

### QC-325 — before/after terminal 401/403 UI reproduction (T-303, T-304)

Before change, load last-good snapshot data, return terminal 401, and preserve evidence that `#snapshot-refresh` remains enabled, `[data-snapshot-retry]` is rendered, and ordinary retry guidance appears. After change, repeat separately for safe `authorization-revoked`, HTTP 401, and HTTP 403: stale facts/timestamp remain, toolbar refresh is disabled, retry is absent or disabled, concise Hebrew re-entry guidance replaces ordinary try-again copy, and ten activation attempts initiate zero API calls. Do not derive terminality from body text. Closes `uat-snapshot-terminal-401-retry-enabled-v1` only after fresh behavioral evidence.

### QC-326 — terminal generation persistence and fresh re-entry (T-303, T-304)

Hold an old-generation request in the actual SDK/GuestBridge fixture, revoke or return 401/403, then release it. Assert no old data/command effect, no enabled retry, and no requests from refresh/retry bursts. Same-generation verification cannot clear denial. A distinct verified re-entry alone enables and automatically starts exactly three concurrent snapshot calls, peak three, one commit, and no unhandled rejection; stale facts remain until that commit.

### QC-327 — before/after 320px RTL footer containment (T-305, T-304)

Before change, reproduce the accepted 320x844 Hebrew RTL clipped footer and record footer/field rectangles, `innerWidth`, and `scrollWidth`. After the app-owned layout fix, require the unchanged packaged CSS/JS bytes, footer and every field bounding box within `[0, innerWidth]`, readable wrapping, no obstruction, and recoverable text without relying on `overflow-x:hidden` or horizontal scrolling. Repeat at 390x844 and 1440x900 in RTL/LTR, 200%/400% zoom, and keyboard traversal. Closes `qc-footer-320-rtl-edge-clipping-v1` only on fresh passing geometry evidence.

## Snapshot, footer, host, and full-matrix non-regression

### QC-328 — snapshot normalization, recovery, and performance (T-303, T-304)

HTTP-200 numeric envelopes plus permitted trimmed decimal-string aggregates render correct numeric facts. Reject missing, empty, signed, fractional, exponent, negative, unsafe, unreconciled, very long digit strings, and `9007199254740992` without partial output or nonlinear work. Recoverable 400/404/500/invalid/network cases retain bounded report-specific diagnostics and enabled retry; secrets/body markers never reach DOM, console, or serialized errors. Snapshot bursts coalesce to three requests/one commit. At 10,000 equipment rows require <=2.5 MiB, mapping <100 ms, render <50 ms, no >=50 ms app task, and <=80 snapshot descendants.

### QC-329 — all-state truthful footer metadata matrix (T-305, T-304)

Keep exactly one footer outside `<main>` through host-waiting, loading, no-context, empty, recoverable error, terminal stale error, and ready. Synthetic missing/empty/unsupported/malformed metadata renders all values Unavailable; valid preview shows validated 12-hex version + Preview, valid source time, and Not released; production alone shows both valid frozen timestamps. Freeze the clock and prove no viewer-current/data-refresh/event-time substitution. Runtime language changes relocalize labels/values with `bdi`. Footer performs zero fetch/auth/host-command operations and contains no tenant/user/token/controller data.

### QC-330 — actual SDK lifecycle and Navigate (T-304)

Establish packaged SDK byte identity and use real Ready/executeCommand through the intercepted GuestBridge. Before readiness there is no authenticated effect. Both permit links issue exactly `Navigate {Url:\"#/Permits/Dashboard\"}` once per settled activation; pending activation is single-flight, focus survives success/rejection/removal, held old responses have zero effects after rotation, and fresh generation recovers. `CURRENT_SNAPSHOT_LIVE_CALLS_ENABLED` remains exactly `true`.

### QC-331 — responsive, visual, accessibility, and robustness matrix (T-301–T-305)

At 320x844 RTL (footer), 390x844 and 1440x900 RTL/LTR, exercise mouse/touch, Tab/Shift+Tab, Enter/Space, Apply/refresh/retry/paging/navigation, double/rapid activation, slow/out-of-order replies, offline/recovery, back/forward, and zoom. Check accessible names, labels/error association, focus visibility/order/restoration, contrast, touch size, mixed-language bidi, chart/table semantics, CSP, assets, failed requests, console errors, and unhandled rejections. Capture screenshots and computed geometry for every state.

### QC-332 — complete inventory and exact suite commands (T-304)

Immediately before execution discover all six required extension patterns. Run exactly `(cd site && npm test)`, `node --test tests/qc/*.test.js tests/qc/*.test.mjs`, `node --test tests/uat/*.test.mjs`, and `node --test /workspace/.simplyvibe/input/controller-host-harness/host-fixture.test.mjs`. Record full inventory, Node/browser versions, totals, skips, failures, candidate/SDK identity, and raw failures. Any unexplained failure, omitted extension, critical high-confidence issue, or missing required workflow blocks readiness.

### QC-333 — release/evidence boundary (T-304, T-305)

For later authorized preview review, require exact candidate static-asset identity, delivered headers/CSP, zero third-party executable requests, and preview footer version equal to the reviewed head's first 12 characters. Do not use the denied origin in this stage. Synthetic permissions do not prove tenant authorization; prior approvals, attachments, fixture decisions, and local timestamps do not authorize production.

## Traceability

| Task | Revision-13 criteria covered | Cases |
|---|---|---|
| T-301 | all acceptance criteria | QC-321, QC-322, QC-331 |
| T-302 | all acceptance criteria | QC-322–QC-324, QC-331 |
| T-303 | all acceptance criteria | QC-325, QC-326, QC-328 |
| T-304 | all acceptance criteria | QC-321–QC-333 |
| T-305 | all acceptance criteria | QC-327, QC-329, QC-331, QC-333 |

