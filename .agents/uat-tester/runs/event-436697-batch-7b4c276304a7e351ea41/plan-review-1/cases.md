# Milgam dashboard UAT cases — recovered batch plan review 1

## Final-review execution contract

- Execute browser cases against the exact controller-authorized release-candidate preview through `/App/milgam-dashboard`; record preview URL/identifier, commit or site digest, browser/runtime version, viewport, locale/direction, and fixture identity without secrets.
- Use only synthetic non-secret fixtures or controller-authorized test data. Cases requiring authorization expiry/revocation or a privileged command must run in an approved real SimplyLog test host or controller-owned faithful harness. Standalone/synthetic parent messaging is diagnostic only and cannot pass those steps.
- Record preconditions, actual observations, request/command counts, console/page failures, evidence path, and `PASS`/`FAIL`/`BLOCKED` per case. A skipped or unauthorized step is never a pass. Make no production writes.

## UAT-201 — Enabled authenticated entry and coherent snapshot

- Tasks: `T-201`, `T-203`, `T-204`
- Goal/outcome: an authorized user enters the exact preview and sees current operational facts alongside working analytics.
- Preconditions/mode: exact preview with `CURRENT_SNAPSHOT_LIVE_CALLS_ENABLED=true`; approved host or faithful non-secret fixture harness; automated browser/network capture.
- Steps/expected: enter `/App/milgam-dashboard`; verified host acceptance precedes requests. Exactly three concurrent POSTs target the documented CurrentEvents, CurrentPermits, and CurrentEquipment Search paths with body `{}` and no dates, filters, pagination, username, or administrator identity. The snapshot changes loading→ready only after all three validate; event scopes reconcile, permit counts remain separate, and deduplicated equipment total appears with classification unavailable. Analytics remains visible and usable. A rejected/direct context performs zero authenticated current calls.
- Direction: repeat ready-state reading and focus order in Hebrew RTL and LTR.

## UAT-202 — Release flag persistence and analytical independence

- Tasks: `T-201`, `T-203`, `T-204`, `T-205`
- Goal/outcome: remediation, period exploration, and evidence collection cannot silently disable or reload current snapshots.
- Preconditions/mode: source/config assertion plus ready exact preview; two analytical periods.
- Steps/expected: deterministic test fails if the release-candidate flag is false. Record snapshot values/timestamp and current request count; change year/month and await chart update. Snapshot data/state/timestamp remains unchanged and no current request is added. Repeat during snapshot loading without cross-cancellation. Evidence through preview review and controller deployment handoff still identifies flag=true; no UAT step performs or authorizes a post-release revert.

## UAT-203 — CSP-safe analytical chart workflow

- Tasks: `T-202`, `T-203`, `T-204`
- Goal/outcome: analytical decisions remain visually and accessibly possible under the actual enforced CSP.
- Preconditions/mode: exact preview response headers; zero, single-category, mixed, and maximum analytical fixtures; desktop/mobile browser capture.
- Steps/expected: exercise date changes and render division donut, legend swatches, stacked segments, and bars. All required visuals remain visible; exact counts/percentages and category names are exposed textually/accessibly and meaning is not color-only. Affected elements have no generated inline `style` attribute/property. Headers retain at least `default-src 'self'`, `script-src 'self'`, `style-src 'self'`, `object-src 'none'`, and `base-uri 'none'`, with no unsafe-inline/eval or wildcard executable relaxation. Console contains zero relevant CSP violations, page has no uncaught error, and executable network trace is same-origin only.
- Direction: capture 1440×900 RTL/LTR and 390×844 RTL/LTR; expect no clipping, blank donut, missing swatch, or policy-caused zero-width bar.

## UAT-204 — Strict report semantics, deduplication, and honest unavailable states

- Tasks: `T-203`, `T-204`
- Goal/outcome: displayed facts retain their documented units and malformed/incomplete input never becomes a plausible zero.
- Preconditions/mode: deterministic fixtures for event scope errors, permit shape/count errors, raw dates, and equipment sets of 0, 1, 1,000, 10,000, nullable/inactive/never-treated, identical duplicate, conflicting duplicate, malformed, and population mismatch rows.
- Steps/expected: valid explicit zero renders as zero. Events require exactly overall/HQ/branches and reconcile; permits remain valid/missing/overdue with no “invalid” sum. Report dates pass unchanged to `ToDisplayDate()` with no appended `Z`. Equipment deduplicates identical `EquipmentId` rows before unique `TotalCount` comparison, accepts supported nullable/inactive facts, and rejects conflicts/malformed/incomplete populations atomically. Treatment status/interval never infers validity; classification remains explicitly unavailable.

## UAT-205 — Error, retry, stale retention, and newest-generation wins

- Tasks: `T-203`, `T-204`
- Goal/outcome: users can recover without seeing fabricated or mixed-generation facts.
- Preconditions/mode: controllable 401/403, missing procedure, network, invalid JSON/envelope/domain, slow and reverse-order fixtures; browser automation.
- Steps/expected: each initial failure shows a sanitized snapshot-local error and retry with no numeric placeholders while analytics remains usable. After a valid snapshot, make one report fail on refresh: no partial mixture commits; last-good values/timestamp remain visibly stale. A subsequent all-valid retry replaces the snapshot atomically. Delay generation A, refresh to B, resolve B then A: A is aborted/ignored. Ten rapid refreshes commit only generation 10, keep at most three current-generation requests in flight, and do not trigger automatic retries.

## UAT-206 — Permit navigation, burst lock, focus, and failure recovery

- Tasks: `T-203`, `T-204`, `T-205`
- Goal/outcome: each permit metric opens the one supported board safely and predictably.
- Preconditions/mode: ready snapshot in an approved command-capable host/harness; pointer/keyboard automation; controllable command resolution.
- Steps/expected: activate valid, missing, and overdue independently using click, Enter, and Space as appropriate. Each accepted chain performs `await host.ready()` then exactly `executeCommand("Navigate", {Url:"#/Permits/Dashboard"})`; no query/filter/count parameter appears. Controls have distinct names, visible focus, native semantics, coherent order, and a polite busy/error announcement. Twenty rapid activations while pending produce one command chain. Resolve and reject in separate runs: lock clears, dashboard data survives, sanitized failure is recoverable, and focus returns only to a captured control that remains connected/focusable. Event/equipment metrics never navigate.

## UAT-207 — Responsive, bidi, accessible, and bounded snapshot

- Tasks: `T-202`, `T-203`, `T-204`
- Goal/outcome: all states remain usable and bounded across supported directions and sizes.
- Preconditions/mode: loading, ready-zero/nonzero, initial-error, stale, retry, classification-unavailable, and navigation-error fixtures; 1-row and 10,000-row equipment inputs.
- Steps/expected: at 390×844 and 1440×900 in RTL and LTR, verify headings/status semantics, events→permits→equipment DOM/focus order, logical spacing, locale number handling, keyboard use, visible focus, announcements, non-color-only meaning, and no horizontal overflow/overlap. Snapshot contains at most 80 DOM elements. Equipment growth adds no fact-list nodes; 1-row and 10,000-row inputs yield the same equipment presentation node count. After prescribed warm-up, 10,000 rows map/dedupe within 100 ms and ready render completes within 50 ms at both viewports on the recorded runtime.

## UAT-208 — Host trust rejection and authorization loss during requests

- Tasks: `T-203`, `T-205`
- Goal/outcome: expired/revoked authority has no old-generation effect, and recovery requires fresh verified authorization.
- Preconditions/mode: approved real SimplyLog test host or controller-owned faithful harness capable of revocation/expiry and response control; this case is `BLOCKED` without it.
- Steps/expected: first prove zero authenticated fetch/command effect for forged public markers/booleans, non-parent source, unapproved or HTTP parent/API origins, direct access, timeout/fallback, mutation, and mismatched response source/origin. Load a valid snapshot, begin snapshot and analytical requests, revoke before settlement, then resolve old responses. Requests abort where supported; old responses cause zero commit/navigation/state mutation; last-good data remains visibly stale and further authenticated work is denied. Fresh verified entry creates a new generation and explicit reload recovers both lifecycles using only new authority.

## UAT-209 — Authorization loss during command and response binding

- Tasks: `T-203`, `T-205`
- Goal/outcome: an in-flight privileged navigation cannot survive revocation or cross generations.
- Preconditions/mode: same approved host/harness requirement as UAT-208; delayed command response.
- Steps/expected: begin permit navigation, revoke/expire before response, and return old, wrong-source/origin, or mismatched-generation responses. Expect no navigation, UI commit, follow-on authenticated work, or state effect from the old response; busy state terminates safely. Re-enter with fresh verified authorization and prove the exact command succeeds only for its new generation. Record capability generation and response binding without recording a token.

## UAT-210 — Exact release evidence and honest handoff

- Tasks: `T-201`, `T-202`, `T-203`, `T-204`, `T-205`
- Goal/outcome: the controller receives reproducible evidence without an unsupported release claim.
- Preconditions/mode: final local results, exact-preview metadata, and approved-host results if available; evidence review only.
- Steps/expected: record focused/full suite commands and counts; browser/runtime; viewports/directions; fixture sizes and decoded bytes; request paths/bodies/start spread/concurrency; mapping/render timings; node counts; refresh winner; command count; CSP headers/console/executable URLs; screenshots; and flag=true evidence. Confirm fixtures/evidence contain no credentials, raw event prose, tokens, or signed URLs and assertions were not weakened. Clearly separate deterministic, exact-preview, approved-host, controller deployment, and skipped/blocked evidence. No UAT artifact claims deployment, production release, lifecycle/API mutation, or a post-release false revert. If UAT-208/209 cannot run in an approved environment, the release gate remains blocked.

## Cross-task workflows

- `X-201 Enabled user journey`: UAT-201 → UAT-202 → UAT-203 → UAT-206.
- `X-202 Data integrity and recovery`: UAT-204 → UAT-205 → UAT-207.
- `X-203 Exact-preview release candidate`: UAT-201 → UAT-203 → UAT-205 refresh burst → UAT-207 → UAT-210.
- `X-204 Authorization lifecycle`: accepted entry in UAT-201 → request revocation in UAT-208 → command revocation/re-entry in UAT-209 → UAT-210.
- `X-205 Evidence boundary`: deterministic T-203 evidence → exact-preview T-204 evidence → approved-host T-205 evidence, with any unavailable tier marked `BLOCKED`, never inferred from another tier.

Plan-review execution status: designed, not executed. No preview, tenant action, host command, provider action, or production write was performed.
