# QC test design — implementation planning cycle 1

## Execution contract

- Planning only: no test, preview, host workflow, or deployment was executed, and no executable test was authored.
- Batch actions are acknowledged exactly in controller order: `536946`, `536949`, `537034`, `537037`, `537040`, `547704`, `547710`, `547713`, `569787`, `569843`. `includeDescription` is `false`.
- Deterministic gates use local, synthetic, non-secret clocks, branded host fixtures, API envelopes, aborts, and command responses. They may prove source/state behavior but cannot prove delivered headers, computed layout, browser CSP enforcement, or an approved SimplyLog authorization lifecycle.
- Exact-preview gates run only against the controller-supplied release-candidate identity. Record URL plus commit/site digest, browser/runtime/OS/DPR, viewport, direction/locale, fixture seed and decoded bytes, response headers, console/page/unhandled errors, requests, steps, expected/actual, screenshot/trace paths, and stable fingerprint.
- Approved-host gates require a real approved SimplyLog test host or controller-owned faithful harness. Synthetic parent messaging is diagnostic only; absence of an approved environment is `BLOCKED`, never `PASS`.
- Prior findings are open requirements until fresh evidence closes them: `preview-current-snapshot-disabled-v1`, `preview-csp-blocks-runtime-chart-styles-v1`, `preview-snapshot-performance-validation-blocked-v1`, and `real-host-authorization-lifecycle-unverified-v1`.

## QC-201 — enabled flag and authenticated request boundary

- Tasks/criteria: `T-201 AC1–AC4`; deterministic source/state tests, followed by exact-preview confirmation for delivered flag behavior.
- Assert the release candidate and a mutation-sensitive test set `CURRENT_SNAPSHOT_LIVE_CALLS_ENABLED=true`; fail if false. Inspect the recorded implementation/test evidence to ensure no pre-release reset. Any later false revert requires separate post-release authorization and is outside this run.
- With a privately branded accepted capability, require exactly one concurrent `POST` to each documented current route, body exactly `{}`, with no date, filter, paging, username, location, or administrator field. Peak current-generation concurrency is three. Direct, fallback, malformed, forged-marker/boolean, non-parent, HTTP, unapproved-origin, mutated, or rejected contexts cause zero authenticated effects.
- After readiness and while a refresh is pending, change analytical month/year. Snapshot values, timestamp, status, generation, and request count remain unchanged; analytical behavior remains independent.
- Exact-preview closure for `preview-current-snapshot-disabled-v1` requires visible enabled snapshot data, working refresh/permit controls, and the three observed current requests. Source/config inspection alone cannot close it.

## QC-202 — strict adapters, truthful states, and report dates

- Tasks/criteria: `T-203 AC1–AC2`; deterministic adapter/UI-state automation.
- Events require exactly one `overall`, `headquarters`, and `branches` row, nonnegative integer counts, `open <= total`, and both HQ+branches reconciliations. Permits require one row and keep valid/missing/overdue independent. Dates reach `ToDisplayDate()` byte-for-byte unchanged; no appended `Z`.
- Equipment deduplicates byte-equivalent facts by `EquipmentId` before unique-population reconciliation. Accept supported nullable, inactive, and never-treated facts; reject conflicting duplicates, malformed facts, and incomplete populations atomically. Show unique total and explicit classification unavailable; never infer validity.
- Cover valid zero separately from loading/empty/error. Initial errors show no numeric placeholders; refresh errors retain a coherent last-good snapshot visibly marked stale. Missing procedure, 400/401/403/500, timeout/offline, invalid JSON/envelope/domain data, and partial response failure never fabricate zeros or leak secrets/internal payloads.

## QC-203 — generation races, refresh recovery, and authorization simulations

- Tasks/criteria: `T-203 AC2, AC4`; deterministic state/concurrency automation.
- Reverse-resolve old/new snapshot, analytical date, and command generations. Stale success/failure must not commit, navigate, format a date, clear an error, or unlock newer work. A snapshot commits atomically only after all three reports validate.
- Ten rapid refreshes abort superseded work, allow at most three current-generation requests, trigger no automatic retry, retain at most one last-good generation, and commit only generation 10.
- Simulate replacement, invalidation, 401, and 403 while work is pending. Assert abort/denial, stale retention, safe busy-state cleanup, zero old-generation effects, denial of new privileged work, and recovery only after a fresh branded generation. These simulations are deterministic regression evidence, not approved-host acceptance.

## QC-204 — permit command, burst lock, keyboard, and focus safety

- Tasks/criteria: `T-203 AC2, AC4`; deterministic UI tests plus exact-preview browser checks.
- Activate valid, missing, and overdue controls by click, Enter, and Space. Each orders `ready()` before exactly `executeCommand("Navigate", {Url:"#/Permits/Dashboard"})`; no parameterized URL. Event/equipment metrics never navigate.
- Twenty rapid mixed activations while pending yield one command chain. Controls busy-lock, announce status, unlock on resolve/reject/revocation, retain dashboard data, expose sanitized recoverable failure, and accept a later action.
- Capture the origin control before the first await. On settlement, restore focus only if it remains connected and focusable; separately cover removed, replaced, disabled, and disconnected controls. Require zero console errors, `pageerror`, and unhandled rejections.

## QC-205 — CSP-safe chart DOM and semantic fixtures

- Tasks/criteria: `T-202 AC1–AC3`, `T-203 AC2`; deterministic DOM/semantic checks plus exact-preview visual confirmation.
- Render zero, single-category, mixed, and maximum fixtures for the division donut, swatches, stacks, and bars. Inspect affected elements and mutations: no generated `style` attribute/property, `<style>` injection, remote presentation dependency, or script-built CSS is allowed.
- Require finite reviewed local classes or otherwise CSP-compatible presentation. Exact textual/accessibility labels retain unquantized counts and percentages and name categories; zero has an explicit neutral state, and category/status meaning never depends on color alone.
- Mutation gates fail for an inline gradient, inline swatch color, inline width, missing visual, approximate textual value, absent category name, or unsafe CSP relaxation.

## QC-206 — delivered CSP, executable network, and browser visual enforcement

- Tasks/criteria: `T-202 AC4`, `T-204 AC2`; exact-preview-only browser/header/network gate.
- Capture the document response header. Require at least `default-src 'self'`, `script-src 'self'`, `style-src 'self'`, `object-src 'none'`, and `base-uri 'none'`; reject `unsafe-inline`, `unsafe-eval`, wildcard executable sources, third-party runtime scripts, meta-only substitution, or global bypass.
- Instrument requests before bootstrap and capture console/page/unhandled errors. Require zero relevant CSP violations, zero third-party executable requests, and zero uncaught exceptions.
- For all four analytical fixtures, visually inspect and screenshot the donut, every swatch, stack segment, and bar at `390x844` and `1440x900` in RTL and LTR. No blank donut, missing swatch, policy-caused zero width, clipping, or invisible magnitude is permitted.
- Only this delivered-browser evidence may close `preview-csp-blocks-runtime-chart-styles-v1`.

## QC-207 — responsive, bidi, zoom, visual states, and accessibility

- Tasks/criteria: `T-202 AC2–AC3`, `T-204 AC2`; exact-preview automated geometry/accessibility plus manual keyboard/visual review.
- Exercise loading, ready-zero, ready-nonzero, initial error/retry, stale refresh failure, authorization unavailable, classification unavailable, and permit-navigation failure at `320x568`, `390x844`, `768x1024`, and `1440x900`, RTL and LTR, plus 200% zoom. The two plan-required viewports are release gates; 320/768 are regression coverage.
- Use eight-digit localized counts, double-length labels, long formatted dates, and mixed Hebrew/English. Require no overlap, clipping, hidden controls, fixed-height truncation, or unintended horizontal scroll; snapshot precedes analytics and phone order remains events → permits → equipment.
- Verify native controls, unique accessible names, named regions/headings, polite announcements, explicit label/error association, logical DOM/focus order, persistent visible focus, at least `44x44 CSS px` targets, normal-text contrast `>=4.5:1`, large/non-text/focus contrast `>=3:1`, non-color-only meaning, and no keyboard trap. Dialog checks are recorded N/A unless a dialog exists.

## QC-208 — equipment volume and adapter performance

- Tasks/criteria: `T-203 AC3`, `T-204 AC3`; deterministic benchmark, then exact-preview instrumentation.
- Exercise seeded 0, 1, 1,000, 10,000, duplicate-heavy, nullable, conflicting, and malformed inputs. Record raw/unique rows, decoded bytes, runtime, warm-up method, and at least five isolated mapping durations.
- Each warmed valid 10,000-row run must deduplicate/map within `100 ms` on the recorded runtime. Conflicts/malformed/population mismatch must fail without partial commit. Equipment growth adds no fact-list nodes or retained raw generations.
- The deterministic benchmark is a regression gate; the same artifact/runtime browser measurement is required under QC-209 for exact-preview acceptance.

## QC-209 — preview snapshot performance and interaction bursts

- Tasks/criteria: `T-204 AC1, AC3–AC4`; exact-preview-only browser instrumentation.
- Prove exactly three current requests per accepted load/refresh, start concurrently, have no automatic retry, and remain independent of analytical period changes. Record paths/bodies, start spread, peak concurrency, decoded bytes, and failures.
- After warm-up, collect at least five isolated ready renders at `390x844` and `1440x900`, marking before delivery and closing after one forced layout read plus next animation frame. Every run is `<=50 ms`; snapshot root plus descendants is `<=80` elements.
- A 10,000-row response maps within `100 ms`; one-row and 10,000-row equipment presentations have equal node count. Ten refreshes commit only generation 10; 20 activations produce one pending command chain.
- This gate can close `preview-snapshot-performance-validation-blocked-v1` only after the enabled exact preview supplies complete measurements.

## QC-210 — approved-host request revocation and re-entry

- Tasks/criteria: `T-205 AC1–AC3`; approved real host/controller-owned faithful harness only.
- Start valid generation A with last-good snapshot, then begin snapshot and analytical requests. Expire/revoke authority before settlement and resolve A responses afterward. Assert abort where supported and zero UI, network follow-up, navigation, formatting, or state effects; retain last-good values visibly stale and deny subsequent authenticated work.
- Provide fresh verified authorization B. Assert a new generation, explicit recovery using only B origin/API/token binding, and rejection of all replayed/mutated A responses. Record harness identity and generation evidence without tokens.
- Synthetic unapproved messaging cannot pass this case. Missing approved infrastructure is `BLOCKED` and keeps the release gate open.

## QC-211 — approved-host command response binding

- Tasks/criteria: `T-205 AC1–AC3`; approved host/harness-only command lifecycle test.
- Begin permit navigation in generation A, expire/revoke before the response, then return old, wrong-source, wrong-origin, wrong-correlation, and mismatched-generation responses. Require no navigation/state effect/follow-on privileged work and safe termination of busy state.
- Re-enter as generation B and prove the exact permit command succeeds only for a correctly bound B response. Revoke again during `ready()` and during `executeCommand()` to cover both awaits.
- QC-210 and QC-211 together are the only QC route to close `real-host-authorization-lifecycle-unverified-v1`.

## QC-212 — suites, evidence separation, release honesty, and redaction

- Tasks/criteria: `T-203 AC1`, `T-205 AC4`; deterministic suite/evidence inspection and later evidence aggregation.
- Run focused QC/UAT and existing regression suites with flag=true without weakening assertions. Record exact commands, runtime, counts, duration, failures/skips, fixture sizes, and stable finding dispositions. Fail on forged host, altered body, conflicting duplicate, stale commit, fabricated zero, parameterized permit URL, unsafe focus cleanup, or inline chart style.
- Keep deterministic, exact-preview, approved-host, controller deployment, and skipped/blocked results distinct. Inspect artifacts for tokens, bearer values, credentials, signed URLs, raw event prose, response secrets, or unsupported deployment/provider/lifecycle claims.
- Require controller-owned evidence that flag=true remained through the one production deployment. QC performs no deployment and cannot authorize or perform a post-release false revert. Any missing approved-host gate or deployment provenance is reported honestly and cannot support release approval.

## Acceptance-criterion traceability

| Criterion | Primary QC gate | Evidence class |
|---|---|---|
| `T-201 AC1` flag true in source/tests | QC-201 | Deterministic |
| `T-201 AC2` accepted host starts; rejected host zero calls | QC-201 | Deterministic + preview |
| `T-201 AC3` period change zero snapshot calls | QC-201 | Deterministic + preview |
| `T-201 AC4` no pre-release reset | QC-201, QC-212 | Source/evidence audit |
| `T-202 AC1` no affected inline styles | QC-205 | Deterministic DOM |
| `T-202 AC2` visuals across fixture extremes | QC-205, QC-206 | Deterministic + preview |
| `T-202 AC3` exact accessible, non-color labels | QC-205, QC-207 | Deterministic + preview |
| `T-202 AC4` enforced CSP/no third-party executable | QC-206 | Exact preview only |
| `T-203 AC1` focused/full suites pass flag=true | QC-212 | Deterministic execution |
| `T-203 AC2` all required negative mutations fail | QC-202–QC-205, QC-212 | Deterministic |
| `T-203 AC3` 10k/100 ms/no DOM growth | QC-208, QC-209 | Deterministic + preview |
| `T-203 AC4` refresh/permit burst limits | QC-203, QC-204, QC-209 | Deterministic + preview |
| `T-204 AC1` enabled preview/three requests | QC-201, QC-209 | Exact preview only |
| `T-204 AC2` visible charts/no browser violations | QC-206, QC-207 | Exact preview only |
| `T-204 AC3` DOM/render/map budgets | QC-208, QC-209 | Exact preview required |
| `T-204 AC4` independence and burst limits | QC-209 | Exact preview only |
| `T-205 AC1` zero old-generation effects | QC-210, QC-211 | Approved host only |
| `T-205 AC2` stale retention/new-work denial | QC-210 | Approved host only |
| `T-205 AC3` fresh generation/command binding | QC-210, QC-211 | Approved host only |
| `T-205 AC4` separated truthful release evidence | QC-212 | Evidence audit |

