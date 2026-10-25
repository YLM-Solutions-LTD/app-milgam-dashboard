# Implementation-planning cycle 3 evidence

## Accepted inputs

- Frozen input: `.simplyvibe/input/pending-actions.json`; `includeDescription=false`, actions `[536946,536949,537034,537037,537040]` in exact order.
- Shared revision 4: `.agents/shared/plan.md` and `.agents/shared/tasks.json`; all requirements, acceptance criteria, and validation scenarios for `T-101`–`T-107` were read.
- Accepted cycle-2 preview reports: security rejected the runtime jsDelivr/no-CSP boundary; QC rejected asynchronous permit focus restoration; UAT withheld approval because no real approved host/harness existed; performance and UI approved the exercised exact-preview behavior.
- Accepted remediation-planning cycle 3 mapped those fingerprints into revision 4 without changing product scope.

## Read-only source audit

- `site/index.html:41` loads `https://cdn.jsdelivr.net/npm/xstate@4.38.3/dist/xstate.js`; there is no `site/_headers`. This directly matches `simplyvibe-dependency-integrity-cdn-script-token-realm-v1`.
- `site/node_modules/xstate/dist/xstate.js` is locally available as version 4.38.3 with SHA-256 `06f5c308e93a6542c15c13c6bc16ac6841e995538ee48682a13909e298650024`. This is a candidate source only; implementation must digest the copied deployable artifact.
- `site/host-context.js:135-149` permanently ignores messages after the first accepted context. `site/app.js:73-98` replaces runtime facades only on that one callback, and `site/api-client.js` captures base URL/token without a revocation check. There is no authorization-generation invalidation/re-entry orchestration.
- `site/app.js:241-255` reads `event.currentTarget.focus()` after two awaits. The browser rejection report observed the corresponding null dereference. A stable pre-await element reference is required.
- `site/constants.js:21` currently sets `CURRENT_SNAPSHOT_LIVE_CALLS_ENABLED=true`, contrary to the revision-4 false-by-default delivery requirement.
- Existing private branding/deep-freeze, exact transport, dataset adapters, independent snapshot request IDs, responsive aggregate UI, and host-service seam are useful foundations and should be preserved.

## Prior validated behavior to protect

- Local implementation cycle 2: site 49/49, QC 11/11, UAT 13/13; 10,000-row mapping 31.943 ms on Node v20.20.2.
- Exact-preview performance: exactly three concurrent `{}` snapshot calls, 4,070,881 decoded bytes, 41 snapshot elements, no ≥50 ms long task, no overflow, a 10-click refresh burst reduced to one three-call generation, and >20 permit activations reduced to one command chain.
- Exact-preview UI: accepted desktop/mobile RTL and desktop LTR presentation, three accessible permit controls, aggregate-only equipment, raw date delegation, and exact navigation payload.
- Synthetic security checks already proved approved-parent behavior and direct forged-context denial; revision 4 adds executable integrity and revocable lifecycle requirements.

## Stable findings carried as implementation requirements

1. `simplyvibe-dependency-integrity-cdn-script-token-realm-v1` — medium/high; `T-101`, `T-103`, `T-104`, `T-106`, `T-107`.
2. `uat-real-host-authorization-lifecycle-unverified-v1` — medium/high; `T-101`, `T-103`, `T-104`, `T-106`, `T-107`. Local source can implement and deterministically test the lifecycle, but only an approved real host or controller-owned faithful harness can close release acceptance.
3. `qc-permit-focus-restoration-rejection-v1` — medium/high; `T-104`, `T-105`, `T-106`.

No application source, shared/controller artifact, prior run, other role home, Git/provider/deployment state, lifecycle API, backend, SQL, database, or external system was modified.

