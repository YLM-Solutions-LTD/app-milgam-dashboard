# Implementation approach — cycle 3

Planning only. No `site/`, shared, controller, prior-run, root-role, Git, or provider artifact is changed in this stage.

## Frozen scope

- Batch: `event-436697-batch-7b4c276304a7e351ea41`
- Tasks: `T-201`, `T-202`, `T-203`, `T-204`, `T-205`
- Ordered actions: `536946`, `536949`, `537034`, `537037`, `537040`, `547704`, `547710`, `547713`, `569787`, `569843`
- Browser-only implementation under `site/`; no backend, SQL, database, deployment, provider, issue, Git, or SimplyLog lifecycle work.

## Task plan

### T-201 — preserve enabled snapshot configuration

Keep `CURRENT_SNAPSHOT_LIVE_CALLS_ENABLED=true` through implementation, deterministic tests, exact-preview review, and the controller-owned production deployment. Retain the three concurrent exact `POST .../Search` calls with body `{}` and keep the snapshot independent of analytical period changes. Add/retain a source assertion that fails if the flag becomes false. Do not perform or plan the separately authorized post-release local-only revert during this batch stage.

### T-202 — preserve and prove CSP-safe charts

Retain the local XState dependency, strict `_headers` policy, class-based swatches and magnitude widths, and SVG donut presentation attributes. Add focused DOM assertions for zero/single/mixed/maximum chart fixtures: no affected inline `style`, exact accessible values, non-color labels, and finite class names. The later preview pass records both viewports and RTL/LTR, response headers, console violations, and executable network URLs without relaxing CSP or origins.

### T-203 — repair capability/session lifecycle in browser JavaScript

1. Make the packaged `SimplyVibeClient` private instance and its observed bridge session source the sole production authority. Remove the production legacy `contextFromMessage`/listener path as an authorization constructor (retain legacy JSON only inside the verified SDK protocol), and keep source/origin/API-origin checks plus the module-private brand.
2. Split bootstrap operations into: initial connect; passive use of the current ready client; terminal revoke/taint; and controller-observed fresh session re-entry. Ordinary snapshot refresh, analytical refresh, and permit navigation must never dispose/recreate the client or mint a capability. Only a distinct verified Ready session source can clear an awaiting-fresh-session state.
3. Track SDK session identity, application capability generation, credential taint, and request/command generation together. On 401/403, disconnect, SDK reset/disposal, or authorization event: atomically taint/revoke that generation, abort analytical and snapshot requests, invalidate command settlement, deny cached `ready()`/manual reconnect, and retain last-good snapshot facts/timestamp as stale. Old late work gets zero DOM, network, navigation, or state effects.
4. On a distinct controller session source, dispose the old client once, create one verified client/capability generation, restore analytical work, and automatically initiate exactly one three-request snapshot recovery. Consume expected `SESSION_RESET`/`DISPOSED` rejections at every detached promise boundary without suppressing unrelated errors.
5. Keep snapshot refresh transactional: `loading` with committed data remains rendered; 500, malformed, transport, 401, and 403 failures preserve content and timestamp. Ordinary retry uses the current active generation; authorization retry stays disabled until real re-entry.
6. Acquire permit single-flight synchronously and own it by an immutable operation token until that exact command chain settles. Revocation must invalidate effects but must not clear the guard early. Use the already-ready current private client, send exactly `Navigate` with `{ Url: "#/Permits/Dashboard" }`, reject mismatched/old responses, and restore focus only to a captured connected, enabled, focusable element.
7. Make diagnostics metadata-only. Stop logging context summaries containing `ApiAddress`, remove response/object sanitization as a diagnostic mechanism, and ensure errors serialize only dataset/status/kind/byte-count/item-count codes. Parsed bodies exist only transiently for immediate validation and never enter logs, error fields, retained state, or generic serialization.
8. Extend local deterministic tests for unchanged-session 401/403 taint, repeated refresh/reconnect denial, distinct-session automatic recovery, last-good refresh failures, reverse-order responses, ten-refresh winner, twenty-activation single flight across disposal, packaged SDK integrity/Ready correlation, and absence of sensitive fixture markers in console/error serialization.

### T-204 — corrected exact-preview verification

Controller preview work must serve the supplied unmodified GuestBridge harness only at `https://milgam.ylm.co.il/controller-host-fixture/`, intercept and locally fulfill every host/API response, allow only the exact preview's public static assets, and abort all real tenant traffic. Do not trust the README's obsolete `https://ylm.ylm.co.il` example and do not widen `ALLOWED_HOST_ORIGINS` or `frame-ancestors`.

Run enabled happy, initial failure/retry, populated 500 and 401/403 refresh, stale retention, unchanged-session denial, true re-entry recovery, analytical-period independence, held-command revocation, and permit bursts through the packaged SDK and real bridge. Record 390×844 and 1440×900 RTL/LTR screenshots, keyboard/focus/announcement observations, headers, network/console/page errors, three-request concurrency, decoded bytes, 10,000-row timing, <=80 snapshot nodes, <=50 ms snapshot render, ten-refresh winner, and one command effect from twenty activations.

### T-205 — lifecycle gate and release handoff

Using the same corrected controller-owned local harness, prove old-generation API/command responses have zero effects, an unchanged bridge identity cannot clear 401/403 taint, a distinct session creates one new generation and one automatic recovery load, and mismatched command responses are rejected. Separate local results, exact-preview results, harness authorization results, and controller deployment state. The implementer does not deploy, invoke lifecycle/provider APIs, claim tenant permissions, claim controller completion, or perform the possible later false-flag revert.

## Deterministic implementation checks

- Static syntax and integrity: all application modules; packaged SDK hash against the controller manifest; same-origin scripts; strict `_headers`; flag true; no affected inline chart styles.
- Unit/regression: `site` suite plus controller QC/UAT, without weakening assertions.
- Faithful local protocol: supplied unmodified SDK and GuestBridge with exact Ready/session rotation/command correlation; no injected adapter.
- Browser fixture: corrected origin only, local routing only, real tenant requests blocked, sensitive-marker console capture, lifecycle races, responsive/accessibility/CSP/performance budgets.

Approval of this plan means the changes are implementable. It does not mean the identified source defects are fixed or that preview/release gates passed.
