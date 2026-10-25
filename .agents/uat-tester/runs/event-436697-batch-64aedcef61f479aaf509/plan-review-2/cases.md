# Milgam dashboard UAT cases — plan review 2

## Final-review execution contract

- Execute against the exact controller-authorized preview through `/App/milgam-dashboard`; record preview identifier/URL, site digest or commit, browser/version, viewport, locale/direction, and approved host/harness identity without credentials.
- Use only synthetic or controller-approved fixtures and an approved test tenant. Host-dependent behavior is proven only inside an approved SimplyLog host or controller-provided host harness; standalone behavior is diagnostic. Skipped or unauthorized steps are `BLOCKED`, never `PASS`.
- For every case record preconditions, actual observations, network/console failures, evidence path, and result. Do not make production writes.

## UAT-001 — Authenticated entry and coherent current snapshot

- Tasks: `T-101`, `T-102`, `T-103`, `T-105`
- Goal: an authorized user sees a coherent current snapshot while monthly analytics stays usable.
- Preconditions/mode: approved bound parent host; valid reconciled events, one permit row, and active/inactive nullable equipment facts; authorized preview flag; browser automation and network capture.
- Steps/expected: enter `/App/milgam-dashboard`; bootstrap must precede requests. Exactly three concurrent POSTs target the three specified Search paths, bodies serialize to `{}`, no filters/dates/paging/identity appear, zero automatic retries occur, no more than three current-generation calls are active, and mocked start spread is at most 50 ms. The region before month controls changes loading→ready only after all reports validate. Event overall/HQ/branches totals and open counts reconcile; permits are separate; equipment is deduplicated total plus textual classification unavailable. Analytics remains present.
- Direction: run Hebrew RTL at minimum and repeat DOM/reading/focus order in LTR.

## UAT-002 — Exact semantics, honest zero, and unchanged date adapter

- Tasks: `T-102`, `T-104`, `T-105`, `T-106`
- Goal: every displayed number has the documented unit and unavailable data never resembles zero.
- Preconditions/mode: fixtures with explicit zeros, nonzeros, inactive/never-treated/null facts, identical duplicates, and distinct raw `AsOf`/`ValueDate`; automated harness.
- Steps/expected: validated zero renders as zero. Event envelope `TotalCount` is not an event metric. Permit valid/missing/overdue stay separate and no visible or accessible label calls their sum invalid. Identical equipment IDs count once; inactive/null/never-treated rows count; arbitrary last status yields no validity inference. Spy proves every report date passes unchanged to `ToDisplayDate` with no appended `Z`.

## UAT-003 — Analytical period independence

- Tasks: `T-103`, `T-105`, `T-106`
- Goal: exploring monthly analytics never reloads or clears current-state metrics.
- Preconditions/mode: ready snapshot and two analytical periods; browser automation.
- Steps/expected: record snapshot values/state/timestamp, change year/month, and await chart update. Snapshot calls remain zero and recorded state is unchanged. Repeat while snapshot is loading; neither lifecycle cancels, clears, or overwrites the other.

## UAT-004 — Slow response, supersession, and refresh burst

- Tasks: `T-101`, `T-103`, `T-106`
- Goal: only the newest complete generation commits.
- Preconditions/mode: harness controls response timing and abort observation; automated.
- Steps/expected: delay generation A, refresh to B, resolve B then A; A is aborted/ignored and cannot alter B. A snapshot-only retry does not reload analytics. Run ten rapid refreshes: superseded work is aborted, only generation 10 commits, current-generation concurrency never exceeds three, no automatic retry storm occurs, and only one last-good snapshot is retained.

## UAT-005 — First-load transport, permission, and contract failures

- Tasks: `T-101`, `T-102`, `T-103`, `T-105`, `T-106`
- Goal: failures stay explicit, sanitized, and locally recoverable.
- Preconditions/mode: 401, 403, absent procedure/server error, network failure, abort, invalid JSON, missing/non-array `Items`, invalid `TotalCount`, empty required shapes, and malformed domain fixtures; negative automation plus UI observation.
- Steps/expected: each first-load failure shows snapshot-local sanitized error/retry with no numeric placeholders while analytics remains usable. No token, response body, stack, signed URL, or internal detail reaches DOM, console, screenshots, or logs. Valid retry loads snapshot without analytical reload. Required empty report shapes remain invalid, not all-zero.

## UAT-006 — Trust boundary, session expiry, and authorized re-entry

- Tasks: `T-101`, `T-103`, `T-104`, `T-106`
- Goal: credentials and privileged services operate only for the accepted parent/context and recover with a fresh authorized context.
- Preconditions/mode: approved harness can vary message source/origin/API origin, expire authorization, and rebootstrap; browser/network evidence.
- Steps/expected: prove zero authenticated snapshot or analytical fetches and zero privileged commands for same-origin non-parent sender, production HTTP parent, HTTP API address, unapproved HTTPS API address, direct/top-level access, timeout, fallback, malformed/rejected bootstrap, and mismatched command/date response source or origin. With a valid context, load data; expire it and refresh. Last-good data remains marked stale, retries stay denied without leakage. Authorized re-entry uses only the new context and clears stale/error after success. Any localhost exception uses synthetic credentials only.

## UAT-007 — Failed refresh retains one coherent last-good snapshot

- Tasks: `T-103`, `T-105`, `T-106`
- Goal: users keep useful data without mistaking it for fresh data.
- Preconditions/mode: successful initial load then one failed/malformed report; automation.
- Steps/expected: refresh failure commits no partial mixture; all prior values/timestamp remain with stale warning and accessible retry. Analytics remains functional. A later all-valid retry atomically replaces the snapshot and clears warning.

## UAT-008 — Exact permit navigation and activation burst

- Tasks: `T-104`, `T-105`, `T-106`
- Goal: every permit indicator opens the same unfiltered board once per accepted activation.
- Preconditions/mode: ready snapshot and command-recording approved host; pointer/keyboard automation.
- Steps/expected: activate valid, missing, and overdue separately with click, Enter, and Space where applicable. Each chain calls `ready()` then exactly `executeCommand("Navigate", {Url:"#/Permits/Dashboard"})`, with no query/count/filter. Names are distinct, semantics native, focus visible, and order coherent. During a delayed command, twenty rapid activations produce exactly one ready/Navigate chain and the lock clears on resolve/reject. Events/equipment never navigate.

## UAT-009 — Navigation failure is local and recoverable

- Tasks: `T-104`, `T-105`, `T-106`
- Goal: rejected readiness or navigation does not destroy dashboard data.
- Preconditions/mode: ready snapshot; reject each host step in separate runs; browser automation.
- Steps/expected: snapshot and analytics stay visible; a sanitized accessible error is announced; busy state clears. Restored host behavior permits exactly one successful subsequent command. No internal response detail leaks.

## UAT-010 — Responsive, bidi, accessible, and bounded rendering

- Tasks: `T-105`, `T-106`
- Goal: every state remains usable across directions and screen sizes without population-proportional UI.
- Preconditions/mode: ready zero/nonzero, loading, first-error, stale, and navigation-error fixtures; 1-row and normalized 10,000-row equipment inputs; manual accessibility plus automated measurement.
- Steps/expected: at 390×844 and 1440×900 in RTL and LTR, verify heading/status semantics, events→permits→equipment DOM/focus order, logical spacing, locale numbers, visible focus, keyboard use, non-color-only meaning, no clipping/overlap/chart regression, and textual loading/error/unavailable states. Snapshot has at most 80 DOM elements, 1-row and 10,000-row inputs yield the same equipment UI node count, and ready render completes within 50 ms after the prescribed setup on the recorded browser/runtime.

## UAT-011 — Strict contracts and representative-volume adapter evidence

- Tasks: `T-101`, `T-102`, `T-106`
- Goal: malformed data never partially displays and complete equipment results remain linear at representative volume.
- Preconditions/mode: deterministic fixtures for 0, 1, 1,000, 10,000, duplicate-heavy, and nullable equipment rows; recorded CI/runtime.
- Steps/expected: events reject missing/duplicate scope, bad integers, open>total, missing date, and reconciliation mismatch. Permits reject zero/multiple rows, bad counts, and missing dates. Equipment accepts inactive/nullable facts and identical duplicates, rejects conflicts/population mismatch, and always exposes classification unavailable. Transport errors stay typed. Record decoded bytes, duration, and unique count for each fixture; after one warm-up, 10,000-row map/dedupe is under 100 ms and duplicate-heavy behavior remains linear with normalized output only.

## UAT-012 — Deterministic release evidence and delivery boundary

- Tasks: `T-106`, `T-107`
- Goal: release evidence is reproducible, honest, and reversible.
- Preconditions/mode: final local source plus exact authorized preview metadata; evidence review and full deterministic suite.
- Steps/expected: record exact targeted/full commands and pass/fail counts; runtime/browser, fixture sizes, bytes, mapper/render timings, DOM count, request concurrency/start spread, winning refresh generation, and navigation command count. Confirm fixtures contain no credentials, frozen private prose, or signed URLs; monthly bodies/charts remain unchanged; default/local live flag is false. Mark unavailable live host checks skipped/blocked honestly. Confirm no backend, SQL, `SearchAllEvents`, Git, provider, deployment, lifecycle, or issue-tracker action was introduced or claimed.

## Cross-task workflows

- `X-01 Happy path`: `UAT-001` → `UAT-002` → `UAT-003` → `UAT-008`.
- `X-02 Recoverable availability`: `UAT-005` → retry → `UAT-007`.
- `X-03 Race and load`: `UAT-004` while `UAT-003` changes period, then `UAT-010`/`UAT-011` volume checks.
- `X-04 Authorization lifecycle`: trust matrix in `UAT-006` → valid `UAT-001` → expiry → authorized recovery.
- `X-05 Accessible command failure`: `UAT-008` → `UAT-009`, repeated narrow RTL/LTR.
- `X-06 Release confidence`: `UAT-011` → `UAT-010` → `UAT-012` on the exact authorized preview.
