# QC evidence — exact preview cycle 3

Target: head `b138df3040ab4468220a29f595d0caa62920f679` at `https://42ad1c5f.app-milgam-dashboard.pages.dev`; Chromium 140.0.7339.16; corrected synthetic host `https://milgam.ylm.co.il/controller-host-fixture/`. Fixture and API traffic was intercepted locally. No tenant token, tenant request, deployment, or lifecycle mutation occurred.

## Identity and inventory

SHA-256 matched deployed/local for the HTML, CSS, application modules, host modules, and packaged client. The packaged client also matched the controller client (`ee67f5ae15c70fee8443701b4391946a2275d922acdf9d1797c69dad3c414bf1`).

- `cd site && npm test`: 61/61 pass.
- `node --test tests/qc/*.test.js tests/qc/*.test.mjs`: 33/33 pass; both extensions and `operator-reentry-race.test.mjs` included.
- `node --test tests/uat/*.test.mjs`: first execution, run concurrently with other suites, had 22/23 pass because UAT-201's `<50 ms` call-start spread assertion failed under contention; the immediate required standalone rerun passed 23/23 in 518 ms. The initial failure is preserved.
- `cd /workspace/.simplyvibe/input/controller-host-harness && node --test host-fixture.test.mjs`: 2/2 pass.

Runtime: Node.js v20.20.2, npm 10.8.2.

## Exact-preview checks

`evidence/browser-results.json` and six screenshots cover 320, 390, 768, and 1440 widths, RTL plus desktop/mobile LTR. Each load issued exactly three current POSTs with `{}`; period change issued zero current calls and retained the snapshot. At 390/768/1440 there was no overflow. At 320, `scrollWidth === innerWidth` (the 16 px client-width difference is the vertical scrollbar), with no clipped controls. Snapshot DOM count was 41, affected inline styles were zero, SVG charts and accessible numeric text were visible, focus names were distinct, and page errors were zero.

Delivered CSP retained self-only scripts/styles. No third-party executable request occurred, direct access emitted zero API requests, and synthetic error-body markers did not appear in console/error serialization.

Lifecycle evidence through the packaged SDK and real GuestBridge:

- HTTP 500 retained the complete last-good snapshot with error/stale status.
- HTTP 401 made three failing calls, retained last-good data, and repeat refresh made zero calls; distinct re-entry advanced to generation 2 and automatically made three calls.
- Bridge revoke during a pending real permit command produced zero Navigate effects; immediate forced refresh made zero old-generation calls; re-entry recovered with three new-generation calls.
- Twenty permit activations while held produced one exact `Navigate` for `#/Permits/Dashboard`, kept controls disabled while pending, restored focus, and emitted no page error.
- Ten forced refresh attempts coalesced to one additional three-call load with final snapshot intact.

Fresh evidence closes `simplyvibe-auth-lifecycle-401-refresh-reuses-rejected-generation-v1`, `perf-preview-fresh-reentry-does-not-restart-snapshot-generation-v1`, `uat-snapshot-refresh-failure-last-good-cleared-v1`, `uat-authorization-expiry-old-generation-refresh-allowed-v1`, `uat-permit-command-singleflight-race-v1`, `qc-sdk-reentry-client-disposed-unhandled-v1`, `qc-revoke-refresh-race-issues-old-generation-requests-v1`, and `perf-preview-revoked-bridge-refresh-emits-old-generation-requests-v1`.

The corrected fixture validates protocol behavior, not real tenant permissions. Release remains controller-owned.

