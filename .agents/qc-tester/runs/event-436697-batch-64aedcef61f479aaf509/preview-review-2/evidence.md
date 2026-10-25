# QC preview evidence — cycle 2

- Exact preview: `https://1de11912.app-milgam-dashboard.pages.dev`
- Controller PR head: `d9ef28ddc6be1d9b6b9fb2f066bcde19c53c193b`
- Preview HTML SHA-256: `cd7a191ca6071bf21ea0be1457ca9e2af93653213fb02b59077e87710434e769`
- Browser: Chromium `140.0.7339.16`, headless, DPR 1
- Harness: HTTPS `localhost:5500` parent with synthetic immutable host payload, synthetic token canary, intercepted HTTPS `localhost:5721` API fixtures, and synthetic `SimplyVibeHostAdapter`; no real tenant token or live API was requested.

## Results

- Browser scenarios: 6 completed: `320x844` RTL, `768x900` LTR, `1440x900` RTL, initial snapshot failure/retry, 20-activation navigation lock/rejection, and analytical-period independence plus stale refresh.
- All 15 successful current-report requests were `POST`, carried body `{}`, and used only the synthetic authorization canary. Initial failure plus retry issued exactly six current requests. Analytical year change issued zero current requests.
- Ready snapshot contained 41 descendant elements at all three sizes, below the 80-element ceiling. `scrollWidth === innerWidth` and no element crossed either viewport edge at all tested sizes.
- All three permit controls had distinct accessible names. Keyboard Enter invoked exact `Navigate` payload `{ Url: "#/Permits/Dashboard" }`. Raw `AsOf` and `ValueDate` reached `ToDisplayDate` unchanged.
- Twenty rapid activations while navigation was pending produced one `ready` call and one `Navigate` call; all permit controls locked busy and unlocked after rejection. The visible sanitized navigation error appeared and snapshot content remained.
- Initial snapshot 500s rendered no snapshot counts, retry recovered. Failed refresh retained the full last-good snapshot and displayed stale/retry text.
- Existing analytical charts remained rendered. Local deterministic regressions passed: site 49/49, QC 20/20, UAT 13/13 on Node.js v20.20.2.
- Expected console entries consisted of synthetic 500 resource failures and request-abort diagnostics during page teardown/state replacement. One unexpected page error is the finding below.

## Finding reproduction

`QC-PERMIT-FOCUS-001` — rejected permit navigation throws during focus restoration.

1. Load the exact preview inside the approved synthetic HTTPS parent and return valid fixtures.
2. Configure `executeCommand` to remain pending.
3. Activate a permit control 20 times; observe exactly one command chain and busy lock.
4. Reject `executeCommand`.
5. Observe sanitized UI feedback and unlocked controls, then the uncaught page error: `TypeError: Cannot read properties of null (reading 'focus')`.

Expected: cleanup restores focus without an uncaught exception after either command resolution or rejection. Actual: the async `finally` path dereferences a cleared event target. Confidence: high. Severity: medium. Tasks: T-104, T-105, T-106.

## Files

- `evidence/browser-results.json` — requests, console, page errors, geometry, accessible names, target sizes, host calls, and scenario results.
- `evidence/phone-rtl.png`, `evidence/tablet-ltr.png`, `evidence/desktop-rtl.png`, `evidence/recovered-phone.png` — exact-preview screenshots.
- `evidence/site-tests.tap`, `evidence/qc-tests.tap`, `evidence/uat-tests.tap` — local deterministic results.
- `browser-qc.cjs` — synthetic Playwright harness and assertions.

