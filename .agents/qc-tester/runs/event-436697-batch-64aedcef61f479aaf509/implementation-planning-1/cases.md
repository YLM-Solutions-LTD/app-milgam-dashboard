# Milgam dashboard QC design — implementation planning 1, attempt 2

## Execution contract

- These are test designs only. No executable test was created or changed in this stage.
- Execute final-review checks only against the exact controller-supplied `/App/milgam-dashboard` preview. Record preview URL/identifier, site digest or commit, browser/version, operating system, device scale factor, viewport, zoom, locale, direction, and approved host-harness/test-tenant identity. Never record credentials, signed URLs, raw controller payloads, or response secrets.
- Host-dependent results are valid only in an approved SimplyLog host or controller-provided harness that can prove `event.source`, `event.origin`, API-origin confinement, host-service responses, and command counts. Standalone rendering is diagnostic only.
- Required visual matrix: `320×568`, `390×844`, `768×1024`, and `1440×900`; run Hebrew/RTL and English/LTR at each. Repeat ready, loading, first-error, stale, and navigation-error states at `390×844` and `1440×900`. Verify 200% browser zoom and mixed Hebrew/English/long-label content.
- For every failure, record case ID, task/acceptance criterion, exact fixture, timestamp, steps, expected/actual, sanitized request/console trace, direction/viewport, screenshot or accessibility-tree evidence, severity, confidence, and a stable fingerprint. A check is `BLOCKED`, never `PASS`, when the exact preview or authorized capability is missing.
- Current execution blockers: no exact controller-authorized preview identity/URL/site digest and no approved parent-host/date/navigation harness or test tenant were supplied for implementation planning. The current `site/` has Node contract tests but no installed browser automation/a11y runner. These conditions block execution, not the sufficiency of this QC plan.
- Attempt-2 source inspection confirms these checks must attach to, or preserve, the existing seams in `constants.js`, `api-client.js`, `host-context.js`, `dashboard-data.js`, `data-mappers.js`, `dashboard-machine.js`, `index.html`, `app.js`, and `app.css`. The checked source is pre-implementation context, not evidence that T-101–T-107 already pass.

## QC-001 — Exact snapshot transport, fan-out, and envelope identity

- Tasks/criteria: `T-101.AC1`, `T-101.AC2`, `T-103.AC5`.
- Fixtures: accepted HTTPS parent/API context with synthetic token; valid `EVT-READY`, `PER-READY`, and `EQP-1`; valid monthly analytics fixture.
- Procedure: accept host context, start initial load, then run one snapshot refresh. Capture each request before resolving any mock. Assert exactly one POST per current endpoint, bodies byte-equivalent to JSON `{}`, `Content-Type: application/json`, an authorization header only to the approved API origin, and a distinct `AbortSignal`. Assert no date, filter, location, identity, administrator, page, index, size, order, or sort property occurs. Assert calls begin within `50 ms`, current-generation peak in-flight count is `3`, and there is no fourth request, pagination, or automatic retry.
- Envelope check: return different envelope `TotalCount` and domain counts where valid (events envelope row count `3`, overall event total `142`; permits envelope row count `1`; equipment population total). Verify the caller retains `{Items, TotalCount}` distinctly and displayed domain values never use envelope row counts.
- Instrumentation/evidence: fetch spy records monotonic start/end time, generation ID, sanitized URL path/origin, method, parsed body keys, header names, signal identity/abort, status, mock decoded bytes, and in-flight counter. Save a request table and trace; redact header values.

## QC-002 — Typed failures, redaction, context denial, and monthly regression

- Tasks/criteria: `T-101.AC3`, `T-101.AC4`, `T-101.AC5`, `T-106.AC2`.
- Fixtures: `400`, `401`, `403`, `500`, absent-procedure body, rejected promise/network error, offline mode, abort, timeout, invalid JSON, missing/non-array `Items`, missing/nonnumeric/negative/fractional `TotalCount`, and incomplete envelope. Error strings deliberately include a canary token and signed-URL-like value. Trust fixtures include direct/top-level access, same-origin non-parent sender, unapproved HTTPS parent, production HTTP parent, HTTP API address, approved parent plus unapproved HTTPS API origin, malformed context, fallback, and timeout.
- Procedure: run each failure at first load and representative failures after last-good data. Assert typed error kind/status/dataset, no conversion to `[]` or `0`, and no canary in DOM, console, exception serialization, screenshots, or stored artifacts. For every rejected/unbound context, assert zero current and analytical authenticated fetches and zero privileged commands/date calls.
- Regression: change period and refresh monthly analytics; compare existing endpoint bodies to the pre-change contract including date-range and paging keys. Current-report support must not alter them.
- Instrumentation/evidence: fetch/command/date spies, console capture (`error`, `warn`, `unhandledrejection`), DOM text scan, serialized error scan, and monthly-body snapshots. Network/offline failures must be expected and correlated; any unrelated failed request or broken asset is a defect.

## QC-003 — Valid adapter semantics and truthful values

- Tasks/criteria: `T-102.AC1`, `T-102.AC3`, `T-102.AC4`.
- Fixtures: `EVT-READY`/`EVT-ZERO`; `PER-READY`/`PER-ZERO`; `EQP-0`, `EQP-1`, identical duplicate facts, inactive fact, never-treated fact, nullable treatment/configuration fields, and arbitrary `LastTreatmentStatus` values.
- Procedure: map fixtures and verify event overall/HQ/branches total/open pairs, three independent permit counts, and equipment unique total/facts. Assert inactive/null/never-treated items remain in the population. Search normalized output, DOM text, accessibility names, and tooltips for any combined `Missing + Overdue` “invalid” result or any equipment valid/overdue inference; none may exist. Equipment classification must be an explicit unavailable enum/state and canonical text while total remains visible.
- Evidence: sanitized normalized-output snapshots plus UI/accessibility-tree captures for validated zero and nonzero states.

## QC-004 — Strict adapter rejection, completeness, and linear mapping

- Tasks/criteria: `T-102.AC2`, `T-102.AC5`, `T-106.AC2`.
- Fixtures: events missing/duplicate/unsupported scope, bad count types, negative/fractional counts, `OpenCount>TotalCount`, absent `AsOf`, HQ/branch total/open reconciliation mismatches, envelope row mismatch; permits zero/two rows, bad counts, missing `AsOf`/`ValueDate`; equipment missing `EquipmentId`, identical and conflicting duplicates, population mismatch, nullable and duplicate-heavy `0/1/1,000/10,000` rows.
- Procedure: assert every invalid fixture produces `invalid-response` and never a partial UI commit. For equipment, perform one unrecorded warm-up, then at least five isolated recorded runs per size using the same runtime with DevTools closed and no network. Assert expected unique count, output is normalized only, duplicate-heavy behavior remains linear, and every `10,000`-row run is `≤100 ms`.
- Measurement: `performance.now()` immediately around mapper invocation; record runtime/version, input rows, duplicate ratio, unique count, output retained count, duration, and `TextEncoder().encode(JSON.stringify(envelope)).byteLength`. Retained-generation inspection must show current normalized output plus at most one `lastGoodData`, not obsolete raw envelopes.

## QC-005 — Independent snapshot and analytical lifecycles

- Tasks/criteria: `T-103.AC1`, `T-103.AC2`, `T-103.AC5`, `T-105.AC1`.
- Fixtures: ready snapshot plus two valid analytical periods; deferred snapshot/analytics promises; snapshot and analytics success/failure permutations.
- Procedure: prove analytics ready while snapshot loads/fails and snapshot ready while analytics changes. Record snapshot values, timestamp, status, node identity/count, and request counter; change year/month by keyboard and pointer while snapshot is ready and while it is loading. Assert no current request, no snapshot clear/timestamp change, no snapshot abort, and normal analytical transition. Snapshot-local retry must issue only three current requests; global refresh may start both lifecycles but IDs/status/abort controllers remain distinct.
- Visual expectation: snapshot section precedes period controls, explicitly says current values are unaffected by month, and monthly charts remain present through snapshot-local loading/error.
- Evidence: state timeline, request/abort table, before/after screenshots, focus log, and DOM snapshot.

## QC-006 — Supersession, atomic commit, stale retention, and refresh burst

- Tasks/criteria: `T-103.AC3`, `T-103.AC4`, `T-106.AC2`.
- Fixtures: generation A deferred, generation B valid and newer, late A success and late A failure; initial single-report failure; refresh single-report failure after last good; ten-refresh schedule with out-of-order completions.
- Procedure: resolve B before A and assert A signals abort and neither A success nor A failure changes B. A generation commits only after all three validated reports; partial new values never mix with old values. Initial failure shows no counts/zeros. Refresh failure retains the complete previous values and timestamp, adds stale treatment/retry, and retains one last-good generation. In ten rapid refreshes, only generation 10 commits, older work aborts/ignores, newest-generation peak is `≤3`, and there are no automatic retry timers or request storm.
- Evidence: deterministic fake-clock/state log with generation IDs, abort events, in-flight counts, commit count and winner, plus stale-state screenshot and normalized retained-object count.

## QC-007 — Host trust, late context recovery, and raw date delegation

- Tasks/criteria: `T-104.AC1`, `T-104.AC4`, `T-104.AC5`, `T-101.AC5`.
- Fixtures: approved parent window/origin/API tuple; raw dates with no offset, explicit offset, date-only, and boundary-looking values; source/origin mismatch response cases; the full negative trust matrix from `QC-002`.
- Procedure: first let host bootstrap time out, then deliver one valid late context without reload; assert fallback is replaced and authorized loading begins once. Run each negative source/origin/API case and assert zero privileged effects. With valid context, spy on every `ToDisplayDate` call and response: `AsOf`/`ValueDate` input must be byte-for-byte unchanged, with no appended `Z`, local parsing, or use as an analytical filter. Date and command responses from a different source/origin must be ignored/rejected.
- Evidence: message ledger containing only source aliases and origins (no payload secrets), zero-effect counters, raw/adapter date argument table, DOM formatted-date result, and no-reload recovery video/trace.

## QC-008 — Permit navigation semantics, keyboard operation, locking, and recovery

- Tasks/criteria: `T-104.AC2`, `T-104.AC3`, `T-105.AC3`, `T-106.AC2`.
- Fixtures: ready snapshot, deferred/rejected `ready()`, deferred/rejected `executeCommand`, and recovered host service.
- Procedure: activate valid/missing/overdue separately by pointer, `Tab+Enter`, and native-button `Tab+Space`. Each activation must call `ready()` then exactly `executeCommand("Navigate", {Url:"#/Permits/Dashboard"})`; no query/filter/count. Event/equipment metrics must not navigate. During a deferred chain, trigger 20 rapid clicks/Enter/Space events across all three controls; assert exactly one ready/navigation chain, all controls are lock-protected, the activated button keeps visible focus and indicates busy, and the lock clears on resolve and reject.
- Failure: snapshot and analytics remain; a sanitized polite message appears without internal details. A subsequent activation succeeds exactly once.
- Evidence: ordered command log and count, accessibility-tree names/roles/states, keyboard/pointer trace, focus screenshots, failure/recovery screenshot, console/unhandled rejection capture.

## QC-009 — State truthfulness: zero, loading, error, stale, and unavailable

- Tasks/criteria: `T-103.AC4`, `T-105.AC1`, `T-105.AC2`, `T-106.AC3`.
- Fixtures: validated zero, ready nonzero, loading, required-shape empty validation failure, initial `400/401/403/500`/network/offline/timeout/malformed error, stale refresh error, permit navigation error, unavailable host.
- Procedure: compare every state against the accepted state matrix. Only validated numeric counts may render `0`. Loading shows textual status and no placeholder zero; first error/unavailable host shows sanitized snapshot-local unavailable/retry with no numbers or privileged action; stale keeps all last-good values with icon+text and retry; equipment classification always says unavailable rather than showing plausible metrics; navigation error is local. Analytics must never be replaced.
- Accessibility/visual: one polite non-atomic snapshot status region, understandable retry name, no success toast, errors associated with retry/status, meaning not color-only, and no stale/new partial mix.
- Evidence: state-by-state DOM/accessibility snapshots, screenshots at phone/desktop RTL/LTR, text scan for forbidden fabricated/combined labels, and announcement log.

## QC-010 — Responsive layout, bidi, reflow, and touch sizing

- Tasks/criteria: `T-105.AC4`.
- Fixtures: ready zero/nonzero, all error states, locale-expanded labels at 200% length, 8-digit localized counts, long formatted dates, and mixed Hebrew/English/URL-shaped text.
- Procedure: at `320×568`, `390×844`, `768×1024`, and `1440×900` in RTL and LTR, capture top/middle/bottom screenshots and inspect bounding boxes. At phone widths, cards stack events→permits→equipment; at larger widths grid use remains coherent. DOM/focus order never reverses. Check `documentElement.scrollWidth <= clientWidth`, every required control is visible, target bounding boxes are at least `44×44 CSS px`, gutters are at least `16 px` where specified, text wraps without ellipsis hiding meaning, and no overlap/clipping/fixed-height truncation occurs. Repeat with 200% browser zoom and keyboard traversal.
- Bidi specifics: logical start/end spacing mirrors; numbers and mixed-language dates remain associated with correct labels; directional icons mirror only when semantically directional; events/permits/equipment meaning/order never reverses.
- Evidence: screenshot matrix, geometry JSON/table, scroll-width readings, computed direction/styles, and focus-order log.

## QC-011 — Accessibility semantics, focus, announcements, and contrast

- Tasks/criteria: `T-105.AC3`, `T-105.AC4`, `T-106.AC3`.
- Procedure: traverse from skip link through snapshot and analytical controls without pointer. Verify one descriptive snapshot section heading; events/equipment are descriptions rather than fake buttons; three permit controls are native and uniquely named with destination; retry and refresh labels are unambiguous; status is polite/non-atomic; disabled/busy states remain perceivable and recoverable; focus never disappears after rerender or failed navigation. There are no dialogs in scope; if implementation adds one, it must trap/restore focus, close by keyboard, and scroll internally.
- Contrast/visibility: compute foreground/background pairs from rendered styles. Require `4.5:1` normal text, `3:1` large text and non-text UI/focus boundaries. Require a `3 px` visible focus indicator with offset on white, cards, warnings, and buttons. Check icons have text alternatives or are decorative and color is never the sole status signal.
- Assistive checks: inspect browser accessibility tree and run the approved automated accessibility scanner if available; manually verify reading/announcement order in RTL and LTR. Record scanner/version and treat zero automated violations as supporting, not complete, evidence.
- Evidence: accessibility-tree captures, scanner result, contrast table, focus screenshots, tab sequence, and announcement transcript.

## QC-012 — Visual hierarchy and existing-dashboard regression

- Tasks/criteria: `T-105.AC1`, `T-105.AC5`, `T-106.AC3`.
- Procedure: compare the exact preview against the accepted design specification/reference as structural guidance, not pixel truth. Snapshot must be a bounded region above analytical controls, with events visually prominent, balanced permits/equipment cards, clear current-vs-monthly explanatory copy, Arial/sans-serif, coherent 8 px rhythm, 16–24 px padding, 8–12 px radii, neutral borders, and no intrusive success toast. Validate all existing year/month selectors, refresh, charts, legends, tables, skip link, empty/error handling, and chart focusability/labels.
- Regression interactions: select periods repeatedly, refresh, reload, and exercise browser back/forward where the host allows; verify valid state recovery, no duplicate submission, no broken assets/missing icons, and no console exception/unhandled rejection. Existing chart meaning, date bodies, and permissions remain unchanged.
- Evidence: before/reference/preview comparison notes, full-page screenshot matrix, interaction recording, request diff, console/network log, and list of intentional vs accidental visual differences.

## QC-013 — DOM, render, and memory budgets

- Tasks/criteria: `T-102.AC5`, `T-105.AC6`, `T-106.AC4`.
- Fixtures: normalized ready snapshots originating from `1` and `10,000` equipment facts, with identical visible aggregate; duplicate-heavy and nullable variants.
- Procedure: after one warm-up, run at least five isolated ready renders each at `390×844` and `1440×900` in the recorded primary browser/runtime. Mark immediately before state delivery/render, force one layout read after update, and close at the next animation frame; correlate with a DevTools/browser performance trace for scripting, style, layout, and paint. Require every recorded render `≤50 ms` under the documented local harness. Count the snapshot root plus all descendants as `1 + querySelectorAll('*').length`; require `≤80`. Count equipment-subtree nodes for 1 vs 10,000; require equality and zero fact/list nodes added. Inspect retained state after refresh for one current normalized generation plus at most one last-good generation.
- Additional numeric record: browser/version, OS/runtime, viewport/DPR, fixture rows/unique rows/decoded bytes, each mapper/render duration, DOM counts, request start spread/peak concurrency, winning refresh generation, and navigation chain count.
- Evidence: raw measurement table and sanitized trace export. Live network latency is excluded from local render/mapper budgets and must not be presented as a budget result.

## QC-014 — Deterministic suite completeness and secret-free evidence

- Tasks/criteria: `T-106.AC1`, `T-106.AC4`, plus regression support for all `T-101`–`T-105` criteria.
- Procedure at implementation/final review: run targeted transport, adapters, state machine, host, UI/a11y, performance, and existing monthly tests, then the full local suite. Record exact commands, runtime versions, pass/fail/skip counts, duration, and failing test names. Run offline with synthetic fixtures and verify no live SimplyLog dependency. Mutation checks must demonstrate tests fail when adding a current body filter/date, navigation query, stale overwrite, fabricated zero, or inferred equipment classification; these may be controlled test doubles, not source mutations in QC review.
- Artifact scan: inspect fixtures, logs, screenshots metadata, and errors for token canaries, authorization values, signed URLs, raw event text, and private controller prose. No secrets may be present.
- Evidence: command/results manifest, numeric budget table, and redaction scan summary. Any unavailable browser/live check is explicitly `SKIPPED` or `BLOCKED` with reason.

## QC-015 — Flag-safe, honest delivery boundary

- Tasks/criteria: `T-107.AC1`, `T-107.AC2`, `T-107.AC3`.
- Procedure: inspect final local configuration and loaded runtime to verify `CURRENT_SNAPSHOT_LIVE_CALLS_ENABLED` defaults false and gates only current snapshot calls, not monthly analytics. Review verification records to separate deterministic local, exact-preview mocked/hosted, and authenticated live results. Any unavailable live procedure/host check must say skipped and cannot be inferred from documentation. Confirm no app artifact or evidence claims/contains Git, deployment, provider, lifecycle, SQL, `SearchAllEvents`, issue-tracker, or backend work.
- Evidence: configuration excerpt/digest, local-vs-live verification table, prohibited-artifact scan, and explicit controller-owned temporary flag note. QC never toggles or deploys the flag.

## Final-review stop conditions

- Stop and report `BLOCKED` if the preview identity cannot be tied to the controller-supplied target, the host harness is not explicitly approved, credentials would need to be persisted, or browser instrumentation would require mutating the preview/app.
- Report a defect rather than compensating in the harness if any requirement depends on browser recomputation of report semantics, arbitrary API origins, production HTTP trust, partial data, hidden retries, or unsupported equipment validity rules.
- Do not claim final preview quality from Node tests, screenshots, or page load alone. All interactive, failure, race, responsive, bidi, a11y, and numeric checks above must be executed or explicitly marked blocked/skipped.
