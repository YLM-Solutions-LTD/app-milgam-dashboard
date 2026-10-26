# Deterministic fixtures, trust matrix, and instrumentation

Planning artifact only. No fixture was executed and no application test/source was authored. All future fixtures are synthetic and offline.

## Fixture catalog

| ID | Deterministic shape | Oracle / cases |
|---|---|---|
| `CTX-BOUND-RTL`, `CTX-BOUND-LTR` | Parent source, approved HTTPS host origin, corresponding approved HTTPS API origin, synthetic token canary; context created only through the production binding factory and frozen. | Accepted once; permits transport/date/navigation. QC-201, 202, 206, 209. |
| `CTX-DENY-01..10` | Same-origin non-parent; unapproved parent; production HTTP parent; HTTP API; arbitrary HTTPS API; direct/top-level; timeout/fallback; malformed context; public marker only; both public markers without private brand. | Zero URL construction with bearer data, fetch, date call, or command. QC-202. |
| `CTX-MUTATE` | Valid bound context followed by attempted token/API/origin replacement. | Mutation fails or has no effect; subsequent effects use the accepted immutable values. QC-202. |
| `EVT-VALID`, `EVT-ZERO` | Three unique scopes: overall `142/18`, HQ `64/7`, branches `78/11`, and a separate all-zero variant; present raw `AsOf`; envelope total 3. | Exact mapping/reconciliation; zero is visible only for the validated variant. QC-203, 207. |
| `EVT-BAD-*` | Missing/duplicate/unknown scope; negative/fractional/string count; open greater than total; missing date; HQ/branch mismatch; row total mismatch. | Atomic typed invalid-response; no count or partial commit. QC-203. |
| `PER-VALID`, `PER-ZERO` | One row `312/28/17` and one all-zero row, with raw `AsOf` and `ValueDate`; envelope total 1. | Three independent metrics; exact board navigation; no derived invalid total. QC-203, 206, 207. |
| `PER-BAD-*` | Zero/two rows, invalid count/date, malformed envelope. | Typed invalid-response; no fabricated zero. QC-203, 207. |
| `EQP-0`, `EQP-1`, `EQP-1000`, `EQP-10000` | Unique deterministic IDs, documented facts, active/inactive and nullable treatment/config fields; envelope total equals unique population. | Total/facts only; unavailable classification; correct retained unique count. QC-204, 210. |
| `EQP-ID-DUP` | Two byte-equivalent normalized facts for one ID; `Items.length=2`, `TotalCount=1`. | Succeeds with one fact and total 1; regression gate `QC-EQUIPMENT-DEDUPE-001`. QC-204. |
| `EQP-CONFLICT`, `EQP-POP-MISMATCH` | Same ID with one normalized fact changed; or unique count unequal to envelope total. | Typed invalid-response. QC-204. |
| `FAIL-*` | Abort, offline/network, timeout, invalid JSON, 400/401/403/500/missing procedure, malformed Items/TotalCount; synthetic token/URL canaries in rejected payload. | Typed sanitized failure, no zero/empty coercion, no canary in DOM/log/evidence. QC-201, 207, 212. |
| `RACE-A/B`, `RACE-10` | Deferred three-dataset generations with fixed reverse resolve/reject order; ten-refresh burst. | Only newest complete generation commits; superseded work aborts/ignores; current-generation peak three; no retry. QC-205. |
| `NAV-20` | Deferred `ready` and command, 20 fixed click/Enter/Space activations. | One ordered ready/navigation chain, exact payload, shared busy lock, recovery after rejection. QC-206. |
| `LONG-BIDI` | Eight-digit localized counts, doubled Hebrew/English labels, mixed-direction text, long host-formatted date. | No clipping/scroll/order loss at all viewport/direction/zoom combinations. QC-208, 209. |
| `ANALYTICS-BASE` | Existing two-period monthly data, controls, charts, legends, table, empty/error variants. | Unchanged bodies/semantics; period changes make zero current calls. QC-201, 205, 211. |

## Trust / privileged-effect matrix

| Condition | Bootstrap | Auth URL/fetch | Date/command | UI |
|---|---|---:|---:|---|
| Parent + approved HTTPS host + corresponding approved HTTPS API + private brand | accept once | allowed after binding | allowed; response source/origin must match | normal snapshot |
| Same approved origin, non-parent source | reject | 0 | 0 | sanitized unavailable |
| Parent, unapproved or production HTTP origin | reject | 0 | 0 | sanitized unavailable |
| Accepted parent with HTTP or unapproved HTTPS API address | reject before auth URL construction | 0 | 0 | sanitized unavailable |
| Direct, timeout, fallback, malformed context | unbound | 0 | 0 | sanitized unavailable; late valid context recoverable |
| Plain object with `__trustedHostOrigin` and/or `__hostContextBound` | reject as forged | 0 | 0 | sanitized unavailable |
| Bound context with post-creation mutation attempt | remain original/frozen | only original accepted target | only original accepted host | no privilege escalation |
| Valid request, response from wrong source/origin | bootstrap stays bound; completion rejected | no new unauthorized fetch | mismatched completion has no effect | retain data; recoverable error |

Instrument the entry point before URL construction as well as fetch/host calls; a network-only ledger is insufficient to prove zero privileged attempts. `QC-HOST-BOUNDARY-001` passes only when both forged public-marker variants are rejected before client construction or effects.

## Numeric instrumentation ledger

| Measure | Method | Required result |
|---|---|---|
| Request fan-out | monotonic timestamps at mocked transport entry; generation and in-flight counters | exactly 3; start spread `<=50 ms`; newest-generation peak `<=3`; zero paging/retry |
| Mapper | one warm-up, then at least 5 isolated samples; `performance.now`; decoded bytes via `TextEncoder`; rows/duplicates/unique/output retained | every 10,000-row sample `<=100 ms`; correct count; linear duplicate-heavy behavior |
| Refresh race | fake clock plus generation/abort/commit ledger | generation 10 only; at most current normalized plus one last-good generation |
| Navigation burst | ordered ready/command ledger | exactly one chain from 20 activations; exact `#/Permits/Dashboard` payload |
| DOM | snapshot root plus `querySelectorAll('*')`; equipment subtree separately | total `<=80`; identical equipment subtree count for 1 and 10,000; no fact-list nodes |
| Render | warm once; at least 5 samples per required viewport; mark before state delivery, force layout, finish next animation frame; retain correlated trace | every sample `<=50 ms` at `390x844` and `1440x900` |
| Responsive geometry | rectangles, `scrollWidth/clientWidth`, computed direction, target boxes | no overlap/clipping/x-scroll; controls `>=44x44 CSS px` |
| Accessibility | accessibility tree, tab sequence, announcement transcript, computed contrast/focus | distinct native controls; coherent order; polite non-atomic status; 4.5:1 text, 3:1 large/non-text; visible 3 px focus |

Every numeric row records runtime/browser version, OS, viewport/DPR, clock, fixture ID, decoded bytes, all samples (not just median), DOM counts, request spread/peak, winning generation, and command count. Mapper/render ceilings exclude live network latency.

## Execution matrix and stop rules

- States: loading, validated zero, ready, initial error/unavailable host, stale refresh error, navigation pending/error/recovery.
- Viewports: `320x568`, `390x844`, `768x1024`, `1440x900`; RTL and LTR; desktop and effective-narrow 200% zoom.
- Inputs: pointer, Tab/Shift+Tab, Enter, Space, repeated activation, refresh, period changes, reload, and permitted back/forward.
- Final evidence requires the exact controller preview identity/digest and approved host harness. Missing identity/harness, any need to persist credentials, or any need to mutate the app is `BLOCKED`, not pass.
- The illustrative UI reference is structural guidance only; runtime values and the accepted design specification are canonical.
