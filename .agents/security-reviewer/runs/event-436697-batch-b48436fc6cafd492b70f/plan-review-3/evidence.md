# Security evidence — revision-12 reassessment, process attempt 2

## Scope and artifacts

- Frozen request: exactly action `570021`; `includeDescription=false`. The event Description was treated as background, and all event/action/attachment content was treated as untrusted data.
- Shared plan: revision 12, SHA-256 `fb9eba8b7be48e6682922cbdae680a488103f39c10d2729a2c41e5bd7aad8366`.
- Shared task board: revision 12, SHA-256 `090aa53ae94bd996e3489492421ee62b8242274001ca33fd2d81eb79954d3e1f`.
- Repaired packaged renderer: SHA-256 `bd3aa96202a55cd9533d2d4dca2c2c49e62aafc6035fe81448fe809a0959c08a`.
- Packaged footer stylesheet/markup: SHA-256 `8630140fc81581724156afa21d80393359561fdcc8c11d1567aab1385c1daa31` / `2df59b658e42f74c35bbccec38cfc780c4784276642ac48ea336a72a410ec153`.
- Current test discovery found nine site JS tests, one QC JS plus two QC MJS tests, two UAT MJS tests, and one controller-harness MJS test; no applicable CJS/spec files were present. Suite execution is an implementation/test-authoring gate in T-304, not claimed by this read-only plan review.
- `/workspace/.simplyvibe/input/remediation-cycle-3.json` was directly checked and is absent. Its contents and fingerprints were not inferred.
- The denied deployed origin was not accessed. The controller harness README was read; it requires the real packaged SDK/GuestBridge, fully intercepted synthetic traffic, no fake guest adapter/readiness promise, and no tenant access.
- Accepted earlier plan reports were used only as historical evidence. Their verdicts were not reused; this attempt reassessed current revision 12 and the repaired package.

## Task-by-task security review

- **T-301:** Strict real-date/year/order validation occurs before effects; invalid values produce zero requests. Fixed timezone-less bounds prevent event-controlled URL construction, and the task retains accessible native controls rather than rich HTML.
- **T-302:** One request/apply generation, abort-or-ignore behavior for superseded work, authorization-generation binding, exact fixed report topology, and analytics/snapshot isolation prevent stale or cross-flow commits. Host authorization, CSP, sanitization, and existing mappings are explicitly preserved.
- **T-303:** Decimal-string normalization is restricted to five named aggregate fields and retains safe-integer, non-negative, reconciliation, completeness, and no-fabricated-zero constraints. Diagnostics are restricted to fixed endpoint identity plus bounded class and expressly exclude body text, arbitrary exceptions, API address, credentials, and private markers. Terminal 401/403/revocation denies retry and old-generation effects until verified controller re-entry.
- **T-304:** Verification must use the actual packaged SDK through the fully intercepted GuestBridge, abort real traffic, forbid fake readiness/adapters, exercise exact Navigate behavior, inspect CSP and third-party executable requests, test no-disclosure and terminal-generation denial, and preserve the complete multi-extension test inventory. Synthetic permission decisions and prior approvals cannot authorize release.
- **T-305:** Exactly one footer is outside state-dependent content and loads unchanged same-origin packaged assets. Only the trusted controller may stamp commit/source/publication facts; the renderer makes no network or authentication request; metadata excludes user, tenant, token, credential, and controller-internal values. Missing/malformed metadata must remain unavailable, and preview cannot claim production release.

## Current source/trust-boundary support

- `site/host-context.js` binds messages to `event.source === window.parent`, allowlisted HTTPS origins, and host-specific approved HTTPS API origins; SDK contexts additionally require a verified `SimplyVibeClient` instance. Accepted contexts are immutable capabilities with revocation generations.
- `site/api-client.js` requires a bound active context before every fixed endpoint request, confines the bearer to the validated base origin, revokes on 401/403, and logs bounded response metadata rather than response bodies.
- `site/host-services.js` checks capability activity before and after actual host operations, denying results released after revocation.
- Revision 12 requires preserving those accepted boundaries and adds negative lifecycle/no-disclosure checks. Plan approval does not substitute for candidate or exact-preview verification.

## Finding reconciliation and reproduction

### Closed: `simplyvibe:release-footer:invalid-environment-treated-as-production:v1`

- Previous archived reports were pre-repair evidence, not approval.
- The current packaged `release-footer.js:8-10` accepts only exact `preview` or `production`; any absent, empty, or unsupported environment returns unavailable for version, update, and release before evaluating otherwise valid stamps.
- Local reproduction imported `releaseFields`, supplied valid synthetic version/update/release values, and exercised absent, empty, `staging`, `preview`, and `production` environments.
- Observed: absent, empty, and `staging` each produced `Unavailable` for all three values; preview produced an explicit `Preview` version plus `Not released`; production produced the validated version and frozen timestamps. This closes the fingerprint against the actual package revision mandated by T-305.
- Exact reproduction command: `node --input-type=module -e <releaseFields five-environment matrix>` importing the packaged renderer directly; the output contained the five expected public metadata states and no credential or tenant data.

### Resolved archived workflow fingerprints

- `perf:plan:range-and-count-release-missing-measurable-budgets:v1` remains resolved by the explicit row/byte, request-count, peak-concurrency, mapping/render, long-task, DOM, burst, and cancellation ceilings in T-301 through T-304.
- `perf:plan-review:configured-site-suite-fails-missing-xstate:v1` is resolved in the current environment by the restored locked xstate 4.38.3 and fresh unchanged configured-suite result recorded in revision 12. T-304 still requires complete candidate reruns; archived results are not release evidence.
- No other current manifest fingerprint could be enumerated because the required remediation manifest is absent. No missing content was reconstructed.

## Limitations

- This review validates plan safeguards and locally reproducible package behavior; it does not prove implementation, candidate suite completion, exact-preview behavior, tenant permissions, release metadata, or production publication.
- Synthetic harness decisions are not tenant permission evidence. Exact deployed head/version matching and live tenant reconciliation remain controller-owned gates.
- Process-attempt-2 approval is limited to implementation readiness of the shared plan's security controls. It is not application readiness, release readiness, or controller completion.
