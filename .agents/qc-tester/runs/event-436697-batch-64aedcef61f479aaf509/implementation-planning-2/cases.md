# QC cases — implementation planning cycle 2

## Execution contract

- Scope is planning only. No case was executed and no executable test was authored in this stage.
- Automated cases use synthetic fixtures, no live tenant, network, token, signed URL, controller prose, or production host. Preview-only cases run later against the exact controller-supplied preview and approved host/harness.
- Final-preview records must include preview identity, site digest/commit, browser/version, viewport, DPR, locale/direction, harness identity, console/network capture, steps, expected/actual, and evidence path.
- Run automated contract/state tests first, then exact-preview interaction, accessibility, responsive, bidi, and visual checks. A skipped or unavailable required workflow is `BLOCKED`, never `PASS`.
- Stable remediation gates: `QC-HOST-BOUNDARY-001` and `QC-EQUIPMENT-DEDUPE-001` must both pass before approval.

## QC-201 — exact transport and analytical regression

- Tasks: `T-101`, `T-106`; automation.
- Drive one accepted host runtime and one snapshot load. Assert exactly three concurrent `POST`s, exact documented paths, body byte-equivalent to `{}`, JSON content type, the bound token header, and an `AbortSignal`; start spread `<=50 ms`, current-generation peak `<=3`, no pagination/retry.
- Assert no dates, filters, location, username, administrator identity, or paging fields. Verify `Items` and integer `TotalCount` remain distinct and mapper-specific cardinality is not enforced by transport.
- Inject abort, network/offline, invalid JSON, 400/401/403/500/missing procedure, missing/non-array `Items`, and invalid totals. Expect typed sanitized failure, no fabricated empty/zero, token, payload, stack, or URL leakage.
- Run monthly transport regressions and compare date-range bodies/endpoints before/after; period changes must emit zero current-report requests.

## QC-202 — non-forgeable host boundary and late recovery

- Tasks: `T-101`, `T-103`, `T-104`, `T-106`; automation plus approved-host preview.
- Negative matrix: same-origin non-parent source, production HTTP parent, HTTP API address, unapproved HTTPS API address, direct/top-level, timeout, fallback, malformed/rejected context, mismatched date/command response source or origin, caller object containing approved `__trustedHostOrigin`, caller object also containing `__hostContextBound:true`, and mutation of token/API/origin after creation.
- For every negative case assert zero analytical/snapshot bearer fetches, zero date/command calls, no credential persistence/log/rendering, and unavailable UI. A context is accepted only through the parent/source/origin factory and private brand; accepted fields remain immutable.
- Let bootstrap time out, then deliver a valid late parent context without reload. Assert fallback is replaced, authorized load begins once, and stale/session recovery uses only the new context.
- Regression fingerprint: reproduce the former forged-object fixture from `QC-HOST-BOUNDARY-001`; acceptance requires rejection before client construction or privileged effects.

## QC-203 — event and permit adapter truthfulness

- Tasks: `T-102`, `T-105`, `T-106`; automation.
- Events: accept exactly unique `overall`, `headquarters`, `branches`; validate non-negative integers, open `<=` total, dates present, raw envelope row count 3, and both HQ+branches reconciliations. Reject missing/duplicate/unknown scope, bad types, bad counts, missing dates, or mismatch atomically.
- Permits: accept exactly one row/envelope total 1 with independent valid/missing/overdue and `AsOf`/`ValueDate`; accept validated zeros. Reject multiple/empty/malformed rows. Scan mapped/visible/accessible text to ensure missing plus overdue is never named or computed as “invalid certificates.”
- Assert no invalid fixture partially commits and outer event row count is never displayed as an event total.

## QC-204 — equipment deduplication, nullability, and volume

- Tasks: `T-101`, `T-102`, `T-106`; automation.
- Accept inactive, never-treated, null date/configuration, arbitrary last-event status, and documented fact fields. Preserve normalized facts but expose only unique total plus classification unavailable.
- Required remediation fixture: two identical rows for one `EquipmentId` with envelope `TotalCount:1` succeeds and returns one fact. Reject conflicting duplicate facts and unique-population mismatch. Raw `Items.length` must not be compared to the equipment population before dedupe.
- Measure 0, 1, 1,000, and 10,000 inputs plus nullable and duplicate-heavy variants. Warm once; record at least five isolated runs, runtime/version, decoded bytes, duration, input/unique/retained counts. Every 10,000-row run must be `<=100 ms`; complexity remains linear and obsolete raw generations are not retained.
- Regression fingerprint: former `QC-EQUIPMENT-DEDUPE-001` fixtures must pass transport and mapper tests.

## QC-205 — independent lifecycle, atomicity, and races

- Tasks: `T-103`, `T-106`; automation plus preview interaction.
- Prove analytics-ready/snapshot-loading-or-error and snapshot-ready/analytics-changing combinations. Change month/year during snapshot ready and loading; values, timestamp, status, node cardinality, and current-request count remain unchanged.
- Reverse-resolve generation A and B. Superseded A aborts or is ignored; neither late success nor late failure mutates B. Commit only after all three reports validate; never mix partial new and old values.
- Initial failure displays no counts. Failed refresh preserves one coherent last-good snapshot/timestamp and marks stale. Snapshot retry issues only three current calls and does not reload analytics; global refresh keeps separate request IDs/controllers.
- Ten-refresh burst: only generation 10 commits, superseded work aborts/ignores, newest-generation peak `<=3`, one last-good generation maximum, zero automatic retry timers/storm.

## QC-206 — raw dates and exact permit navigation

- Tasks: `T-104`, `T-105`, `T-106`; automation plus approved-host preview.
- Spy on raw date-only, no-offset, explicit-offset, and boundary-looking `AsOf`/`ValueDate`. Each reaches `ToDisplayDate` byte-for-byte unchanged; no `Z`, local parsing, or analytical-filter use.
- Activate valid, missing, overdue separately by click, Enter, and Space. Each accepted action orders `ready()` then exactly `executeCommand("Navigate", {Url:"#/Permits/Dashboard"})`; no filter/query/count. Event/equipment metrics never navigate.
- Delay the chain and send 20 mixed activations. Expect exactly one chain, all permit controls busy-locked, visible focus retained, and unlock on resolve/reject. On either rejection, snapshot/analytics persist, a sanitized polite error appears, and the next activation can succeed once.

## QC-207 — truthful state and failure matrix

- Tasks: `T-103`, `T-105`, `T-106`; automation and manual visual/a11y.
- Cover validated zero/nonzero, loading, required-shape empty, first 400/401/403/500/network/offline/timeout/malformed failure, failed refresh/stale, navigation error, and unavailable host.
- Only validated counts render `0`. Loading/error/unavailable render no numeric placeholders. Stale retains the complete last-good values with icon plus text and retry; equipment classification remains textual unavailable. Errors are sanitized and local; analytics stays usable.
- Verify one polite non-atomic status region, associated/unambiguous retry, no intrusive success toast, no color-only meaning, and no partial stale/new mix.

## QC-208 — semantic keyboard accessibility

- Tasks: `T-105`, `T-106`; automated accessibility scan plus manual keyboard/tree inspection.
- Verify one named snapshot region/heading, events/equipment as noninteractive descriptions, three native permit controls with distinct names and destination meaning, and coherent events→permits→equipment DOM/reading/focus order in RTL and LTR.
- Traverse skip link, snapshot actions, period controls, and charts without pointer. Focus survives rerenders and failed navigation; all interactive targets are at least `44x44 CSS px`; focus indicator is visible (`>=3 px`) on every surface.
- Compute contrast: `>=4.5:1` normal text, `>=3:1` large text and non-text UI/focus. Inspect icon alternatives/decorative state and announcements. Record scanner/version and manual results; zero scanner violations alone is insufficient.
- No dialog is planned. If one appears, test trap, Escape/close, internal scrolling, and focus restoration.

## QC-209 — responsive, zoom, bidi, and long content

- Tasks: `T-105`, `T-106`; exact-preview manual plus geometry automation.
- Test loading, ready zero/nonzero, initial error, stale, and navigation error at `320x568`, `390x844`, `768x1024`, and `1440x900`, in RTL and LTR, plus 200% zoom.
- Use eight-digit localized numbers, 200%-length labels, long host-formatted dates, and mixed Hebrew/English text. Assert no overlap, clipping, hidden controls, fixed-height truncation, or unintended horizontal scroll (`scrollWidth <= clientWidth`). Text wraps without losing meaning.
- Phone panels stack events→permits→equipment; larger layouts remain balanced. Logical spacing mirrors while semantic order and focus order do not reverse; directional icons mirror only when semantically directional.

## QC-210 — bounded render and visual hierarchy

- Tasks: `T-105`, `T-106`; browser automation plus visual review.
- Snapshot precedes analytical controls, clearly distinguishes current from monthly data, preserves charts, and follows the accepted design guidance: coherent Hebrew-first hierarchy, neutral boundaries, 8 px rhythm, 16–24 px padding, 8–12 px radii, sans-serif, visible primary focus.
- Count snapshot root plus descendants: `<=80` elements. Equipment subtree node count is identical for normalized 1-row and 10,000-row sources with zero fact-list nodes.
- After warm-up, record at least five isolated ready renders at `390x844` and `1440x900`; mark before state delivery, force one layout read, close next animation frame. Every run `<=50 ms`. Record browser/OS/DPR, fixture bytes/rows, scripting/style/layout/paint trace, and retained generations.
- Compare exact-preview screenshots with the accepted structural reference, documenting intentional differences; do not treat the reference as pixel truth.

## QC-211 — existing-dashboard interaction regression

- Tasks: `T-101`, `T-103`, `T-105`, `T-106`; automated and exact-preview manual.
- Exercise year/month selectors, refresh, charts, legends, tables, skip link, chart focus/labels, empty/error states, repeated selections, reload, and browser back/forward where the host permits.
- Assert monthly charts/body semantics and permissions remain intact, snapshot does not obscure them, actions fire once, state recovers, and assets/icons load.
- Capture request diff, console errors, unhandled rejections, failed requests, broken assets, and before/after screenshots. Investigate every unexpected entry.

## QC-212 — deterministic evidence and flag-safe delivery

- Tasks: `T-106`, `T-107`; inspection and full-suite execution later.
- Run targeted transport, adapter, state, host, UI/a11y, and performance suites, then full regression. Record exact commands, runtime/browser versions, pass/fail/skip counts, durations, fixture sizes/bytes, mapper/render timings, DOM count, request spread/peak, winning generation, and navigation count.
- Mutation/test-double gates must fail for added current filter/date, navigation query, stale overwrite, fabricated zero, inferred equipment classification, pre-dedupe population check, or accepted forged host object. QC review must not mutate app source.
- Scan fixtures/logs/screenshots/errors for credential canaries, authorization values, signed URLs, raw event text, or private controller prose.
- Verify `CURRENT_SNAPSHOT_LIVE_CALLS_ENABLED` defaults false and affects current calls only. Separate local, exact-preview, and authenticated-live results; unavailable live checks are explicitly skipped/blocked. Confirm no backend, SQL, `SearchAllEvents`, Git/provider/deploy/lifecycle/issue-tracker work or claims.

## Acceptance coverage index

| Task | Cases covering every acceptance criterion |
|---|---|
| `T-101` | QC-201, QC-202, QC-204, QC-211 |
| `T-102` | QC-203, QC-204, QC-210 |
| `T-103` | QC-202, QC-205, QC-207, QC-211 |
| `T-104` | QC-202, QC-206 |
| `T-105` | QC-203, QC-206, QC-207, QC-208, QC-209, QC-210, QC-211 |
| `T-106` | QC-201 through QC-212, especially QC-212 full-suite/evidence gates |
| `T-107` | QC-212 |

