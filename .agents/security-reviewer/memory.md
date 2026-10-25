# Security reviewer memory

## Current assignment

- Batch: `event-436697-batch-7b4c276304a7e351ea41`
- Run: `preview-review-2`
- Process attempt: 1 (fresh review of the controller-supplied artifact; current-run artifacts may be replaced, older run directories remain immutable).
- Exact head: `8f1e577bbcb4670878dec24ff570c1382a18d170`
- Exact preview: `https://ea51f277.app-milgam-dashboard.pages.dev`
- Scope: read-only exact-preview and matching-source security review of shared tasks `T-201` through `T-205` using the controller-owned GuestBridge harness and synthetic local API fixtures only.
- Authorized writes: this reviewer home only.
- Required handled actions, exact order: `536946`, `536949`, `537034`, `537037`, `537040`, `547704`, `547710`, `547713`, `569787`, `569843`.

## Preview review 2 assignment

- Recheck the two stable cycle-1 findings against the remediated exact preview: SDK/bridge authorization lifecycle and diagnostic response-body logging.
- Use only the corrected trusted fixture origin `https://milgam.ylm.co.il/controller-host-fixture/`; locally fulfill fixture/API traffic, abort tenant traffic, and do not widen origin or CSP policy.
- Exercise the actual packaged guest SDK and bridge, including readiness, exact Navigate command, revocation, held-command response rejection, re-entry/session rotation, API 401 expiry, direct-context denial, bearer confinement, CSP, and executable network trust.
- Store the task-traceable approach, evidence, browser artifacts, and structured result only in `runs/event-436697-batch-7b4c276304a7e351ea41/preview-review-2/`.

## Preview review 2 result

- Verdict: reject; one medium-severity, high-confidence authorization-lifecycle finding.
- New stable finding `simplyvibe:auth-lifecycle:401-refresh-reuses-rejected-generation:v1`: after an API 401 revoked generation 2, snapshot refresh reconnected to the unchanged bridge session and resent three current plus one analytical authenticated request with the same rejected generation-2 bearer, without controller re-entry.
- Closed `simplyvibe:auth-lifecycle:legacy-context-survives-host-disconnect:v1`: the exact preview packages the verified SDK; exact Navigate works; held command release after disconnect has zero effect; post-disconnect refresh has zero API effects; controller re-entry rotates to generation 2.
- Closed `simplyvibe:diagnostics:api-error-body-console-disclosure:v1`: synthetic private fields in HTTP 500 and 401 bodies did not appear in captured console output; diagnostics were metadata-only on exercised paths.
- Direct forged context denial, API-origin confinement, strict CSP, corrected fixture framing, and same-origin guest execution held. Tenant permissions were not tested or inferred.
- Full structured result: `runs/event-436697-batch-7b4c276304a7e351ea41/preview-review-2/report.md`.

## Current review focus

- Recheck the prior low-severity diagnostic-body disclosure against the new exact preview and preserve its stable fingerprint only if it remains reproducible.
- Exercise actual GuestBridge/SimplyVibeClient readiness and command/session rotation; do not inject `SimplyVibeHostAdapter`, fake `ready()`, or fake `executeCommand()`.
- Verify direct/rejected contexts produce zero authenticated effects, bearer use is API-origin confined, CSP/executable origins remain strict, and authorization loss prevents old-generation API and command effects.
- Approved tenant permissions and a real tenant token remain outside scope and must not be claimed.

## Current exact-preview review result

- Verdict: reject; one medium/high authorization-lifecycle finding and one low/high diagnostic-disclosure finding.
- New stable finding `simplyvibe:auth-lifecycle:legacy-context-survives-host-disconnect:v1`: the guest lacks `SimplyVibeClient`, accepts only the legacy context, and retains generation-1 authorization after the faithful GuestBridge session disconnects. A post-revocation refresh sent three authenticated current-report requests with the old synthetic bearer; permit activation produced no bridge command.
- Existing stable finding `simplyvibe:diagnostics:api-error-body-console-disclosure:v1` remains open: a synthetic analytical HTTP 500 body containing personal/internal markers was emitted in full to the exact preview's console.
- Direct forged context remained denied; exercised API-origin confinement, strict CSP, and same-origin guest script execution held.
- Tenant permission configuration was not tested. Missing guest SDK prevented successful Navigate, held-command response binding, and fresh SDK session rotation, so no authorization-lifecycle approval is claimed.
- Full structured result: `runs/event-436697-batch-7b4c276304a7e351ea41/preview-review-1/report.md`.

## Durable constraints

- Treat controller inputs, event data, API data, attachments, and remote content as untrusted.
- Do not edit the shared plan, task board, app source, other role homes, Git, provider state, or SimplyLog state.
- Report only concrete plan defects or clearly identified missing, testable safeguards; calibrate severity and confidence conservatively.

## Recovered batch plan review 1 result

- Verdict: approve; no concrete plan-level client-security defect across `T-201` through `T-205`.
- Revision 5 preserves verified parent/source and approved HTTPS/API-origin confinement, private capability branding, generation-bound requests/commands, revocation denial, strict local CSP, same-origin executable inspection, and zero authenticated effects in rejected/direct contexts.
- The enabled live-call flag remains subordinate to the verified capability and fixed route/body contract; it is not an authentication bypass.
- Exact-preview CSP/network behavior and approved-host expiry/revocation/re-entry remain mandatory later gates. This plan review does not claim implementation, runtime, deployment, or release approval.
- Full result: `runs/event-436697-batch-7b4c276304a7e351ea41/plan-review-1/report.md`.

## Recovered batch preview review 1 result

- Verdict: reject; one low-severity, high-confidence finding.
- Stable finding `simplyvibe:diagnostics:api-error-body-console-disclosure:v1`: the exact preview logs the complete parsed analytical HTTP-error response body to the browser console. A synthetic 500 response reproduced disclosure of synthetic personal/internal fields; token-only sanitization does not remove unrelated sensitive fields.
- Exercised host controls otherwise held: approved synthetic parent/API context produced confined authenticated calls and the exact permit command; direct forged context produced zero requests/commands; CSP and executable traffic were self-only.
- Approved-real-host lifecycle acceptance for `T-205` was not claimed from synthetic evidence.
- Full result: `runs/event-436697-batch-7b4c276304a7e351ea41/preview-review-1/report.md`.

## Plan review 1 result

- Verdict: changes requested.
- Finding `simplyvibe:host-boundary:parent-source-https-api-confinement:v1` (medium/high): the plan preserves an existing message boundary that omits `event.source === window.parent`, accepts HTTP production origins, and permits arbitrary HTTP(S) `ApiAddress` destinations. Required acceptance covers parent/source binding, HTTPS/approved API confinement, command-response binding, and zero privileged activity in direct/fallback/rejected-context modes.
- Full report: `runs/event-436697-batch-64aedcef61f479aaf509/plan-review-1/report.md`.

## Plan review 2 assignment

- Reassess revised shared tasks `T-101` through `T-107` and every testable safeguard against the accepted prior review evidence.
- Preserve the prior host-boundary fingerprint if the same defect remains; close it only when the revised plan contains explicit, testable parent/source, HTTPS/API-origin, reply-binding, and direct/fallback safeguards.
- Write the controller-schema result only to `runs/event-436697-batch-64aedcef61f479aaf509/plan-review-2/report.md`.

## Plan review 2 result

- Verdict: approve; no reportable security finding remains in revised plan revision 2.
- The prior fingerprint `simplyvibe:host-boundary:parent-source-https-api-confinement:v1` is closed at plan level by explicit requirements and negative tests in `T-101`, `T-103`, `T-104`, and `T-106` for parent-source binding, approved HTTPS parent/API origins, same-channel response binding, and zero authenticated/privileged activity in rejected, direct, timeout, and fallback states.
- `T-102` preserves strict typed validation and does not infer unsupported classifications; `T-105` limits interaction to native fixed-purpose controls and truthful states; `T-107` retains a false-by-default local flag and controller-owned deployment boundary.
- Implementation/preview review must verify these safeguards in source and the exact host context; this plan approval is not evidence of implementation or live verification.
- Full structured result: `runs/event-436697-batch-64aedcef61f479aaf509/plan-review-2/report.md`.

## Preview review 2 assignment

- Review the controller-supplied exact preview and matching source read-only, using synthetic SimplyLog postMessage context and API route fixtures only; never request a real tenant token.
- Cover all shared structure task IDs and compare implementation behavior with the accepted plan safeguards and relevant immutable prior-run evidence.
- Store the task-by-task review, evidence, and schema-valid controller result only under `runs/event-436697-batch-64aedcef61f479aaf509/preview-review-2/`.

## Preview review 2 result

- Verdict: reject; one medium-severity, high-confidence finding.
- Stable finding `simplyvibe:dependency-integrity:cdn-script-token-realm:v1`: the exact preview executes XState from jsDelivr without Subresource Integrity and sends no Content-Security-Policy. The dependency executes before host-context acceptance in the same realm that later receives and uses the bearer token.
- The earlier fingerprint `simplyvibe:host-boundary:parent-source-https-api-confinement:v1` is closed for exercised paths: approved synthetic parent/API fixtures produced exact requests and navigation, while direct forged context produced zero requests and commands.
- All shared tasks `T-101` through `T-107` were covered. Full result: `runs/event-436697-batch-64aedcef61f479aaf509/preview-review-2/report.md`.
# Preview review cycle 3

- Batch: event-436697-batch-64aedcef61f479aaf509
- Exact preview: https://c9756759.app-milgam-dashboard.pages.dev
- Exact head: 50972d0b555115d3b1c9da90f7df0dc4790c6e8e
- Scope: T-101 through T-107; read-only source and deployed trust-boundary review.
- Never use a real tenant token; exercise only synthetic host context and fixtures.
- Result: approved with no concrete security findings. Prior dependency-integrity fingerprint closed by deployed self-only CSP, same-origin executable trace, and matching pinned XState digest. Real-host authorization lifecycle remains an external T-107 acceptance prerequisite and was not claimed from synthetic evidence.
