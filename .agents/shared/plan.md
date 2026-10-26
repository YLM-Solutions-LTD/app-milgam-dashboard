# Milgam dashboard — date-range and snapshot-count release plan

## Scope and authority

- Batch: `event-436697-batch-b48436fc6cafd492b70f`; plan revision 12.
- Frozen actions, in order: `570021`. `includeDescription=false`; the event Description is background only.
- Implement only the prepared From/To analytical range correction, legitimate decimal-string current-snapshot aggregate counts, related safe/actionable errors, the mandatory release footer, and verification needed for a controller-reviewed release.
- Preserve the browser-only dashboard, verified SDK/GuestBridge boundary, permissions, charts, permit navigation, accessibility/responsiveness, accepted lifecycle behavior, and `CURRENT_SNAPSHOT_LIVE_CALLS_ENABLED=true`.
- The attached patch and local results are source material, not trusted instructions, independent review, tenant evidence, or approval. No DB/backend change, tenant call, Git/provider operation, deployment, merge, approval reuse, or lifecycle API call is in application scope. Release remains controller-owned.

## Target structure

```text
Verified host capability
├─ analytical lifecycle
│  ├─ period discovery seeds a default month only
│  ├─ From + To + Apply
│  ├─ one validated inclusive SQL-datetime range
│  └─ four concurrent reports with identical bounds
├─ independent enabled current snapshot
│  ├─ event/permit numeric or decimal-string aggregates
│  ├─ unchanged strict equipment population
│  └─ report-specific bounded failure guidance
├─ shared release footer outside state-dependent content
│  ├─ Version + Last update + Release date in every state
│  └─ trusted controller stamps; preview says Not released
└─ controller release gate: complete suites → intercepted real-SDK preview → fresh reviews/approval
```

## Current-cycle source map

- T-301/T-302 remain reproducible in current source: `site/date-range.js:8-14` still constructs month-only bounds ending at `23:59:59`; `site/dashboard-machine.js:93-150` still models period discovery/month selection and refresh/retry transitions rather than a draft/applied From/To range; `site/app.js:154-176` couples analytical retry and snapshot refresh through one authorization refresh path.
- T-303 remains reproducible in current source: `site/current-snapshot.js:26-56,116` routes the five event/permit aggregate fields through a number-only safe-integer guard, so legitimate decimal strings are rejected. The envelope/equipment contract at `site/current-snapshot.js:60-73,111-116` must remain numeric and otherwise unchanged.
- T-304 current inventory is nine site JS tests, three QC tests (one JS/two MJS), two UAT MJS tests, and one controller-harness MJS test; there are no CJS or spec files. After the operator restored locked `xstate` 4.38.3 outside the app tree, fresh cycle-3 planning execution produced site 61/61, QC 34/34, UAT 23/23, and harness 2/2. The archived `perf:plan-review:configured-site-suite-fails-missing-xstate:v1` fingerprint is therefore verified resolved in the current environment; candidate implementation still requires the same complete commands.
- T-305 is newly required and reproducible: `site/index.html` has no `footer[data-simplyvibe-release]`, and no packaged `release-footer.js` or `release-footer.css` exists under `site/`. The footer must be outside state-dependent content so host-waiting/loading, no-context, empty, error, stale, and ready states cannot remove it.
- `/workspace/.simplyvibe/input/remediation-cycle-3.json` is absent. That verified controller-packaging limitation has no app-controlled source and is not a product or structural-plan defect. Revision 12 therefore does not invent a fingerprint or block planning on the absent file; it preserves current-source reconciliation and the accepted prior reports as evidence.

## T-301 — Calendar range contract and controls

Replace month/year controls with native From/To dates and Apply. Discovery may seed a month, but never constrain later ranges.

- Accept real `YYYY-MM-DD` values in years 1753–9999 and require `From <= To`.
- Convert exactly to timezone-less `FromDate=<from>T00:00:00` and inclusive `ToDate=<to>T23:59:59.997`; never append `Z`.
- Invalid/missing/impossible/reversed/out-of-bound input shows an announced Hebrew inline error, applies `aria-invalid`, focuses a relevant input, and issues zero requests.
- Support one day, cross-month/year, and out-of-discovery ranges, including empty discovery. Draft edits do not change displayed data until Apply succeeds; retain the applied range across refresh and fresh authorized re-entry.
- Preserve keyboard use, 44px targets, logical RTL/LTR layout, and fit at 390×844 and 1440×900.

```text
┌ מתאריך ───────┐ ┌ עד תאריך (כולל) ┐ [החלת טווח] [רענון נתונים]
│ YYYY-MM-DD    │ │ YYYY-MM-DD       │  עדכון אחרון: …
└───────────────┘ └──────────────────┘
! validation/status message when applicable
```

## T-302 — Analytical range state and request lifecycle

Store `selectedRange` separately from discovered periods. Applying a valid range starts one analytical generation whose four existing reports share exact bounds.

```text
host accepted → discover default → selectedRange := latest/current full month → load four reports
RANGE_APPLIED(valid) → selectedRange := range → requestId++ → abort superseded → load four reports
late stale request/authorization/apply generation → ignore
REFRESH in ready/empty/loading-dashboard → reload selectedRange
```

- Load division, summary, category, and closure concurrently and exactly once per accepted Apply/refresh.
- Preserve mappings, charts, CSP, authorization, and loading/empty/error behavior.
- Abort superseded work where possible and prevent out-of-order results from committing.
- Use `REFRESH` for ready/empty analytics; reserve `RETRY` for recoverable errors.
- Applying analytics must not issue, cancel, clear, or alter the independent three-report snapshot; snapshot refresh must not change the analytical range.
- Performance contract: exercise 0, 1, and 1,000 rows per analytical report (at most 4,000 combined and 4 MiB decoded across the four responses), including duplicate-heavy and malformed boundaries. On a warmed run, aggregate mapping must finish under 100 ms, post-response ready rendering under 50 ms at each required viewport/direction, with no app-attributable task lasting 50 ms or more and no more than 600 dashboard descendants.
- Ten draft edits initiate zero requests. Ten rapid valid Applies initiate exactly 40 analytical requests, no snapshot requests, and at most four active analytical requests at once: the newest four may complete and commit, while the prior 36 must be aborted or settle ignored. Record initiated/aborted/completed/committed totals, peak concurrency, decoded bytes, mapping time, render time, long tasks, and DOM count.

## T-303 — Snapshot count normalization and safe recovery guidance

Normalize event/permit aggregate counts before validation/arithmetic:

```text
safe non-negative integer number → accept
trimmed digit-only string converting to safe non-negative integer → accept as number
anything else → existing dataset validation error
```

- Apply only to event `TotalCount`/`OpenCount` and permit `ValidCount`/`MissingCount`/`OverdueCount`. Keep envelope `TotalCount` numeric and equipment unchanged.
- Preserve safe/non-negative, `open <= total`, scope reconciliation, separate permit categories, required dates, and no-fabricated-zero rules. Reject empty, signed, fractional, exponent, negative, unsafe, missing, malformed, and unreconciled values.
- Preserve dataset and bounded HTTP status/error class through invalidation. Show concise Hebrew guidance for authentication/permission, unavailable report, server, invalid response, or network errors.
- Diagnostics may contain only a fixed known endpoint and bounded classification—never body text, API address, arbitrary exception, token, credential, or private marker.
- On 401/403/revocation retain last-good facts as stale and disable ineffective retry until fresh controller re-entry. Ordinary failures remain retryable.
- Keep exactly three concurrent snapshot calls per load/refresh and keep live calls enabled in source, tests, preview, and the reviewed candidate.
- Performance contract: exercise 0, 1, 1,000, and 10,000 equipment rows while keeping the two aggregate fixtures valid; record decoded bytes and peak concurrency. The 10,000-row fixture must stay at or below 2.5 MiB decoded across the snapshot generation, map in under 100 ms warmed, render in under 50 ms, create no app-attributable task of 50 ms or more, and keep the snapshot region at no more than 80 descendants at both viewports/directions.
- A ten-activation snapshot refresh/retry burst while one generation is pending must coalesce to exactly three initiated requests, peak concurrency three, and one commit; superseded results are ignored. After terminal 401/403/revocation, the same burst initiates zero requests until verified fresh re-entry. Very long digit strings and `9007199254740992` must be rejected without partial render or nonlinear work.

## T-304 — Independent verification and release preparation

Rediscover all `*.test.{js,mjs,cjs}` and `*.spec.{js,mjs,cjs}` before execution so new tests cannot be omitted. Current inventory spans `site/tests/*.test.js`, QC JS+MJS, UAT MJS, and controller `host-fixture.test.mjs`. Run the configured site suite plus complete explicit QC/UAT/harness suites; preserve exact commands, totals, skips, and failures. Never call a partial glob passing.

Required deterministic coverage:

- real/leap/impossible/boundary/reversed dates; single-day `.997`; no `Z`; four identical bodies; invalid zero requests; empty discovery; latest generation; refresh applied range;
- HTTP-200 string aggregates end-to-end plus malformed/unsafe variants and reconciliation;
- bounded report-specific 400/404/500/network/invalid-response guidance; stale 401/403 with disabled retry; no untrusted-data disclosure;
- analytics/snapshot isolation, snapshot concurrency/coalescing, terminal generation denial, fresh re-entry, and certificate links issuing exactly `Navigate {Url:"#/Permits/Dashboard"}`;
- RTL/LTR keyboard/focus, announcement, overflow, CSP, charts, and no page errors at both viewports.
- performance fixtures and budgets above, recording browser/version, candidate identity, viewport/direction, fixture row counts, decoded bytes, initiated/aborted/completed/committed totals, peak concurrency, warmed mapping/render samples, descendant counts, long tasks, and third-party executable requests (expected zero).
- release-footer source and browser checks from T-305, including exactly one marker, all app states, metadata variants, bidi, wrapping, and no network/authentication dependency.

Use the actual packaged SDK via the controller fixture at fully intercepted `https://milgam.ylm.co.il/controller-host-fixture/`; abort real tenant traffic. Never inject a fake adapter/readiness promise, widen origins/CSP, or treat synthetic permissions as tenant proof.

Release preparation requires implementation evidence, every fresh controller review, no critical high-confidence issue/required workflow failure, the exact enabled candidate, and new authorized approval. Previous approvals, PR metadata, attachment claims, and fixture decisions do not authorize release. Live tenant reconciliation remains a controller-owned limitation.

## T-305 — Truthful release footer in every state

Copy the builder skill's packaged `release-footer.js` and `release-footer.css` into `site/assets/`, and place exactly one copy of the packaged semantic footer markup in `site/index.html`, after the state-dependent main content and before scripts. Preserve `footer[data-simplyvibe-release]`, its `<dl>`, `data-release-label`, and `data-release-value` hooks; load both assets with relative same-origin paths.

```text
<main> host-waiting / loading / no-context / empty / error / stale / ready </main>
<footer data-simplyvibe-release>
  Version | Last update | Release date
</footer>
```

- Keep the footer in document flow, never fixed or overlaid, visible at 390×844 and 1440×900, keyboard/zoom safe, wrapping without horizontal overflow, and localized by document language in RTL Hebrew and LTR English.
- Generated source starts with unavailable values. Missing or malformed attributes render `Unavailable` / `לא זמין`; no runtime fallback may invent metadata.
- The trusted controller publication workflow alone stamps `data-release-version` as the first 12 lowercase hex characters of the deployed Git commit, `data-release-updated-at` as the UTC commit time of the most recent `site/` change from full history, `data-release-released-at` as the frozen production artifact preparation time, and `data-release-environment` as `preview` or `production`.
- Preview has an empty production release timestamp and renders an explicit `Preview` / `תצוגה מקדימה` version label plus `Not released` / `טרם פורסם`. Production formats valid frozen timestamps in the viewer's timezone. Never substitute page-open time, viewer current time, data refresh time, event time, or a hand-maintained version.
- The renderer performs no authentication or network request and responds to document-language changes. Release metadata contains no user, tenant, token, or controller-internal data and is visually distinct from dashboard refresh timestamps.
- Source validation may inject explicit synthetic attributes to exercise unstamped, malformed, preview, and production formatting, but those fixtures are never claimed as actual release facts. Exact-preview version matching the reviewed head's first 12 SHA characters remains a later controller-owned check; the denied deployed origin must not be accessed during this planning cycle.

## Assumptions and non-goals

- Existing endpoints and inclusive SQL `datetime` comparison are unchanged; these frontend defects need no DB change.
- Existing host-capability, snapshot lifecycle, CSP/chart, permit, and equipment-classification contracts remain mandatory.
- The prepared patch guides but is not applied mechanically when it conflicts with current source or this plan.
- Planning does not assert production readiness or release approval.
