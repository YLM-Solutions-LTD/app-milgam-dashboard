# QC test-authoring evidence — cycle 3, process attempt 1

## Inventory and safety

- Runtime: Node.js `v20.20.2`; npm `10.8.2`.
- Complete discovered QC inventory: `tests/qc/snapshot-qc.test.js`, `tests/qc/sdk-bridge-qc.test.mjs`, and `tests/qc/operator-reentry-race.test.mjs`. Both extensions were included explicitly.
- UAT inventory was also run with `tests/uat/*.test.mjs`; site inventory is configured by `site/package.json`; harness inventory is `/workspace/.simplyvibe/input/controller-host-harness/host-fixture.test.mjs`.
- Fixture: controller-owned GuestBridge at the corrected synthetic `https://milgam.ylm.co.il/controller-host-fixture/` origin, packaged verified SimplyVibeClient, and locally fulfilled synthetic data only. No real tenant token, tenant/API request, provider call, deployment, Git operation, or SimplyLog lifecycle mutation occurred.

## Authoritative commands and totals

From `/workspace/src/apps/milgam-dashboard`, run exactly:

1. `cd site && npm test` — 61 passed, 0 failed, 0 skipped.
2. `node --test tests/qc/*.test.js tests/qc/*.test.mjs` — 30 passed, 0 failed, 0 skipped.
3. `node --test tests/uat/*.test.mjs` — 21 passed, 0 failed, 0 skipped.
4. `node --test /workspace/.simplyvibe/input/controller-host-harness/host-fixture.test.mjs` — 2 passed, 0 failed, 0 skipped.

The four commands were also executed sequentially under `set -e` and completed successfully. The operator race was run six additional times and passed each time after replacing its fixed delay with bounded generation-state polling.

An earlier non-authoritative parallel smoke run occurred while the UAT role was still editing its inventory and before the QC timing hardening; it reported QC 29/30 and UAT 19/21. Direct diagnostic reruns immediately passed QC 30/30 and UAT 21/21. The QC test's fixed 60 ms delay was replaced by polling for generation 3, preserving the failure condition while removing scheduler sensitivity. No application source was changed.

## Current-finding traceability

- `simplyvibe-auth-lifecycle-401-refresh-reuses-rejected-generation-v1` and `uat-authorization-expiry-old-generation-refresh-allowed-v1` (T-203/T-205): behavioral UAT terminal-401 denial plus site bootstrap test prove reconnect on the unchanged source is rejected and sends no additional authenticated work before distinct Ready-session re-entry.
- `perf-preview-fresh-reentry-does-not-restart-snapshot-generation-v1` (T-203/T-205): behavioral UAT verified-bridge tests prove fresh re-entry publishes one new capability and starts exactly the three current snapshot routes; overlapping generation 2/3 re-entry preserves the newest recovery.
- `uat-snapshot-refresh-failure-last-good-cleared-v1` (T-203/T-204/T-205): snapshot controller and UAT tests inject both 500 and 401 after populated data and retain identical last-good data/timestamp as stale.
- `uat-permit-command-singleflight-race-v1` (T-203/T-204/T-205): the full site/UAT/QC inventory verifies synchronous pending acquisition, exact unfiltered Navigate, retained guard through command settlement, zero old-generation effects, and safe focus cleanup. Browser-level 20-activation confirmation remains part of exact-preview review.
- `qc-sdk-reentry-client-disposed-unhandled-v1` (T-203/T-204/T-205): `tests/qc/operator-reentry-race.test.mjs` uses the real packaged client/GuestBridge, overlaps `reenter()` with `queueMicrotask(reenter())`, confirms generation 3 wins, confirms generation 1 is revoked, and captures zero `unhandledRejection`; `tests/uat/verified-host-bridge.uat.test.mjs` additionally covers reset + pending handshake + held command + disposal.
- `unchanged-sdk-session-capability-remint-v1`, `permit-single-flight-cleared-by-revocation-v1`, `legacy-context-remains-independent-authority-v1`, and `host-context-diagnostics-expose-runtime-address-v1` from implementation-planning/3 are covered by the same lifecycle tests, the private capability/trust matrix, revocation tests, and metadata-only diagnostics assertions. Synthetic response markers and runtime API addresses are absent from error serialization/log payloads.

## Shared-task coverage

- T-201: true live-call flag, exact three concurrent `{}` requests, no period coupling.
- T-202: strict CSP/static dependencies, no runtime inline chart styles, accessible exact values and bidi/responsive source contracts.
- T-203: strict adapters, equipment deduplication/conflict rejection, stale last-good state, terminal taint, private host binding, bounded diagnostics and lifecycle races.
- T-204: deterministic preview prerequisites, route/command counts, 10-refresh winner, 10,000-row mapper budget, CSP and responsive/accessibility contracts.
- T-205: real local GuestBridge Ready/Navigate, revocation, zero old effects, fresh-session recovery, overlapping re-entry and handled rejection boundaries.

## Performance evidence

QC 10,000-row equipment mapping trials in the authoritative run stayed below the 100 ms budget (recorded maximum approximately 30.5 ms; 2,083,924 decoded fixture bytes). UAT's independent 10,000-row measurement was approximately 30.4 ms for 1,043,924 decoded bytes. Snapshot UI remains aggregate-only; source contracts prohibit equipment fact-list growth.

## Limitations

- This was test-authoring, not exact deployed-preview review. No exact preview URL/identity was supplied. Computed layout, 200% zoom, actual contrast, focus visibility, screenshots, delivered CSP headers, executable network inventory, browser `pageerror`/console, 50 ms render budget and DOM-node count must be rerun against the controller-selected artifact in preview-review.
- The corrected fixture proves protocol behavior with the actual packaged SDK and real GuestBridge, but synthetic permission decisions are not proof of tenant permission configuration.
