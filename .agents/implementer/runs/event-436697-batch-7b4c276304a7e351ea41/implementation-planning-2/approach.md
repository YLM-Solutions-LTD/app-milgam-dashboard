# Implementation-planning cycle 2 approach

Status: ready for controller-approved implementation; planning only.

Frozen action IDs, in controller order: `536946`, `536949`, `537034`, `537037`, `537040`, `547704`, `547710`, `547713`, `569787`, `569843`.

## Evidence-derived baseline

- `CURRENT_SNAPSHOT_LIVE_CALLS_ENABLED` is already `true`; retain it.
- Strict CSP already includes `https://milgam.ylm.co.il` in `frame-ancestors`, and affected charts already avoid inline styles; do not widen or relax CSP.
- `index.html` does not load `SimplyVibeClient`; `host-services.js` instead defaults to the invented public `globalThis.SimplyVibeHostAdapter`.
- `host-context.js` independently authorizes legacy Context messages, so GuestBridge disconnect cannot revoke that capability.
- `api-client.js` logs and stores sanitized-but-complete parsed/raw response bodies and invalid-body snippets. Token redaction does not make personal/internal fields safe.
- The controller-supplied SDK bytes hash to `ee67f5ae15c70fee8443701b4391946a2275d922acdf9d1797c69dad3c414bf1`, matching `manifest.json` case-insensitively.
- The authoritative correction is `https://milgam.ylm.co.il/controller-host-fixture/`; the README and its Node fixture test still spell the earlier `https://ylm.ylm.co.il` example. Treat that discrepancy as controller-owned fixture configuration and do not compensate in application origins/CSP.

## Task-ID implementation plan

### T-201 — preserve enabled snapshots

1. Leave `site/constants.js` at `CURRENT_SNAPSHOT_LIVE_CALLS_ENABLED = true` and keep the flag scoped only to current-snapshot startup.
2. Preserve exactly three concurrent current `POST` requests with body `{}` after a newly verified SDK capability is accepted. No requests may start from direct entry, a legacy-only Context, a failed handshake, or a revoked generation.
3. Keep analytical period transitions independent of snapshot state and request counts.
4. Update regression assertions only to reflect the new SDK authority; do not weaken route/body, concurrency, stale-response, or flag assertions.

### T-202 — preserve strict-CSP chart rendering

1. Retain the current local XState asset, finite CSS magnitude/color classes, SVG presentation attributes, exact accessible labels, and no `style=`/`.style` writes.
2. Preserve `_headers` with `script-src 'self'`, `style-src 'self'`, `object-src 'none'`, `base-uri 'none'`, existing API origins, and existing frame ancestors including `https://milgam.ylm.co.il`; do not add `https://ylm.ylm.co.il`, `unsafe-inline`, `unsafe-eval`, wildcards, or remote scripts.
3. Extend static tests so the new SDK is same-origin and the existing chart/CSP constraints remain intact.

### T-203 — package SDK, bind lifecycle, and remove body diagnostics

1. Copy the exact verified controller artifact to `site/assets/simplyvibe-client.js`; record and test its SHA-256. Load it as a same-origin classic script in `index.html` before the module application bootstrap.
2. Replace the `globalThis.SimplyVibeHostAdapter` default with a module-private SDK session passed explicitly into host services. Resolve the exact parent origin only from an independently trusted source: parse `document.referrer` to an exact origin and require membership in `ALLOWED_HOST_ORIGINS`; fail closed for missing, malformed, non-HTTPS deployed, or unapproved values. Do not learn trust from a message or caller boolean.
3. Construct one `SimplyVibeClient({hostOrigin, timeoutMs})`, register any SDK handlers before awaiting `ready()`, and accept API authority only from the SDK `ready()` result after approved API-origin and token validation. Keep legacy Context parsing only as compatibility input/correlation; it cannot brand a capability or remain authoritative without the live SDK session.
4. Refactor the private binding in `host-context.js` so only an unexported SDK acceptance path can create the immutable branded capability. Keep the brand in module-private storage, not `__trustedHostOrigin`, `__hostContextBound`, a public adapter, or caller-supplied booleans.
5. Introduce an application host-session coordinator in `app.js` (or one focused browser module) that owns client creation, readiness, current capability, generation, explicit reconnect, and disposal. On `SESSION_RESET`, `DISPOSED`, handshake `TIMEOUT`, replacement, parent disconnect/control revocation, or API `401/403`: revoke only the matching generation, abort snapshot and analytical requests, invalidate pending commands, retain last-good snapshot as stale, transition analytical state to awaiting authorization, and deny new authenticated work.
6. On explicit re-entry/reconnect, dispose the prior client and subscriptions, create a fresh SDK instance and capability generation, then reload under the new verified context. Ignore late API/date/command results whose captured capability generation is no longer current. Dispose SDK, legacy listener, subscriptions, requests, and state service on `pagehide`; recreate on supported page restore rather than reusing disposed state.
7. Make `createHostServices` require the private client/session explicitly. `ready()` and `executeCommand()` must check generation both before and after awaiting. Keep the exact `Navigate` payload, omit inherited event context for this user action, enforce one pending command chain across 20 rapid activations, never auto-retry a timed-out mutation, and keep captured-element focus cleanup.
8. Preserve raw report dates into the established `ToDisplayDate` boundary. If the verified SDK has no date method, use only the already-approved injected display-date boundary tied to the same generation; do not turn legacy authority into SDK readiness.
9. Redesign `DashboardRequestError` as metadata-only: `kind`, `dataset`, numeric `status`, bounded `bodyBytes`/`itemCount` where available, safe fixed `detail`, and safe message. Do not attach, serialize, log, or retain parsed/raw bodies or snippets. Parse only locally for immediate envelope validation, then release references. Console output may include bounded metadata but never body fields, personal/internal markers, credentials, endpoints containing secrets, full contexts, or full serialized errors.
10. Update deterministic site/QC/UAT tests for real SDK bootstrap and integrity, no injected adapter, exact origin/referrer fail-closed behavior, legacy-only zero effects, session rotation/disposal/re-entry, 401/403 revocation, old-generation late-result suppression, exact command single-flight, metadata-only diagnostics, and existing data/UI contracts. Replace old tests that expect error bodies with assertions that distinctive synthetic markers never appear in logs, error properties, JSON serialization, or retained state.

### T-204 — corrected exact-preview verification handoff

1. Do not implement deployment in this role. Prepare the source and deterministic checks so a later controller stage can serve the fixture at `https://milgam.ylm.co.il/controller-host-fixture/`, fulfill all fixture/API traffic locally, permit only the exact preview assets, and abort real tenant traffic.
2. The controller-run browser matrix must verify packaged SDK presence/hash, real Ready handshake without injection, three snapshot routes/body/concurrency, analytical independence, initial/retry/stale states, both exact permit controls, 20-click single-flight, and error-body marker absence.
3. Re-run 390×844 and 1440×900 RTL/LTR screenshots, keyboard/focus/announcements, overflow, visible donut/swatches/stacks/bars, strict headers, console/page errors, executable URLs, snapshot node count, render budget, 10,000-row mapping, decoded bytes, and 10-refresh winner.

### T-205 — faithful lifecycle acceptance and release handoff

1. Through the corrected controller-owned GuestBridge harness, hold requests and a Navigate command, revoke/session-rotate, settle old work, and prove zero old-token requests, commits, navigation, or other effects; last-good snapshot remains stale and new work is denied.
2. Re-enter with a fresh real SDK generation and prove data recovery plus exactly one correctly bound Navigate effect; mismatched/old command responses remain ignored.
3. Keep the true live-call flag through preview and the single controller-owned production deployment. Separate local, preview, lifecycle, and deployment evidence. Any post-success false revert is a separately authorized local-only controller action and is not part of implementation.

## Planned verification commands and evidence

- `node --check` for changed JavaScript modules and the packaged SDK.
- `cd site && npm test` for browser-module regression.
- `node --test tests/qc/*.test.js` and `node --test tests/uat/*.test.mjs` without weakening assertions.
- `node --test .simplyvibe/input/controller-host-harness/host-fixture.test.mjs` only after the controller fixture itself is corrected or invoked with an origin override; do not edit it from the implementer role.
- `sha256sum site/assets/simplyvibe-client.js` compared with the supplied manifest.
- Static searches for `SimplyVibeHostAdapter`, response `body`/`bodySnippet` diagnostics, inline style writes, remote executable sources, and forbidden CSP relaxations.
- Record runtime/browser versions, pass/fail totals, fixture rows/decoded bytes, mapping/render timings, DOM nodes, request concurrency/counts, command count, and honest skips.

## Completion boundary

Source implementation may be reported ready only after local checks pass. T-204/T-205 preview and lifecycle acceptance remain controller-run gates; no implementer result may claim deployment, release approval, tenant permission proof, or lifecycle completion.
