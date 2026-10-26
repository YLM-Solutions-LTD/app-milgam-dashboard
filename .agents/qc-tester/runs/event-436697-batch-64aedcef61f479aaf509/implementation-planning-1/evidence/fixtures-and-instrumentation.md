# Planned fixtures and instrumentation

## Synthetic fixture catalog

All fixture names describe future synthetic test data; this stage created no executable fixtures.

| ID | Data shape and oracle |
|---|---|
| `CTX-OK` | Approved HTTPS parent, `event.source === window.parent`, approved matching HTTPS API origin, synthetic bearer canary, Hebrew RTL; exactly one accepted context. |
| `CTX-LTR` | Same trust tuple with English/LTR runtime. |
| `CTX-DENY-*` | Same-origin non-parent source; unapproved parent; production HTTP parent; HTTP API; unapproved HTTPS API; malformed/timeout/fallback/direct access; mismatched command/date response. Oracle: zero authenticated fetch/date/command effects. |
| `EVT-READY` | Envelope row count 3; `overall 142/18`, `headquarters 64/7`, `branches 78/11`; unique scopes, same present `AsOf`. |
| `EVT-ZERO` | Required three scopes, every count 0, present date; valid zeros. |
| `EVT-BAD-*` | Missing/duplicate/unsupported scope, bad integer, open greater than total, missing date, reconciliation failure, envelope row mismatch. Oracle: `invalid-response`, no partial commit. |
| `PER-READY` | Exactly one row: valid 312, missing 28, overdue 17, distinct present `AsOf` and `ValueDate`. |
| `PER-ZERO` | Exactly one row with all three validated zero counts and dates. |
| `PER-BAD-*` | Zero/two rows, negative/fractional/nonnumeric counts, missing dates. Oracle: `invalid-response`. |
| `EQP-0/1/1000/10000` | Complete unpaged envelopes with `TotalCount` equal to unique equipment count; active/inactive and nullable treatment/configuration variants; classification oracle always unavailable. |
| `EQP-DUP-*` | Identical duplicates (accepted/deduped), conflict on any fact for same `EquipmentId` (rejected), duplicate-heavy 10,000-row response with deterministic unique count. |
| `FAIL-*` | 400/401/403/500, missing procedure, network, offline, timeout, abort, invalid JSON/envelope; body contains token/signed-URL canaries to prove redaction. |
| `RACE-*` | Deferred three-request generations with deterministic resolve/reject/abort ordering, ten-refresh burst, and one previous last-good snapshot. |
| `NAV-*` | Deferred/rejected/recovered `ready()` and `executeCommand`; 20 mixed pointer/keyboard activation burst. |
| `COPY-LONG` | 200%-length Hebrew and English labels, mixed bidi date text, 8-digit locale counts, and long host-formatted report timestamp. |
| `ANALYTICS-BASE` | Existing two-period monthly fixtures and all charts/tables; monthly body oracle remains the pre-change date/paging contract. |

## Required harness probes

| Probe | Captured values | Pass oracle |
|---|---|---|
| Fetch ledger | Monotonic start/end, generation, origin/path, method, header names, parsed body, signal/abort, status, in-flight count | Three starts within 50 ms, peak current generation 3, exact `{}`, no retry/paging/current filters; no secrets captured. |
| Host ledger | Accepted source alias/origin, `ready`, `ToDisplayDate`, `executeCommand`, response source/origin | Accepted tuple only; raw dates unchanged; exact ordered navigation payload; denied cases have count 0. |
| State ledger | Analytical and snapshot state/ID/status/timestamp/commit, abort, last-good count | Orthogonal lifecycles; only newest complete generation commits; one last-good maximum. |
| Console/runtime | `console.error/warn`, `error`, `unhandledrejection`, asset/network failures | No unexpected entry, secret, stack/response detail in UI evidence, or broken asset. |
| Accessibility tree | Role/name/state/order/live properties, focus target | Heading/region/status semantics, three unique native permit buttons, coherent DOM/focus order, polite non-atomic announcements. |
| Geometry | Element rectangles, client/scroll sizes, computed direction/styles | No overlap/clipping/page x-scroll; 44×44 px controls; coherent logical spacing at all viewports/zoom. |
| Contrast | Rendered foreground/background/focus pairs | 4.5:1 normal text, 3:1 large/non-text; 3 px visible focus plus offset. |
| DOM cardinality | Root-inclusive snapshot elements and equipment subtree elements | Snapshot ≤80; equipment count identical for 1 and 10,000 source facts. |
| Mapping timing | Runtime/version, rows, duplicates, unique/output counts, bytes, post-warm durations | Each recorded 10,000-row run ≤100 ms and correct unique count; linear trend. |
| Render timing | Browser/OS, viewport/DPR, start, forced-layout point, next-frame end, trace categories | Each post-warm ready render ≤50 ms at 390×844 and 1440×900. |

## Screenshot and evidence naming

Use `<case>-<state>-<viewport>-<dir>-<sequence>.<ext>`, for example `QC-010-ready-390x844-rtl-01.png`. Store final-review evidence only in that final QC run's own evidence directory. Every evidence index row must include the exact preview identity/site digest and sanitized fixture ID.

The UI reference image is illustrative rather than a golden pixel baseline. Visual pass/fail follows the accepted structure/state/design specification, validated runtime values, and measurable geometry/contrast rules.

## Numeric measurement controls

- Warm-up is one identical unrecorded mapper/render operation; do not mix network latency into mapper/render budgets.
- Use a quiet local/CI runtime, record all samples (minimum five), and require every sample—not only median—to meet the stated ceiling. Record clock source and versions.
- Mock decoded bytes are `TextEncoder().encode(serializedBody).byteLength`; preview network evidence records `decodedBodySize` when the browser exposes it. Do not impose an unsupported response-size rejection cap.
- Count snapshot DOM inclusively: snapshot root plus all descendant elements. Measure equipment subtree separately before and after 1 versus 10,000 normalized input.
- Render duration begins immediately before ready-state delivery/renderer entry and ends after synchronous DOM update, a forced layout read, and the next animation frame; retain the correlated performance trace to identify scripting/style/layout/paint work.

## Planned environment matrix

| Dimension | Required values |
|---|---|
| Direction/locale | `he-IL`/RTL, `en-US`/LTR; mixed bidi fixture in both. |
| Viewport | 320×568, 390×844, 768×1024, 1440×900. |
| Zoom | 100% all viewports; 200% at desktop and effective narrow reflow. |
| Input | Mouse/touch-equivalent click, Tab, Shift+Tab, Enter, Space; 20-activation burst. |
| Network/state | Normal, slow/deferred, out-of-order, offline, timeout, HTTP/permission/server, invalid response, abort. |
| Data volume | Equipment 0, 1, 1,000, 10,000, duplicate-heavy, nullable, inactive. |
| Browser | Exact preview in recorded current Chromium-class browser; repeat responsive/a11y smoke in a second controller-supported browser when available and label unavailable compatibility coverage honestly. |

## Execution blockers at planning time

1. No controller-authorized preview URL/identifier or preview site digest/commit was supplied.
2. No approved parent-window host harness/test tenant was supplied for origin/source/API confinement, date formatting, or navigation commands.
3. The current package exposes Node tests only; no browser automation/a11y dependency is present. Implementation may add deterministic coverage under `T-106`; QC will not install or alter the app.
4. Live procedure availability and temporary live-call enablement are controller-owned. Without authorization, live checks remain skipped and the default flag must remain false.

These block execution evidence only; they do not make the shared QC plan untestable.
