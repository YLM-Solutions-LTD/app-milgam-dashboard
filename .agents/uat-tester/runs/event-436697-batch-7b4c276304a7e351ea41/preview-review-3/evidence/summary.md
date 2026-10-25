# Evidence summary

- Exact preview: `https://42ad1c5f.app-milgam-dashboard.pages.dev`; supplied exact head: `b138df3040ab4468220a29f595d0caa62920f679`.
- Runtime: Chromium `140.0.7339.16`; Node.js `v20.20.2`; actual controller GuestBridge and deployed packaged SimplyVibeClient; corrected locally intercepted origin `https://milgam.ylm.co.il/controller-host-fixture/`.
- Four viewport/direction runs: 1440×900 and 390×844, RTL and LTR. Each made three exact current calls with 3.69–6.88 ms start spread, 914,331 decoded fixture bytes, 41 snapshot descendants, zero inline styles, no overflow, and no application page errors.
- 401 workflow: last-good content retained, repeated old-session refresh made zero current calls, fresh bridge generation 2 automatically made exactly three current calls, and distinctive error markers did not appear in captured console errors.
- 500 workflow: last-good content retained and ordinary retry recovered.
- Permit burst: one pending command and one final Navigate effect for 20 activations. Revoked held generation 1 had zero effects; fresh generation 2 succeeded once; no `Client disposed` or `SESSION_RESET` page error/unhandled rejection appeared.
- CSP: `default-src 'self'; script-src 'self'; style-src 'self'; ... base-uri 'none'; object-src 'none'; form-action 'none'`. Preview executable requests were same-origin; fixture executables were locally fulfilled. No traffic was aborted because all observed requests were in the exact allowlist; no tenant request/token was used.
- Full inventory: 9 site `.test.js`, QC `snapshot-qc.test.js` plus two `.test.mjs`, two UAT `.test.mjs`, and one controller harness `.test.mjs`.
- Fresh role commands: `node --test tests/uat/*.test.mjs` passed 23/23; `cd /workspace && node --test .simplyvibe/input/controller-host-harness/*.test.mjs` passed 2/2. Prior current-cycle accepted inventory reports record site 61/61 and complete QC JS+MJS 33/33; this UAT role did not substitute a partial glob for either suite.
- Deployed SHA-256 matches the reviewed local `app.js`, `host-bootstrap.js`, `current-snapshot.js`, and packaged SDK; the SDK also matches the controller fixture vendor copy byte-for-byte.
- Raw structured browser evidence and screenshots are in `evidence/observations.json` and the four PNG files.
