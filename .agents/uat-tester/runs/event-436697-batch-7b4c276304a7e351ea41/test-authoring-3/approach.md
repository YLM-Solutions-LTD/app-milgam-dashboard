# UAT approach — test authoring cycle 3

Run the stable `UAT-201`–`UAT-210` workflows locally with synthetic, non-secret API fixtures and the controller-supplied SDK/GuestBridge. Add focused regression assertions for the three prior UAT findings: preserve last-good content and timestamp on 500/401, deny all further old-generation traffic after 401 until a distinct verified session exists, and acquire the permit-navigation guard synchronously. Cross-check fresh bridge rotation and expected disposed-client rejection without any uncaught test-process error.

No exact preview is authorized at this stage. Browser geometry, deployed CSP/network behavior, and controller release remain final-review responsibilities.
# Attempt 1 recovery validation

This run is active for the recovered controller attempt. Re-read shared plan revision 7 and every current cycle-3 fingerprint, inspect the complete test inventory, strengthen only `tests/uat/` where behavioral UAT coverage is missing, and execute the site, complete QC (`.js` and `.mjs`), complete UAT, and controller-host-harness suites. The packaged verified SimplyVibeClient and real GuestBridge must carry all synthetic host behavior; tenant traffic is forbidden.
