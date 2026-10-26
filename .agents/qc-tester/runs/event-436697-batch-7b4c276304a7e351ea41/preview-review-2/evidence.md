# QC evidence — preview review 2

Exact preview: `https://ea51f277.app-milgam-dashboard.pages.dev`  
Controller-supplied PR head: `8f1e577bbcb4670878dec24ff570c1382a18d170`  
Browser: Chromium `140.0.7339.16`  
Fixture: actual controller `GuestBridge` at corrected origin `https://milgam.ylm.co.il/controller-host-fixture/`; synthetic host/API responses were fulfilled locally and no tenant traffic was made.

## Results

- At 1440×900 and 390×844 in RTL and LTR, the verified SDK handshake completed, the snapshot rendered 12 total/5 open events, 7 valid/2 missing/1 overdue permits, and 10,000 equipment. Each load issued exactly three current-report POST requests with body `{}`. Changing the analytical month issued zero current-report calls and retained snapshot text.
- All four viewport/direction runs had no horizontal overflow, clipped buttons/selects, console errors, or page errors. Snapshot DOM size was 41 descendants (budget ≤80), with zero inline styles. CSP remained strict (`script-src 'self'; style-src 'self'`), charts were visible, and executable assets were same-origin except the controller fixture's locally fulfilled bridge.
- Same-origin packaged `assets/simplyvibe-client.js` SHA-256 was `ee67f5ae15c70fee8443701b4391946a2275d922acdf9d1797c69dad3c414bf1`, matching the controller manifest.
- Twenty synchronous permit activations while the bridge command was held produced exactly one effect: `Navigate` with `#/Permits/Dashboard`. A rapid refresh burst produced only one additional three-request set and retained correct content. Direct preview access produced zero tenant API requests.
- Synthetic 500 bodies containing `PERSONAL_MARKER_9f3a` and `INTERNAL_MARKER_2d7b` did not appear in console serialization. Browser-generated failed-resource messages contained status only.
- Revocation while a permit command was held produced zero navigation effects, zero new old-generation current requests, and retained last-good data. Re-entry advanced fixture generation 1→2 and a fresh refresh issued three requests.
- Defect: the revocation/re-entry scenario consistently emitted uncaught `Error: Client disposed.` through `pageerror`. This violates the exact-preview requirement for no uncaught exception even though authorization isolation and recovery otherwise succeeded.

Primary machine evidence: `evidence/browser-results.json`. Screenshots: `evidence/desktop-rtl.png`, `desktop-ltr.png`, `mobile-rtl.png`, and `mobile-ltr.png`. Reproduction driver: `browser-qc.mjs`.

## Stable finding

Fingerprint: `qc-sdk-reentry-client-disposed-unhandled-v1`  
Severity: medium  
Confidence: high  
Tasks: `T-203`, `T-204`, `T-205`

Reproduction: load the exact preview in the corrected controller fixture; hold a permit command; activate a permit control; call `controllerHarness.revoke()`; release the held command; then call `controllerHarness.reenter()`. Observe that old-generation effects remain blocked and fresh generation 2 recovers, but Chromium emits an uncaught page error `Error: Client disposed.`.

Expected: SDK disposal/session replacement is handled as a normal authorization-generation transition with no uncaught exception.  
Actual: recovery completes but the disposed prior client's rejection escapes as a page-level uncaught error.
