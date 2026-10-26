# QC evidence — exact preview cycle 3, refresh guard

Target: head `3dc45f69655efd2a2c6b0ad016b1a8cf8f738066` at `https://ef2f1185.app-milgam-dashboard.pages.dev`; Chromium 140.0.7339.16; corrected synthetic host `https://milgam.ylm.co.il/controller-host-fixture/`. The actual packaged SimplyVibeClient and supplied GuestBridge were used. Host and API traffic was fulfilled locally; no tenant token, tenant request, deployment, or lifecycle mutation occurred.

## Identity and complete inventory

SHA-256 matched between deployed and local bytes for HTML, CSS, all application/host modules, and the packaged SDK. The packaged SDK also matched the controller fixture at `ee67f5ae15c70fee8443701b4391946a2275d922acdf9d1797c69dad3c414bf1`.

- `cd site && npm test`: 61/61 pass.
- `node --test tests/qc/*.test.js tests/qc/*.test.mjs`: 34/34 pass; both extensions and `operator-reentry-race.test.mjs` included.
- `node --test tests/uat/*.test.mjs`: 23/23 pass.
- `node --test /workspace/.simplyvibe/input/controller-host-harness/host-fixture.test.mjs`: 2/2 pass.

Runtime: Node.js v20.20.2, npm 10.8.2.

## Exact-preview behavior

`evidence/browser-results.json` and six screenshots cover 320, 390, 768, and 1440 widths, RTL plus desktop/mobile LTR. Every initial load issued exactly three concurrent current POSTs with body `{}`. Period changes issued zero current calls and retained the snapshot. Geometry showed no horizontal overflow or clipped controls, 41 snapshot descendants, zero inline styles, visible charts, distinct permit accessible names, and coherent focus restoration.

The delivered CSP keeps scripts/styles self-only and permits the corrected fixture origin in `frame-ancestors`. All executable requests were the controller fixture or exact-preview same-origin modules; direct access emitted zero API requests. Error-body markers were absent from diagnostics. Expected synthetic 500/401 network failures appeared only as browser resource errors; there were zero page errors or unhandled rejections in every scenario.

Lifecycle and refresh evidence through the packaged SDK and real GuestBridge:

- Ten synchronous activations alternating `#snapshot-refresh` and `#refresh-button` produced exactly three current requests, then re-enabled the control.
- After a 500, ten synchronous stale-retry activations produced exactly three requests. A later healthy retry produced exactly three and recovered, proving lock release after error.
- A 401 produced three failing calls, preserved last-good data, and a forced repeat refresh produced zero. Distinct re-entry advanced to generation 2 and automatically produced exactly three.
- Revocation during a held permit command produced zero Navigate effects and a forced refresh produced zero old-generation calls. Fresh re-entry automatically produced three, and a later refresh produced three, proving lock release after re-entry.
- Twenty permit activations while the real bridge command was held produced one exact `Navigate` to `#/Permits/Dashboard`; controls were disabled while pending, focus returned to the activated control, and no disposed-client/session-reset error escaped.
- The 500 and 401 paths retained the 10,000-equipment last-good snapshot. Marker diagnostics leaked neither raw API body nor internal marker.

These checks close every remediation-cycle-3 fingerprint and `perf-preview-refresh-verification-burst-request-amplification-v1` for the exact preview. The corrected fixture validates protocol behavior, not real tenant permission configuration. Publication and release remain controller-owned.
