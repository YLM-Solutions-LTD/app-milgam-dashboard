# UAT tester memory

## Current assignment

- Batch: `event-436697-batch-7b4c276304a7e351ea41`
- Stage: plan review cycle 1; read-only review of shared plan revision 5 and tasks `T-201` through `T-205`.
- Frozen handled action IDs, exact order: `536946`, `536949`, `537034`, `537037`, `537040`, `547704`, `547710`, `547713`, `569787`, `569843`.
- Authorized writes are confined to this memory and `runs/event-436697-batch-7b4c276304a7e351ea41/plan-review-1/`; no source, shared-plan, preview, Git/provider, deployment, or lifecycle writes.
- Plan review designs task-traceable workflows only. Execution and pass claims require the later exact authorized preview; real authorization lifecycle acceptance additionally requires an approved SimplyLog host or controller-owned faithful harness.
- Plan-review cycle 1 outcome: approved with no plan defect. Stable cases `UAT-201` through `UAT-210` cover every task and cross-task flow; exact-preview and approved-host evidence remain deliberately non-substitutable.
- Final review must mark request/command revocation cases blocked if no approved real host or controller-owned faithful harness is supplied; synthetic messaging cannot close that release gate.

## Current batch

- App: `milgam-dashboard`
- Batch: `event-436697-batch-64aedcef61f479aaf509`
- Stage: test authoring cycle 2
- Frozen handled action IDs: `536946`, `536949`, `537034`, `537037`, `537040`
- Scope: define task-traceable end-to-end acceptance coverage for `T-101` through `T-107` and cross-task workflows; no preview execution occurs during plan review.
- Safety boundary: shared plan, task board, app, preview, planner artifacts, and frozen inputs are read-only. UAT writes remain under `.agents/uat-tester/`.

## Durable UAT constraints

- Validate current-snapshot behavior separately from monthly analytics.
- Treat authenticated host integration as proven only when exercised in an approved host or controller-provided host harness against the exact preview.
- Never turn unavailable, malformed, permission-denied, or failed report data into zero.
- Permit controls navigate only to `#/Permits/Dashboard`; equipment validity remains explicitly unavailable.
- Mutating production workflows are out of scope; the planned dashboard interactions are read-only apart from host navigation.
- Preserve stable acceptance IDs `UAT-001` through `UAT-012` across plan revisions; extend their steps rather than renumbering them.
- Final review must record the numeric evidence introduced in plan revision 2: three-call start spread, 0/1/1,000/10,000-row mapper measurements and decoded bytes, 10-refresh newest-generation behavior, 20-activation command count, snapshot DOM cardinality, and phone/desktop render timings.
- Trust-boundary acceptance requires negative proof that non-parent, HTTP, unapproved API, direct, timeout, fallback, malformed, and mismatched-response contexts cause zero authenticated requests and privileged commands.
# Current assignment

- Batch: `event-436697-batch-64aedcef61f479aaf509`
- Stage: `test-authoring-2`
- Scope: deterministic local UAT authoring and execution with synthetic host context/API fixtures; no live host, tenant token, network, or application-source changes.
- Owned paths: `tests/uat/`, this memory, the current run folder, and `.agents/uat-tester/tmp/` only.

## Test-authoring result

- Attempt 2 made T-101 through T-107 traceability executable and strengthened raw-date, zero-effect trust, and identical-ID deduplication coverage.
- Synthetic UAT: 12/13 passed; regression: 47/47 passed on Node.js 20.20.2.
- Finding `uat:equipment-identical-dedup:envelope-cardinality:v1`: envelope cardinality rejects identical duplicate facts before required EquipmentId deduplication. Verdict: reject.
- Browser, exact-preview, and approved live-host integration were not supplied, executed, or claimed.

## Test-authoring cycle 2 intent

- Re-run deterministic, synthetic-only UAT after implementation cycle 2 and retain stable task and case IDs.
- Verify remediation of `uat:equipment-identical-dedup:envelope-cardinality:v1` without weakening trust-boundary, date-range, unavailable-state, or permit-navigation acceptance.
- Write evidence only under `.agents/uat-tester/runs/event-436697-batch-64aedcef61f479aaf509/test-authoring-2/` and executable tests only under `tests/uat/`.

## Test-authoring cycle 2 result

- Verdict: approve for deterministic test authoring.
- Synthetic UAT: 13/13 passed; app regression: 49/49 passed on Node.js v20.20.2.
- Closed regression fingerprint `uat:equipment-identical-dedup:envelope-cardinality:v1`; public-marker forgery and accepted-context immutability are also directly covered.
- Exact-preview browser, viewport/render, and approved live-host integration remain unexecuted because no authorized preview or host harness was supplied.

## Current assignment — preview review cycle 2

- Exact authorized preview: `https://1de11912.app-milgam-dashboard.pages.dev`.
- Exact PR head: `d9ef28ddc6be1d9b6b9fb2f066bcde19c53c193b`.
- Execute UAT-001 through UAT-012 with Playwright, synthetic SimplyLog parent messaging, and intercepted API fixtures only; never request or use a real tenant token.
- Standalone synthetic-host results are diagnostic. Real SimplyLog host integration must be reported blocked unless an approved real host/harness is available.
- Write cycle-2 preview evidence only under `.agents/uat-tester/runs/event-436697-batch-64aedcef61f479aaf509/preview-review-2/`; all prior runs are immutable.

## Preview review cycle 2 result

- Verdict: reject because required real-host authorization lifecycle evidence is blocked; stable fingerprint `uat:real-host-authorization-lifecycle:unverified:v1`.
- Exact-preview synthetic workflows passed in Chromium 140 at 390×844 and 1440×900, RTL/LTR, with 41 snapshot descendants, no horizontal overflow, exact three-call `{}` transport, stable month independence, raw dates, exact permit navigation, and successful first-error retry.
- Direct timeout produced zero API calls. Supporting local suites passed 13/13 UAT and 49/49 site assertions.
- Core deployed artifact hashes matched the reviewed local files. No real tenant token, production write, deploy, provider action, lifecycle call, or Git action occurred.

## Current assignment — test authoring cycle 3

- Batch: `event-436697-batch-64aedcef61f479aaf509`; frozen handled action IDs, in exact order: `536946`, `536949`, `537034`, `537037`, `537040`.
- Re-run deterministic UAT for `T-101` through `T-107` after implementation cycle 3 using synthetic `postMessage` context and API fixtures only; never use a real tenant token or make external writes.
- Own only `tests/uat/`, this memory, and `.agents/uat-tester/runs/event-436697-batch-64aedcef61f479aaf509/test-authoring-3/`; shared inputs, app source, preview, other role homes, Git, and controller state remain read-only.
- Preserve stable acceptance and finding fingerprints where applicable. Synthetic context is diagnostic and cannot prove real-host integration.

## Test-authoring cycle 3 result

- Verdict: approve for deterministic test authoring. Synthetic UAT passed 13/13 and app regression passed 55/55 on Node.js v20.20.2.
- Cycle-3 coverage adds authorization revocation/late-result denial/fresh generation re-entry, guarded permit cleanup, and flag-false/local-XState/CSP source contracts while retaining `UAT-001` through `UAT-012` and `T-101` through `T-107` traceability.
- No exact preview/browser or approved real-host harness was supplied. Runtime CSP/network/deployed-byte checks, DOM focus variants, and real authorization expiry/re-entry remain unexecuted and are not claimed.

## Current assignment — preview review cycle 3

- Exact authorized preview: `https://c9756759.app-milgam-dashboard.pages.dev`.
- Exact head: `50972d0b555115d3b1c9da90f7df0dc4790c6e8e`.
- Execute stable `UAT-001` through `UAT-012` for tasks `T-101` through `T-107` using Playwright synthetic SimplyLog `postMessage` context and intercepted API fixtures only; never use a real tenant token.
- Treat synthetic context as diagnostic and apply `T-107` honestly: real-host authorization lifecycle remains unproved without an approved host harness.
- Own only this memory and `.agents/uat-tester/runs/event-436697-batch-64aedcef61f479aaf509/preview-review-3/`; app, tests, shared artifacts, prior runs, other role homes, Git, preview, provider state, and controller state remain read-only.

## Preview review cycle 3 result

- Verdict: reject. Exact preview ships `CURRENT_SNAPSHOT_LIVE_CALLS_ENABLED=false`; accepted synthetic context renders analytics but shows the snapshot disabled, disables refresh, and issues zero current-report requests. Stable finding: `uat:exact-preview-current-snapshot-disabled:v1`.
- Deployed CSP and executable-network evidence pass: `script-src 'self'`, all observed executable requests same-origin, and deployed/local XState SHA-256 match. Direct access produces zero API calls; disabled-state RTL/LTR layouts do not overflow.
- Supporting suites pass 13/13 UAT and 55/55 site assertions, but exact-preview snapshot workflows remain unexecutable and cannot be replaced by local evidence.
- Stable real-host lifecycle finding `uat:real-host-authorization-lifecycle:unverified:v1` remains open because no approved SimplyLog host or faithful controller harness was supplied.

## Current assignment — recovered batch test authoring cycle 1

- Batch: `event-436697-batch-7b4c276304a7e351ea41`; tasks `T-201` through `T-205`; frozen action IDs `536946`, `536949`, `537034`, `537037`, `537040`, `547704`, `547710`, `547713`, `569787`, `569843`.
- Update and execute deterministic UAT only under `tests/uat/`, using synthetic `postMessage` capability context and local API fixtures; never use real tenant credentials or external writes.
- The recovered release requires `CURRENT_SNAPSHOT_LIVE_CALLS_ENABLED=true` and CSP-safe analytical chart presentation. Exact-preview evidence (`T-204`) and approved-host authorization lifecycle evidence (`T-205`) remain later, non-substitutable gates.
- Own only `tests/uat/`, this memory, and `.agents/uat-tester/runs/event-436697-batch-7b4c276304a7e351ea41/test-authoring-1/`; all application/shared/prior-run/other-role/controller artifacts remain read-only.

## Recovered batch test-authoring cycle 1 result

- Verdict: approve. Synthetic deterministic UAT passed 13/13 and app regression passed 56/56 on Node.js v20.20.2.
- Coverage now traces `UAT-201`–`UAT-210` to `T-201`–`T-205`, asserts the authorized flag is true, and protects CSP-safe chart source contracts alongside snapshot/trust/recovery behavior.
- Exact-preview browser acceptance and approved real-host authorization lifecycle acceptance were unavailable and remain unclaimed later-stage gates.

## Current assignment — recovered batch preview review cycle 1

- Exact authorized preview: `https://275c4e6f.app-milgam-dashboard.pages.dev`; exact head: `ea974089c5cfa402a44b99606514721807b49dd8`.
- Execute `UAT-201` through `UAT-210` for `T-201` through `T-205` using Playwright, synthetic SimplyLog parent messaging, and intercepted non-secret API fixtures only.
- Own only this memory and `runs/event-436697-batch-7b4c276304a7e351ea41/preview-review-1/`; app source, shared artifacts, prior runs, tests, Git/provider/deployment/controller state remain read-only.
- Synthetic host behavior can support exact-preview diagnostics but cannot pass `UAT-208` or `UAT-209`; those remain blocked unless an approved real SimplyLog host or controller-owned faithful harness is supplied.
