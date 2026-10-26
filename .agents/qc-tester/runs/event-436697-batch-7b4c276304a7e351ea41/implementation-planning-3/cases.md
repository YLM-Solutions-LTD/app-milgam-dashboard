# QC implementation-planning cases — cycle 3 attempt 1

## Scope and safety

- Batch `event-436697-batch-7b4c276304a7e351ea41`, plan revision 7, structure tasks `T-201`–`T-205`.
- Frozen action order: `[536946,536949,537034,537037,537040,547704,547710,547713,569787,569843]`.
- This is a test plan only. It records no implementation, execution, preview, deployment, or release result.
- Use the controller fixture only at `https://milgam.ylm.co.il/controller-host-fixture/`. Fulfil GuestBridge and API traffic locally with synthetic marker data; fail closed on any unhandled request. Never contact a tenant, use credentials, inject a host adapter/readiness promise, or widen trusted origins/CSP.
- Preview checks must exercise the packaged, initialized, digest-verified `SimplyVibeClient` and supplied GuestBridge. Record preview identity, browser/runtime, direction, viewport, fixture generation, request/command ledgers, console/page errors, screenshots, decoded bytes, timings, and DOM counts.

## Planned checks

### QC-301 — enabled release flag and exact request contract

- Maps: `T-201` AC1–AC4; `T-203` AC1, AC7; `T-204` AC1, AC8.
- Assert source and tests require `CURRENT_SNAPSHOT_LIVE_CALLS_ENABLED === true`. A verified fresh SDK capability must start exactly three concurrent POSTs, one to each documented current route, each with body `{}` and no dates, locations, pagination, user, or administrator fields.
- Direct entry and every rejected trust case produce zero authenticated traffic. Changing month/year after readiness produces zero current calls and leaves snapshot facts/timestamp intact. Fail if any implementation or test resets the flag before controller release.

### QC-302 — source/origin/capability negative matrix

- Maps: `T-201` AC2; `T-203` AC2–AC4, AC7; `T-205` AC4, AC6.
- Test wrong/missing `event.source`, HTTP/wrong/unlisted parent origin, parent/API-origin mismatch, missing token, forged host-shaped object, public marker/boolean, mutated context, wrong client constructor/instance, disposed/replaced client, stale Ready correlation, unchanged session after taint, and legacy JSON replay.
- Every negative row must yield zero API requests, bridge effects, navigation, and state commits. Only controller-created distinct bridge/session re-entry may mint a new private generation.

### QC-303 — report adapters, dates, and transactional UI states

- Maps: `T-203` AC1, AC5, AC7; `T-204` AC1, AC4; `T-205` AC2, AC5.
- Events: require exactly overall/HQ/branches, integer bounds, `open <= total`, dates, and reconciliation. Permits: preserve distinct valid/missing/overdue. Equipment: deduplicate identical `EquipmentId` facts before population comparison; reject conflicts, malformed/incomplete data; show total and classification unavailable.
- Pass report dates unchanged to `ToDisplayDate()` with no appended `Z`. Cover loading, empty, initial 400/401/403/500, malformed JSON/envelope, timeout/offline, partial failure, retry, and refresh failure. Initial failures show no fake zero; refresh failures retain the complete last-good DOM/timestamp and announce stale/error without a transient empty commit.

### QC-304 — terminal 401/403 taint and distinct re-entry

- Maps: `T-203` AC3–AC5, AC10; `T-204` AC4–AC5; `T-205` AC1–AC6.
- Populate a snapshot, then reject each route in turn with 401 and 403. The matching credential/session generation becomes terminally tainted: abort siblings, preserve stale last-good data, disable/deny authenticated work, and make repeated refresh plus cached `ready()`/reconnect attempts issue zero requests.
- Replay the same bridge/session identity and assert it cannot clear taint. Provide a distinct controller session and assert automatic exactly-one recovery load (three concurrent calls), a new token/generation, restored current/analytical work, and no duplicate load.

### QC-305 — stale response and revocation isolation

- Maps: `T-203` AC3–AC5, AC9–AC10; `T-204` AC4–AC5, AC8–AC9; `T-205` AC1–AC6.
- Hold analytical/current requests and a command, then disconnect, dispose, timeout, rotate, or revoke. Resolve old responses after the boundary. Assert abort and zero old-generation UI, state, request, command, or navigation effects while last-good content remains stale.
- Resolve competing refreshes out of order and run a 10-refresh burst; only refresh generation 10 may commit. Fresh fixture re-entry alone starts one new three-request load and rejects mismatched API/command correlations.

### QC-306 — packaged SDK Ready and exact Navigate single-flight

- Maps: `T-203` AC2, AC9–AC10; `T-204` AC2, AC5, AC9; `T-205` AC1, AC3, AC6.
- Verify the supplied hash-recorded client is a same-origin production asset, initialized with the exact corrected trusted origin, kept private, and used for the real Ready correlation and GuestBridge command; forbid public service globals or test bridges in production.
- Pointer, Enter, and Space on both permit metrics must produce only `Navigate`, `{Url:"#/Permits/Dashboard"}`. Acquire the guard synchronously before awaiting Ready and retain it through command settlement. Twenty rapid mixed activations while Ready or command is held yield one chain/effect; controls expose pending state.
- Revoke/dispose before Ready resolution, during the command, and immediately before settlement. Old/mismatched responses have zero effects; no second chain opens until settlement. Fresh generation navigation succeeds once.

### QC-307 — disposed-client and focus cleanup safety

- Maps: `T-203` AC7, AC10; `T-204` AC5, AC9; `T-205` AC1, AC3.
- Repeat the stable reproduction for `qc-sdk-reentry-client-disposed-unhandled-v1`: hold command, activate, revoke generation 1, release, then re-enter. Capture `pageerror`, `error`, and `unhandledrejection`; all must remain empty for expected DISPOSED/SESSION_RESET/HOST_REVOKED transitions.
- Repeat with the trigger connected, removed, rerendered, disabled, hidden, and no longer focusable. Focus restores only to a captured still-connected eligible control; no null dereference or stolen focus.

### QC-308 — safe diagnostics with marker bodies

- Maps: `T-203` AC6–AC7; `T-204` AC3.
- Return 400/401/403/500, malformed text/JSON, invalid envelopes, mapper failures, and service errors containing unique personal/internal/token/signed-URL markers in nested and top-level fields.
- Inspect all console argument graphs, page errors, unhandled rejections, error properties/serialization, state, and rendered text. No marker, raw/parsed body, snippet, PII/internal field, token, URL, or full error object may escape. Permit only bounded dataset/status/kind/byte/item metadata and fixed generic guidance.

### QC-309 — CSP-safe analytical visuals

- Maps: `T-202` AC1–AC4; `T-203` AC7; `T-204` AC6.
- Render zero, single-category, mixed, and maximum fixtures. Assert no affected inline style/property or runtime stylesheet injection for donut, swatches, stacks, or bars. Donut segments, all swatches, and nonzero magnitudes must be visible under delivered `style-src 'self'`; zero states remain coherent.
- Exact accessible labels expose unquantized counts/percentages and category text independent of color. Require strict self-only executable/style policy, no `unsafe-inline`/`unsafe-eval`/wildcard executable source, zero relevant CSP violations, and zero third-party executable requests.

### QC-310 — responsive RTL/LTR, keyboard, and accessibility

- Maps: `T-202` AC2–AC4; `T-204` AC6–AC8.
- Required matrix: 390×844 and 1440×900 in RTL and LTR; stress at 320×568, 768×1024, and 200% zoom. Capture full-page and chart close-ups.
- Assert no viewport/content overflow, overlap, clipping, hidden controls, uncontrolled list growth, unreadable bidi text, or incorrect directional alignment. Verify semantic headings/status, unique accessible names, labels/error association, polite announcements, logical focus order, visible focus, keyboard activation, contrast/non-color meaning, and usable touch targets.

### QC-311 — performance, DOM, and request bounds

- Maps: `T-203` AC8–AC9; `T-204` AC1, AC7–AC8; `T-205` AC5.
- Exercise 0, 1, 1,000, 10,000, duplicate-heavy, nullable, conflicting, and malformed equipment fixtures. After warm-up, record at least five 10k mapping/dedup trials and require each under 100 ms, with runtime, bytes, and min/median/max.
- At both required viewports record ready-snapshot render work under 50 ms and no more than 80 snapshot DOM elements; equipment growth adds no fact-list nodes. Exactly three requests begin concurrently per accepted load/refresh, at most three current-generation requests remain active, no automatic retry occurs, and refresh/re-entry bursts do not duplicate loads.

### QC-312 — regression suites and evidence integrity

- Maps: `T-203` AC1, AC7–AC10; `T-205` AC7.
- Run focused QC/UAT and existing regression suites without weakened assertions; record exact commands, Node/browser versions, totals, failures, skips, and fixture digests. Mandatory mutation/negative failures cover forged capability, altered body, conflicting duplicate, stale commit, fabricated zero, parameterized permit URL, unsafe focus, inline chart style, false flag, nonterminal 401/403, duplicate recovery, second command chain, and uncaught disposal rejection.
- Scan fixtures/output for credentials, real event text, raw bodies, and signed URLs. No local/deterministic pass substitutes for exact-preview or corrected-fixture evidence.

### QC-313 — exact-preview scenario ledger

- Maps: all `T-204` AC1–AC9 and `T-205` AC1–AC6.
- Against the exact controller-supplied preview in the corrected fixture, execute happy path, initial failure/retry, 500 stale refresh, 401 and 403 terminal taint, repeated denied refresh/reconnect, distinct automatic re-entry, reverse-order/10-refresh races, and held-command 20-activation revoke/re-entry race.
- Record all requests/effects with generation and correlation, screenshots, headers, console/page errors, executable URLs, timings, DOM counts, and exact expected/actual outcomes. Require all traffic locally fulfilled and record zero real tenant/external effects.

### QC-314 — release handoff boundary

- Maps: `T-201` AC4; `T-205` AC7.
- Review the release record, without deploying: distinguish deterministic tests, exact-preview checks, corrected controller-fixture lifecycle proof, any real-host result, and controller deployment status. Report every skip/gap honestly.
- Verify the authorized true flag is retained through the one controller-owned production deployment. Any later false revert requires separate authorization, remains local only, and must not trigger deployment. QC never claims controller completion.

## Traceability summary

All 26 current acceptance criteria are covered: T-201 by QC-301/302/314; T-202 by QC-309/310; T-203 by QC-301–312; T-204 by QC-301 and QC-303–313; T-205 by QC-302–307 and QC-311–314. `qc-sdk-reentry-client-disposed-unhandled-v1` remains an open implementation/regression requirement until fresh execution closes it. The plan also explicitly gates terminal 401/403 taint, distinct re-entry, transactional stale retention, synchronous Navigate single-flight, and disposed-client rejection handling.
