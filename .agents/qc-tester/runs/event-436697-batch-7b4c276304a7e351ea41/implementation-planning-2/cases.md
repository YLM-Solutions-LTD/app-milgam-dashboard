# QC implementation-planning cases — cycle 2 attempt 1

## Scope and fixture rules

- Batch: `event-436697-batch-7b4c276304a7e351ea41`; plan revision 6; structure IDs `T-201` through `T-205`.
- Frozen actions, in order: `536946`, `536949`, `537034`, `537037`, `537040`, `547704`, `547710`, `547713`, `569787`, `569843`.
- Planning only. These cases define later deterministic and exact-preview checks; they do not claim a fix, test pass, preview approval, deployment, or production authorization.
- Serve the controller fixture only as `https://milgam.ylm.co.il/controller-host-fixture/`. Fulfill the fixture, GuestBridge, API, and error responses locally with non-secret synthetic data. Abort every unfulfilled host/API request and every real-tenant request.
- Exercise the actual same-origin packaged `SimplyVibeClient` and controller-supplied verified `GuestBridge`; never inject `SimplyVibeHostAdapter`, a fake `ready()`, a fake `executeCommand()`, a forged readiness promise, or a real token.
- The old `https://ylm.ylm.co.il` README example is superseded controller configuration, not an app defect. Do not add it to trusted origins or `frame-ancestors`, and do not relax CSP.
- Record browser/runtime, exact preview identity, viewport, direction, request/effect ledger, console/page errors, screenshots, timings, decoded bytes, DOM counts, and fixture generation for every preview result.

## Planned cases

### QC-221 — authorized snapshot configuration and trust boundary

- Tasks/criteria: `T-201` AC1, AC2, AC4; `T-203` AC5.
- Deterministic: assert `CURRENT_SNAPSHOT_LIVE_CALLS_ENABLED === true`; make a verified, privately branded SDK capability start the snapshot lifecycle. Run a negative matrix covering direct entry, plain host-shaped object, public marker/boolean, wrong `event.source`, HTTP/wrong/unlisted origin, mismatched API origin, mutated/frozen-value attack, replaced/disposed SDK session, and absent token; each must cause zero authenticated calls and zero bridge effects.
- Regression gates: fail if any implementation/test resets the flag, relies on `globalThis.SimplyVibeHostAdapter`, accepts a public trust marker, or weakens existing assertions. Preserve `QC-HOST-BOUNDARY-001` as a non-regression.

### QC-222 — exact current routes, bodies, and concurrency

- Tasks/criteria: `T-201` AC2, AC3; `T-204` AC1, AC6.
- With one verified generation, capture exactly one concurrent POST to each of:
  `/api/Entity/MilgamDashboardCurrentEvents/Search`,
  `/api/Entity/MilgamDashboardCurrentPermits/Search`, and
  `/api/Entity/MilgamDashboardCurrentEquipment/Search`.
  Assert each body is byte-equivalent to `{}`, carries only the synthetic generation token, and contains no dates, filters, pagination, username, or administrator identity. Record start spread/concurrent in-flight maximum and decoded bytes.
- Change analytical year/month repeatedly after snapshot readiness. Assert zero added current calls and unchanged snapshot values/timestamp. Analytical refresh may run independently; snapshot refresh may not alter analytical selection.

### QC-223 — event and permit mapping, dates, navigation payload

- Tasks/criteria: `T-203` AC1, AC2, AC5; `T-204` AC2.
- Exercise valid event scopes plus missing/duplicate/unknown scope, open greater than total, and failed HQ+branches reconciliation. Malformed/partial/error envelopes must render an explicit error or last-good stale state, never fabricated zero.
- Exercise separate valid/missing/overdue permit counts including zeros and large values; never combine missing and overdue as “invalid.” Pass `AsOf`/`ValueDate` unchanged to `ToDisplayDate()` and never append `Z`.
- Activate both certificate controls by pointer, Enter, and Space. After real SDK readiness, assert exactly `Navigate` with `{Url: "#/Permits/Dashboard"}` and no URL parameters. Before readiness/revocation, assert zero command.

### QC-224 — equipment deduplication and classification boundary

- Tasks/criteria: `T-203` AC1, AC2, AC5, AC6.
- Exercise 0, 1, 1,000, 10,000, duplicate-heavy, nullable, malformed, incomplete, and conflicting fixtures. Identical rows deduplicate by `EquipmentId` before population reconciliation; conflicting duplicates, malformed rows, and unique-population/`TotalCount` mismatch reject.
- Preserve inactive facts and all nullable treatment/configuration fields. Assert only total and facts adapter are rendered and classification remains unavailable; no valid/overdue counts are inferred. Preserve `QC-EQUIPMENT-DEDUPE-001` as a non-regression.
- Warm up, then measure at least five 10,000-row mapping/dedup runs; each must be below 100 ms on the recorded runtime. Record fixture bytes and min/median/max. Assert no equipment fact-list DOM growth.

### QC-225 — lifecycle, re-entry, and generation binding

- Tasks/criteria: `T-203` AC2, AC3, AC5, AC7; all `T-205` AC1–AC5.
- Through the real packaged SDK, verify Ready request/source/origin/correlation, private session ownership, and a fresh application capability generation. Hold concurrent analytical/current requests and a permit command; then test SDK disconnect, disposal, timeout, session reset/rotation, replacement, 401, and 403.
- After revocation: abort pending requests, retain last-good UI as stale, deny new work, send zero old-token requests, accept zero late API commits, and accept zero old/mismatched command responses or navigation effects. `controllerHarness.revoke()` followed by refresh and permit activation must leave its effect/request ledgers unchanged.
- Re-enter with a fresh verified harness session. Assert a distinct generation/token, restored current and analytical data, one correctly bound Navigate effect, and rejection of all previous-generation correlations. Separate fixture protocol proof from tenant-permission proof and production status.

### QC-226 — stale, out-of-order, error, retry, and burst behavior

- Tasks/criteria: `T-201` AC2, AC3; `T-203` AC1, AC3, AC5, AC7; `T-204` AC1, AC6; `T-205` AC1, AC2.
- Cover initial loading, empty, initial 400/401/403/500, malformed JSON/envelope, timeout/offline, partial three-route failure, retry success, refresh failure with last-good stale data, and recovery only under an active generation.
- Resolve two refreshes in reverse order; only the newest may commit. In a 10-refresh burst, only generation 10 may commit and earlier requests must abort or have zero effects. Double-click/repeated controls must not duplicate submissions.
- Trigger 20 rapid activations across both permit controls while one command is pending; exactly one command chain/effect is allowed, controls remain disabled while pending, and recovery restores operability.

### QC-227 — diagnostics redaction and bounded errors

- Tasks/criteria: `T-203` AC4, AC5; `T-204` AC3.
- Return synthetic 400/401/403/500 JSON, malformed text, network error messages, and invalid envelopes containing unique markers in names, internal fields, nested objects, authorization-like fields, and raw snippets.
- Capture all console arguments, page errors, `Error` fields, `toJSON`, serialized state, and rendered messages. Assert no raw/parsed body, body snippet, unique marker, credential, signed URL, personal/internal field, or full request error is retained or emitted. Allow only bounded metadata: dataset, status, kind, byte count, item count, and safe fixed text.
- This is a mandatory regression for `api-diagnostics-response-body-disclosure-v1`; token-only redaction is insufficient.

### QC-228 — packaged SDK integrity and real Navigate bridge

- Tasks/criteria: `T-203` AC2, AC3, AC5, AC7; `T-204` AC2; `T-205` AC1, AC3, AC4.
- Static/deterministic: verify the supplied hash-recorded `SimplyVibeClient` is packaged same-origin, initialized with the exact trusted parent origin, and privately passed into host services. Verify no production dependency on a public adapter global and no test-only bridge in app code.
- Browser: inventory executable URLs and globals, observe the real Ready handshake through verified GuestBridge, then both permit controls and the 20-activation burst. Assert exact command/payload, one pending chain, parent hash effect only for an authorized current generation, and no third-party executable request.
- This is a mandatory regression for `verified-guest-sdk-command-path-missing-v1`, `ui-permit-navigation-real-bridge-unavailable-v1`, `perf-preview-missing-real-guest-sdk-blocks-command-efficiency-acceptance-v1`, and `uat-guest-sdk-permit-navigation-missing-v1`.

### QC-229 — strict-CSP chart correctness and visual states

- Tasks/criteria: all `T-202` AC1–AC4; `T-204` AC4.
- Render zero, single-category, mixed, and maximum analytical fixtures. Inspect DOM/source for affected inline `style` attributes/properties and runtime style injection; none are allowed for donut gradients, swatches, stacked widths, or bars.
- Verify division donut, every legend swatch, stacked segment, and bar is visibly nonblank where applicable, remains coherent at zero, and shows exact counts/percentages. Each category must have a text/semantic distinction independent of color.
- Capture delivered CSP and console at both target viewports/directions. Require at least `default-src 'self'`, `script-src 'self'`, `style-src 'self'`, `object-src 'none'`, and `base-uri 'none'`; forbid unsafe-inline, unsafe-eval, wildcard executable sources, third-party executables, and relevant CSP violations.

### QC-230 — responsive and bidirectional layout

- Tasks/criteria: `T-202` AC2–AC4; `T-204` AC4, AC5.
- Required preview matrix: `390×844` and `1440×900`, each RTL and LTR. Add `320×568`, `768×1024`, and 200% browser zoom as stress checks.
- At every matrix point capture full-page and chart close-up screenshots; assert no viewport/content horizontal overflow, overlap, clipping, hidden controls, unreadable mixed-language values, reversed nondirectional icons, or uncontrolled long-list growth. Verify document direction and logical spacing/alignment change correctly at runtime.
- Snapshot ready DOM must contain at most 80 elements and its measured render work must remain below 50 ms, excluding runner stabilization delays. Record method, trials, median/max, and device/browser.

### QC-231 — accessibility, focus, and announcements

- Tasks/criteria: `T-202` AC2, AC3; `T-203` AC1, AC5; `T-204` AC4.
- Keyboard-only traverse skip link, analytical controls, refresh/retry, and both permit controls in RTL/LTR. Assert visible focus, logical focus order, native Enter/Space activation once, usable touch targets, no keyboard trap, and meaningful disabled/loading states.
- Check headings/landmarks, accessible names, button names, chart/group semantics, exact value/category labels, contrast, text at 200% zoom, and error association. Loading, ready, stale, failure, retry, and navigation feedback must be announced without noisy duplicate announcements.
- Reproduce pending command success, rejection, revocation, removed target, and rerendered target. Focus restoration must never throw and occurs only when the original control remains connected/enabled; preserve `QC-PERMIT-FOCUS-001` as a non-regression.

### QC-232 — exact-preview integrated acceptance

- Tasks/criteria: all `T-204` AC1–AC6; `T-205` AC5.
- Run QC-222 through QC-231 against the controller-supplied exact release-candidate preview inside only the corrected local fixture. Record preview URL/identity/site digest, browser, headers, executable URLs, request bodies/counts/timings/bytes, effects, console/page errors, DOM/render/map metrics, screenshots, direction, and all unsupported checks.
- Require visible enabled snapshot data, exact three-call loads, real SDK Navigate, body-free diagnostics, visible CSP-safe charts, no uncaught exception, no real host/API traffic, date independence, newest-generation wins, and single-flight command behavior.
- Evidence must clearly separate deterministic local checks, exact-preview results, faithful-harness lifecycle results, controller deployment status, and skipped/unsupported checks. QC must not claim controller completion or production authorization.

## Acceptance-criterion coverage matrix

| Task | Criteria covered | Primary cases |
|---|---:|---|
| T-201 | AC1–AC4 (4/4) | QC-221, QC-222, QC-226 |
| T-202 | AC1–AC4 (4/4) | QC-229, QC-230, QC-231 |
| T-203 | AC1–AC7 (7/7) | QC-221, QC-223–QC-228, QC-231 |
| T-204 | AC1–AC6 (6/6) | QC-222, QC-223, QC-226–QC-232 |
| T-205 | AC1–AC5 (5/5) | QC-225, QC-228, QC-232 |

Total: 26/26 acceptance criteria traced. No execution occurred in this planning stage.
