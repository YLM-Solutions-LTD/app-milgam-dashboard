# Milgam dashboard UAT cases — plan review 1

## Execution rules for final review

- Run against the exact controller-authorized preview through `/App/milgam-dashboard`.
- Record preview URL/identifier, site digest or commit, browser/version, viewport, locale/direction, host/harness identity, and case result without secrets.
- Use only an approved test tenant and synthetic/controller-approved report fixtures. Do not alter production data.
- Host-dependent cases require an approved SimplyLog host or controller-provided host harness. A standalone preview is diagnostic only.
- A skipped or unauthorized step is `BLOCKED`, never `PASS`.

## UAT-001 — Authenticated entry and three-report snapshot load

- Tasks: `T-101`, `T-102`, `T-103`, `T-105`
- Goal/outcome: an authorized user opens the dashboard and sees a coherent current snapshot without disturbing monthly analytics.
- Preconditions: approved host context; valid reconciled event fixture, one permit row, equipment facts containing active/inactive and nullable fields; flag enabled only in the authorized preview.
- Mode: browser automation plus network inspection.
- Steps/expected:
  1. Enter through `/App/milgam-dashboard`; host bootstrap completes before snapshot calls begin.
  2. Observe exactly three concurrent `POST`s to the documented current-events, current-permits, and current-equipment Search routes. Each body is exactly `{}`; no dates, filters, pagination, username, or administrator identity appear.
  3. The snapshot region appears before month controls/charts and independently moves loading → ready only after all three reports validate.
  4. Event cards show overall/HQ/branches total and open values; HQ + branches reconciles to overall.
  5. Permit cards show valid, missing, and overdue separately. Equipment shows deduplicated total and textual classification unavailable.
  6. Monthly controls and charts remain visible and functional.
- RTL/LTR: execute Hebrew RTL; repeat core reading/focus order in LTR runtime.

## UAT-002 — Exact report interpretation and honest zero display

- Tasks: `T-102`, `T-105`, `T-106`
- Goal/outcome: users can trust displayed counts and distinguish validated zero from unavailable data.
- Preconditions: approved synthetic fixtures with real zero values, approaching-expiry/expiry-today permit counts, inactive and never-treated equipment, identical duplicate equipment IDs, and nullable treatment/configuration fields.
- Mode: automated browser/harness.
- Steps/expected:
  1. Load fixtures and verify zero renders only for explicitly validated numeric counts.
  2. Confirm outer event envelope count is not displayed as event population; domain row values drive cards.
  3. Confirm permit missing and overdue remain separate and no UI/accessibility text calls their sum “invalid certificates.”
  4. Confirm identical equipment duplicates count once; inactive/never-treated/null-field equipment remains in total.
  5. Confirm no valid/overdue equipment number or inferred pass/fail appears; classification reads unavailable.
  6. Confirm report dates are displayed through the host formatter using unchanged raw values.

## UAT-003 — Period changes do not change current snapshot

- Tasks: `T-103`, `T-105`, `T-106`
- Goal/outcome: current metrics remain understandable and stable while users explore monthly analytics.
- Preconditions: ready snapshot and at least two selectable analytical periods.
- Mode: browser automation.
- Steps/expected:
  1. Record snapshot values and refreshed/report timestamps.
  2. Change year/month and wait for analytical charts to update.
  3. No current-report request occurs; snapshot values, state, and timestamp remain unchanged and visible.
  4. Repeat while snapshot is initially loading; the analytical transition does not cancel, clear, or overwrite snapshot state.

## UAT-004 — Overlap, slow response, cancellation, and stale suppression

- Tasks: `T-101`, `T-103`, `T-106`
- Goal/outcome: slow/late responses never replace a newer coherent snapshot.
- Preconditions: harness can delay and order responses.
- Mode: automated host harness.
- Steps/expected:
  1. Start snapshot request A and delay one report.
  2. Trigger authorized global/snapshot refresh B; verify A is aborted/superseded and B launches its own three reports.
  3. Resolve B successfully, then resolve/reject A late.
  4. Only B values/timestamp remain; A produces no visible error or overwrite.
  5. Verify a snapshot-only retry does not reload monthly analytics.

## UAT-005 — First-load failures, permission denial, malformed and empty responses

- Tasks: `T-101`, `T-102`, `T-103`, `T-105`, `T-106`
- Goal/outcome: unavailable data is explicit and recovery is local to the snapshot.
- Preconditions: harness variants for 401, 403, missing procedure/server error, network failure, invalid JSON, empty/missing `Items`, invalid `TotalCount`, and structurally malformed domain rows.
- Mode: automated negative tests plus browser observation.
- Steps/expected:
  1. For each variant, open with no last-good snapshot.
  2. Snapshot shows sanitized first-load failure and retry; no metric is fabricated as zero and analytics remains usable.
  3. No token, raw server body, stack, signed URL, or internal response detail appears in DOM, console, network-derived UI, screenshots, or logs.
  4. Restore a valid response and activate retry; snapshot becomes ready without forcing an analytical reload.
  5. An authorized envelope with `Items: []` where a required report shape is absent is invalid/unavailable, not a valid all-zero snapshot.

## UAT-006 — Session expiry and re-entry

- Tasks: `T-101`, `T-103`, `T-104`, `T-105`
- Goal/outcome: an expired/rejected host session fails safely and a newly authorized entry can recover.
- Preconditions: approved harness can expire authorization after initial bootstrap and later provide a fresh valid context.
- Mode: manual plus browser/network evidence.
- Steps/expected:
  1. Load a valid snapshot, then expire/revoke the host authorization and request refresh.
  2. The prior snapshot stays visible but is marked stale/error; no credentials leak and no zero replacement occurs.
  3. Snapshot retry under the expired session remains safely denied.
  4. Re-enter/rebootstrap using the host-supported authorized flow; new requests use only the refreshed host context and a successful snapshot clears stale/error state.

## UAT-007 — Refresh failure retains last-good snapshot

- Tasks: `T-103`, `T-105`, `T-106`
- Goal/outcome: users retain useful context while seeing that it may be stale.
- Preconditions: valid initial load, then one report fails or becomes malformed on refresh.
- Mode: browser automation.
- Steps/expected:
  1. Capture ready values/timestamp, initiate refresh, and fail one of the three reports.
  2. No partial mixture commits; all prior values remain and are clearly marked stale with accessible error/retry feedback.
  3. Analytics remains visible and functional.
  4. Retry with all valid reports replaces the complete snapshot and clears warning state.

## UAT-008 — Permit navigation by pointer and keyboard

- Tasks: `T-104`, `T-105`, `T-106`
- Goal/outcome: every permit indicator reliably opens the existing unfiltered permit board.
- Preconditions: ready permit snapshot; approved host/harness records `ready` and `executeCommand` calls.
- Mode: automated keyboard/pointer test plus accessibility inspection.
- Steps/expected:
  1. Activate valid, missing, and overdue controls separately by click, Enter, and Space as applicable.
  2. Each activation calls `ready()` before exactly one `executeCommand("Navigate", {Url:"#/Permits/Dashboard"})`; payload contains no query/filter/count data.
  3. Controls have distinct accessible names, visible focus, native semantics, and coherent focus order.
  4. While readiness/navigation is delayed, repeated activation does not duplicate the command and busy state is perceivable.
  5. Event and equipment metrics do not navigate.

## UAT-009 — Permit navigation failure and recovery

- Tasks: `T-104`, `T-105`, `T-106`
- Goal/outcome: a host command failure does not destroy dashboard state.
- Preconditions: ready snapshot; harness rejects `ready()` and `executeCommand()` in separate runs.
- Mode: browser automation.
- Steps/expected:
  1. Activate a permit control and force the configured rejection.
  2. Snapshot and analytics remain visible; an accessible, sanitized, non-destructive error is announced.
  3. Interaction lock clears after rejection. Restore host behavior and verify a subsequent activation succeeds exactly once.

## UAT-010 — Responsive, RTL/LTR, and accessible snapshot states

- Tasks: `T-105`, `T-106`
- Goal/outcome: current-state information is usable across viewport sizes, directions, and non-pointer input.
- Preconditions: fixtures for ready zeros/nonzeros, loading, first error, stale error, and navigation error.
- Mode: manual visual/accessibility review at phone, tablet, and desktop widths.
- Steps/expected:
  1. In RTL and LTR, verify logical spacing, coherent visual/DOM/focus order, semantic heading, distinct snapshot status, and locale-aware number display.
  2. At each width, panels stack/reflow without horizontal clipping, overlap, inaccessible controls, or chart regression.
  3. Focus indicators are visible; controls are keyboard operable; status updates are polite and do not replace the full dashboard.
  4. Meaning is not color-only and loading/error/unavailable states use text/status rather than plausible `0` values.

## UAT-011 — Contract rejection matrix

- Tasks: `T-101`, `T-102`, `T-106`
- Goal/outcome: invalid contracts are rejected consistently rather than partially displayed.
- Preconditions: isolated fixture variants.
- Mode: deterministic automated acceptance suite.
- Steps/expected:
  1. Events: reject missing/duplicate scopes, noninteger/negative counts, open > total, absent date, and HQ/branches reconciliation failures.
  2. Permits: reject zero/multiple rows, invalid counts, and missing dates; keep three metrics independent.
  3. Equipment: accept documented nullable fields and inactive rows; reject conflicting duplicate IDs and envelope/population mismatch.
  4. Transport: reject abort, HTTP, network, invalid JSON, missing/non-array Items, and negative/fractional/nonnumeric TotalCount as typed failures.
  5. Confirm none of these cases exposes a partial or fabricated snapshot.

## UAT-012 — Delivery boundary and regression evidence

- Tasks: `T-106`, `T-107`
- Goal/outcome: delivery evidence is honest, reversible, and preserves existing analytics.
- Preconditions: final local source and controller-authorized preview metadata.
- Mode: evidence review plus full deterministic suite.
- Steps/expected:
  1. Run targeted transport, adapter, concurrency, host, UI, and full regression commands; record exact commands and pass/fail counts.
  2. Confirm tests/fixtures contain no credentials, frozen event/action prose, raw private inputs, or signed URLs.
  3. Confirm existing analytical requests retain date-range bodies and charts/controls still work.
  4. Confirm default/local `CURRENT_SNAPSHOT_LIVE_CALLS_ENABLED` is false; any temporary preview enablement is controller-owned and isolated to snapshot calls.
  5. Record authenticated preview checks as blocked/skipped if no approved host is supplied; do not infer live procedure availability.
  6. Confirm no SQL, `SearchAllEvents`, backend, Git, provider, deployment, lifecycle, or issue-tracker change is part of the delivered implementation.

## Cross-task workflow coverage

- `X-01 Happy path`: `UAT-001` → `UAT-002` → `UAT-003` → `UAT-008`.
- `X-02 Recoverable availability failure`: `UAT-005` → successful retry → `UAT-007`.
- `X-03 Race-safe refresh`: `UAT-004` with period change from `UAT-003` during overlap.
- `X-04 Authorization lifecycle`: `UAT-001` → `UAT-006` → re-entry/recovery.
- `X-05 Accessible host-command failure`: `UAT-008` → `UAT-009`, repeated in RTL/LTR and narrow viewport.
- `X-06 Release confidence`: `UAT-011` → `UAT-010` → `UAT-012` against the exact authorized preview.
