# Implementer plan — cycle 3 attempt 2

Batch: `event-436697-batch-7b4c276304a7e351ea41`

- T-201: preserve `CURRENT_SNAPSHOT_LIVE_CALLS_ENABLED=true` and the exact three `{}` current-report requests.
- T-202: preserve accepted CSP-safe charts, same-origin runtime assets, and the existing trusted-origin/header policy.
- T-203: verify the controller-supplied `SimplyVibeClient` remains byte-identical, same-origin packaged, loaded before `app.js`, initialized with an exact browser-established parent origin, and used for `ready()` plus exact `Navigate`; ensure API diagnostics and serialized errors retain bounded metadata only and never raw/parsed bodies.
- T-204: run the site, QC, UAT, SDK integrity, and corrected local GuestBridge harness checks; record exact limitations without claiming deployed-preview approval.
- T-205: verify old SDK generations are disposed/revoked and cannot produce command effects after controller-harness session rotation; retain controller-owned deployment, exact-preview, tenant-host, and release boundaries.

Edits are limited to `site/` and this implementer home. No real tenant, provider, deployment, lifecycle, Git, backend, database, or controller-owned artifact changes are authorized.
# Implementation cycle 3 attempt 1 plan

1. Read plan revision 7, all task definitions, remediation inputs, accepted role reports, archived test-authoring finding, operator race/live-host corrections, and corrected harness instructions; inventory all JS/MJS tests.
2. Audit the current `site/` lifecycle against T-201 through T-203 and every cycle-3 fingerprint, including the operator overlap and silent-disconnect regressions.
3. Make only necessary browser-side changes under `site/`, preserving the verified SDK bytes, authorized live flag, strict CSP/origins, RTL/charts, report contracts, and private capability boundary.
4. Run the complete site, QC JS+MJS, UAT MJS, and controller-host-harness suites with exact commands and preserve results in the current run evidence.
5. Produce a schema-valid implementer report tracing every frozen action and shared task to concrete source/behavioral evidence. Mark exact-preview, deployed-tenant permissions, and controller release verification as deferred; do not claim production approval.
