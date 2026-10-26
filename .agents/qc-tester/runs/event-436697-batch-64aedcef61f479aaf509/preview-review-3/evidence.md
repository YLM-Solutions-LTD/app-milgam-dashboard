# Preview review 3 evidence

- Exact preview: `https://c9756759.app-milgam-dashboard.pages.dev`
- Controller head: `50972d0b555115d3b1c9da90f7df0dc4790c6e8e`
- Browser/runtime: Chromium `140.0.7339.16`; Node.js `v20.20.2`
- Inputs: synthetic parent `postMessage` context, token, and API route fixtures only. No real tenant token or live SimplyLog API was used.

## Exact delivered preview

The response enforces `style-src 'self'`. On the exact, unmodified preview, Chromium emitted nine CSP errors during the first analytical render because `app.js` renders chart swatches, donut gradients, stacked-segment widths, and bar widths through inline `style` attributes. The first exact-preview run is preserved in `evidence/browser-results.json`; it also confirms the delivered snapshot flag remains off, so no current-report requests were made. This is the intended default delivery state under T-107, not a fabricated successful live verification.

## Synthetic live-flag diagnostic

To exercise the controller-requested current-report workflows without changing source or deployment, the browser harness intercepted only the same-origin `constants.js` response and changed the live-call flag in memory. This transformed-resource run is diagnostic and is not represented as the exact delivered bytes. Results are in `evidence-live-fixture/browser-results.json`.

- 11/11 scenarios passed at 320, 390, 768, and 1440 px in both RTL and LTR, plus initial failure/retry, stale refresh, and rapid navigation rejection.
- No horizontal overflow or clipped elements were measured; snapshot DOM count remained 41.
- Three current requests used POST `{}` with the synthetic bearer credential; analytical period changes made zero current-report requests.
- Initial three-request failure exposed retry and did not fabricate zeros; retry recovered. Failed refresh retained last-good snapshot data.
- Twenty rapid permit activations produced one `ready` and one exact `Navigate` command. Rejection showed sanitized feedback, unlocked controls, restored surviving-control focus, and produced zero `pageerror` events. `QC-PERMIT-FOCUS-001` is closed for this preview.
- Permit controls had distinct accessible names. All ordinary buttons/selects met the 44 px target check; the off-screen skip link measured 39.78 px high.
- The run emitted 114 CSP console errors across the 11 loaded pages (the same inline-style violation repeated per chart render), confirming that current-snapshot success does not prevent the analytical visualization defect.

## Local deterministic regression

- Site: 55/55 passed (`site-tests.tap`).
- QC: 23/23 passed (`qc-tests.tap`).
- UAT: 13/13 passed (`uat-tests.tap`).

## Finding evidence

`QC-CSP-INLINE-CHARTS-001`: Inspect any successful analytical render. Chromium rejects inline styles created at `app.js` chart rendering sites under the delivered `style-src 'self'` policy. The captured desktop image in `evidence-live-fixture/desktop-ltr.png` shows the category donut absent; segment/bar sizing and swatch styling are likewise CSP-dependent. The browser console contains the exact blocked-style diagnostics. This violates T-105/T-106 preservation of functional analytical charts and T-107 exact-preview verification.

Approved real-host authorization expiry/re-entry remains outside QC evidence because no approved host/harness was supplied; synthetic parent messaging is not claimed as release proof.
