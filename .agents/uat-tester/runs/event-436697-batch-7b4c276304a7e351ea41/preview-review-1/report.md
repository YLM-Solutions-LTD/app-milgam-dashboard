# UAT preview review 1

## Verdict: reject

The enabled snapshot and CSP recovery work in the exact preview, but the required privileged permit workflow does not work through the controller-owned real protocol fixture. This prevents release acceptance for T-204/T-205.

## Finding

### `uat:guest-sdk-permit-navigation:missing:v1`

- Severity: high
- Confidence: high
- Tasks/cases: T-203, T-204, T-205 / UAT-206, UAT-209, UAT-210
- Reproduction: load the exact preview inside the supplied controller harness at an approved parent origin; wait for the three current reports; activate the permit metrics 20 times; inspect `controllerHarness.state().effects` and the parent hash.
- Observed: `effects=[]`, parent hash remains unchanged, and no real `Navigate` command reaches GuestBridge. Holding an activation, revoking, and releasing also yields no effect, but this cannot prove response-generation binding because no command entered the bridge.
- Expected: one single-flight `Navigate` command with `{Url:"#/Permits/Dashboard"}`, followed by successful fresh-generation navigation after re-entry.

## Supporting evidence

- Browser: Chromium 140.0.7339.16; viewports 1440×900 and 390×844 RTL.
- Current transport: 3 calls, `{}` bodies, start spread 4.40–4.89 ms, 914,331 decoded fixture bytes. Month change added 0 current calls.
- DOM/CSP: 41 snapshot descendants; 0 inline styles; no horizontal overflow; strict `default/script/style-src 'self'`, `base-uri 'none'`, `object-src 'none'`; no CSP or uncaught page error.
- Recovery: failed three-report refresh retained the last-good snapshot. Direct entry waited 3.3 seconds and made 0 API requests.
- Supporting suites: deterministic UAT 13/13 and site regression 56/56 passed on Node.js 20.20.2. The 10,000-row mapper result was 25.94 ms.
- Evidence: `evidence/observations.json`, `evidence/desktop-rtl.png`, `evidence/phone-rtl.png`, and `run-preview.mjs`.

## Honest limits

The supplied host fixture is RTL-only, so exact hosted LTR was not rerun. The recorded browser `renderMs` includes the runner's 500 ms stabilization delay and is not used as a 50 ms render-budget claim. Full API revocation/re-entry and successful new-generation command binding could not be completed because the deployed guest command integration never reached the bridge. No production write, deploy, Git action, real token, provider call, or lifecycle API call occurred.

