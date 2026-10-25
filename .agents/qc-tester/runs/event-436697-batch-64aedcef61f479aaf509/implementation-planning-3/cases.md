# QC cases — implementation planning cycle 3

## Execution contract

- Planning only: no case was executed and no executable test was authored.
- Frozen action IDs are exactly `536946`, `536949`, `537034`, `537037`, `537040`; description content is excluded.
- Local automation uses deterministic synthetic tokens, host messages, API envelopes, clocks, aborts, and command responses. Real tenant secrets and live network are forbidden.
- Exact-preview checks require the controller-designated URL and identity. Authorization-expiry acceptance additionally requires an approved real SimplyLog test host or controller-owned faithful harness; absence is `BLOCKED`, never `PASS`.
- Every preview failure record must include URL/commit or digest, response-header capture, browser/version, viewport/DPR, direction/locale, host/harness identity, steps, expected/actual, console/pageerror/unhandledrejection/network evidence, and a stable fingerprint.
- Mandatory open regression gates are `simplyvibe-dependency-integrity-cdn-script-token-realm-v1`, `uat-real-host-authorization-lifecycle-unverified-v1`, and `qc-permit-focus-restoration-rejection-v1`. Previously closed `QC-HOST-BOUNDARY-001` and `QC-EQUIPMENT-DEDUPE-001` remain non-regression gates.

## QC-301 — executable integrity and enforcing CSP

- Tasks: `T-101`, `T-106`, `T-107`; static automation plus exact-preview browser/network inspection.
- Parse the served document and all transitive script/import requests. Assert no remote script, dynamic executable import, worker, or fallback; XState `4.38.3` loads from same-origin bytes whose SHA-256 equals the recorded reviewed digest.
- Capture the document response, not only markup. Require an enforcing `Content-Security-Policy` header with `default-src 'self'`, `script-src 'self'`, `object-src 'none'`, `base-uri 'none'`, minimum approved `connect-src`/embedding policy, and no `unsafe-inline`, `unsafe-eval`, wildcard script source, or third-party executable origin. A meta-only policy fails.
- Instrument requests before bootstrap through authenticated use. Assert zero third-party executable requests and no CSP violations; verify the local dependency is available under cold cache and that a missing local artifact fails closed without CDN fallback.
- Regression gate: reproduce the prior jsDelivr/header inspection. Pass only when the exact preview header and request trace close `simplyvibe-dependency-integrity-cdn-script-token-realm-v1`.

## QC-302 — authenticated transport and zero-effect trust matrix

- Tasks: `T-101`, `T-104`, `T-106`; deterministic automation plus preview diagnostics.
- Accepted immutable branded context: one load initiates exactly three concurrent `POST`s within `50 ms`, to the exact current endpoints, each body exactly `{}`, JSON content type, approved normalized HTTPS API origin, synthetic bearer header, and AbortSignal; peak current-generation requests `<=3`, no paging/retry/filter/date/location/identity fields.
- Inject abort, offline/network, invalid JSON, 400/401/403/500/missing procedure, malformed `Items`, and invalid `TotalCount`. Require typed sanitized errors, no empty-array/zero fabrication, and no token, raw payload, internal URL, or stack leakage.
- Negative matrix: direct/top-level, same-origin non-parent, production HTTP parent, HTTP API, unapproved HTTPS API, timeout/fallback, malformed/rejected context, forged `__trustedHostOrigin`, forged marker plus `__hostContextBound:true`, mutated accepted fields, and mismatched command/date source/origin/correlation/generation. Each must cause zero analytical/snapshot authenticated fetches and zero privileged date/navigation commands.
- Preserve monthly request paths and date-range bodies. A year/month change issues zero current requests.
- Re-run closed `QC-HOST-BOUNDARY-001`; caller-shaped objects remain rejected by the private brand.

## QC-303 — strict report adapters and truthful metrics

- Tasks: `T-102`, `T-105`, `T-106`; deterministic automation.
- Events: accept exactly unique `overall`, `headquarters`, `branches`, raw row total 3, non-negative integer totals/open counts, open `<=` total, present dates, and both HQ+branches reconciliations. Reject missing/duplicate/unknown scope, bad type/date/count, or mismatch atomically.
- Permits: accept exactly one row/row total 1, three independent non-negative integer counts, `AsOf`, and `ValueDate`; never compute or name missing+overdue as invalid certificates.
- Equipment: accept documented nullable facts, active/inactive and never-treated rows. Normalize/deduplicate in one map pass; identical duplicate IDs with raw length 2 and envelope total 1 succeed, conflicting duplicates and unique-population mismatches fail. Render only unique total and explicit unavailable classification.
- Test validated zero separately from loading/error/unavailable. Any invalid response is a sanitized failure and cannot partially commit.
- Re-run closed `QC-EQUIPMENT-DEDUPE-001` to prevent raw-cardinality regression.

## QC-304 — mapper volume, bytes, and retained data

- Tasks: `T-102`, `T-106`, `T-107`; deterministic performance automation.
- Exercise 0, 1, 1,000, and 10,000 equipment rows, nullable variants, and duplicate-heavy inputs. Record runtime/CI, fixture seed, decoded response bytes, raw/unique counts, duration, and retained normalized generations.
- Warm once, then record at least five isolated 10,000-row runs; each maps/deduplicates within `100 ms`, scaling remains linear, and only normalized output plus at most one `lastGoodData` generation remains referenced.
- Mutation gates must fail if classification is inferred, raw length is checked before dedupe, inactive rows are removed, or fact-list DOM is introduced.

## QC-305 — independent state, refresh races, and failure recovery

- Tasks: `T-103`, `T-105`, `T-106`; deterministic state tests plus preview interaction.
- Prove analytics-ready with snapshot loading/error and snapshot-ready while analytics changes. Month/year changes preserve snapshot values, timestamp, status, and node count while issuing zero current requests.
- Reverse-resolve two generations. Prior success/failure cannot mutate the current generation; commit is atomic only after all three reports validate. First failure shows no numbers; failed refresh retains one coherent last-good snapshot marked stale; retry starts exactly three snapshot calls and does not reload analytics.
- Ten-refresh burst aborts superseded work, commits only generation 10, has no retry storm, current-generation peak `<=3`, and retains at most one last-good snapshot.
- Cover reload, browser back/forward where host permits, rapid selection, slow/out-of-order responses, and recovery. Investigate all failed requests, broken assets, console errors, page errors, and unhandled rejections.

## QC-306 — revocation, authorization loss, and fresh re-entry

- Tasks: `T-101`, `T-103`, `T-104`, `T-106`, `T-107`; deterministic automation plus mandatory approved-host/harness UAT evidence.
- Start accepted generation A with analytics, snapshot, date, and navigation work pending. Trigger host invalidation/replacement and separately authenticated 401 and 403. Assert atomic revocation, all A requests aborted, no new bearer request/privileged command, busy locks safely cleared, last-good data retained as stale, and sanitized reauthorization UI.
- Deliver late A fetch success/failure and date/command responses. None may commit, navigate, format, clear current errors, or unlock a newer generation; verify source, origin, correlation, and generation binding.
- Bootstrap fresh approved generation B. Assert recovery uses only B token/API/origin, starts the expected work once, and exact permit command responses bind to B. Mutation or replay of A remains rejected.
- In the approved real host or faithful controller harness, repeat bootstrap → load → expire/revoke → prove zero post-revocation requests/commands with stale data → fresh re-entry → recovery/navigation. Record environment identity and network/command evidence. Synthetic postMessage alone is insufficient and must be labeled diagnostic.
- Regression gate: close `uat-real-host-authorization-lifecycle-unverified-v1` only with this approved-environment evidence.

## QC-307 — dates, permit command locking, and safe focus cleanup

- Tasks: `T-104`, `T-105`, `T-106`; automation plus exact-preview browser tests.
- Pass date-only, no-offset, explicit-offset, and boundary-looking report strings. Assert each reaches `ToDisplayDate` byte-for-byte unchanged, with no appended `Z`, local reinterpretation, or analytical-filter use.
- Activate valid, missing, and overdue with click, Enter, and Space. Each orders `ready()` then exactly `executeCommand("Navigate", {Url:"#/Permits/Dashboard"})`; no filters/counts/query. Event/equipment metrics do not navigate.
- Delay command handling and issue 20 rapid mixed activations. Exactly one ready/Navigate chain runs, permit controls busy-lock and unlock after resolve/reject, snapshot data stays visible, sanitized polite failure persists, and a later activation can succeed.
- Capture the activating element before the first await. Test rejection with the control (a) still connected/focusable, (b) removed, (c) replaced by rerender, and (d) disabled/disconnected by authorization loss. Restore focus only for (a); otherwise leave focus on a safe connected target. Every variant must emit zero `pageerror`, `error`, and `unhandledrejection` events.
- Regression gate: reproduce the previous rejected-command scenario and close `qc-permit-focus-restoration-rejection-v1` only when feedback, unlock, eligible focus restoration, and zero uncaught errors all pass.

## QC-308 — semantic accessibility and state announcements

- Tasks: `T-105`, `T-106`; accessibility scan plus manual keyboard/tree inspection.
- Require a named current-snapshot region/heading before analytics; a polite, non-atomic status; labeled retry; event/equipment descriptions; and three native permit controls with distinct accessible names and destination meaning.
- Keyboard-only traverse skip link, permit controls, period controls, charts, refresh/retry, and recovery. Verify logical DOM/focus order in RTL and LTR, persistent visible focus, `>=44x44 CSS px` targets, and no keyboard trap.
- Check contrast (`>=4.5:1` normal text; `>=3:1` large/non-text/focus), error association, icon alternatives/decorative treatment, non-color-only status, and announcements for loading, stale, navigation failure, reauthorization, and recovery without replacing the whole dashboard.
- If any dialog appears, test focus trap/restore, Escape/close, internal scrolling, and zoom; otherwise record not applicable. Automated scan success alone is insufficient.

## QC-309 — responsive, zoom, RTL/LTR, and visual truthfulness

- Tasks: `T-105`, `T-106`; exact-preview geometry and manual visual review.
- Test loading, ready zero/nonzero, initial error/retry, stale, navigation error, and reauthorization at `320x568`, `390x844`, `768x1024`, and `1440x900`, both RTL and LTR, plus 200% zoom.
- Use eight-digit localized counts, 200%-length labels, long host-formatted dates, and mixed Hebrew/English. Assert no overlap, clipping, hidden controls, fixed-height truncation, or unintended horizontal scroll; text wraps and controls remain operable.
- Phones stack events → permits → equipment in DOM order. Logical alignment/spacing mirrors while metric meaning and focus order do not reverse; only semantically directional icons mirror.
- Compare screenshots with the accepted baseline structure: snapshot precedes selected-month analytics, labels distinguish current from monthly values, classification is textual unavailable, stale/error meaning is visible without color alone, and charts remain present. Record intentional differences; do not claim pixel equality.

## QC-310 — bounded DOM and render timing

- Tasks: `T-105`, `T-106`, `T-107`; browser instrumentation.
- Ready snapshot root plus descendants is `<=80` elements. Equipment subtree node count is identical for 1 and 10,000 normalized rows, with zero fact-list nodes.
- After warm-up, record at least five isolated ready renders at `390x844` and `1440x900`; mark before delivery, force one layout read, and close on the next animation frame. Each is `<=50 ms` on the recorded browser/runtime.
- Record browser/OS/DPR, fixture rows and decoded bytes, scripting/style/layout/paint duration, DOM count, peak current-generation requests, retained generations, and console/network anomalies.

## QC-311 — existing analytical dashboard regression

- Tasks: `T-101`, `T-103`, `T-105`, `T-106`; local regression plus preview manual test.
- Exercise year/month selectors, analytical refresh, charts, legends, tables, chart keyboard labels, skip link, empty/error states, repeated selections, reload, and host-permitted history navigation.
- Assert date-range request bodies, chart semantics, permissions, and accessibility remain unchanged; snapshot never obscures or clears analytics; actions fire once and recover.
- Capture request diffs, screenshots, assets, console, page errors, unhandled rejections, and failed requests. Every unexpected entry requires disposition.

## QC-312 — evidence, redaction, flags, and release honesty

- Tasks: `T-106`, `T-107`; inspection and later full-suite execution.
- Run targeted transport, adapter, lifecycle, host, UI/a11y, integrity, performance, and full regressions. Record exact commands, pass/fail/skip counts, versions, timing/byte/DOM/concurrency/navigation metrics, and stable finding dispositions.
- Verify `CURRENT_SNAPSHOT_LIVE_CALLS_ENABLED` defaults false and affects only snapshot calls. Separate local, exact-preview, and authenticated approved-host results. An unavailable approved host is explicitly blocked/skipped and prevents lifecycle approval.
- Scan source-facing fixtures and QC evidence for bearer/token canaries, signed URLs, raw event prose, response bodies, or private controller content. Confirm errors and screenshots are sanitized.
- Confirm implementation evidence makes no Git, provider, deployment, lifecycle API, backend, SQL, `SearchAllEvents`, or issue-tracker claim. Controller evidence—not local inference—must bind exact preview identity, CSP/header/network proof, dependency digest, and approved-host lifecycle proof.

## Acceptance coverage index

| Task | Cases covering every acceptance criterion |
|---|---|
| `T-101` | QC-301, QC-302, QC-306, QC-311 |
| `T-102` | QC-303, QC-304 |
| `T-103` | QC-305, QC-306, QC-311 |
| `T-104` | QC-302, QC-306, QC-307 |
| `T-105` | QC-303, QC-305, QC-307, QC-308, QC-309, QC-310, QC-311 |
| `T-106` | QC-301 through QC-312, with QC-312 as the full-suite/evidence gate |
| `T-107` | QC-301, QC-304, QC-306, QC-310, QC-312 |

