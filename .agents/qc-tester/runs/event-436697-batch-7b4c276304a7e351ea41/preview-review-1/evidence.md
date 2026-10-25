# QC evidence — preview review 1, process attempt 1

- Exact preview: `https://02ea3f16.app-milgam-dashboard.pages.dev`
- Expected head: `3b3f8d4373ff90c2073fb4e884e1fe622a8595a0`
- Browser: Chromium `140.0.7339.16`, 1440×900
- Controller fixture: `https://ylm.ylm.co.il/controller-host-fixture/`, served solely from the supplied read-only fixture directory with the unmodified GuestBridge. API traffic was locally blocked; no real tenant request or token was used.

## Results by shared task

| Task | Result | Evidence |
|---|---|---|
| T-201 | Blocked in exact-preview host path | The document request occurred, but CSP refused the iframe before guest initialization. Therefore zero authenticated snapshot requests occurred through the required SDK path. Delivered `constants.js` exposes the flag as true; local tests pass. |
| T-202 | Blocked in controller-host path | The app never rendered inside the fixture, so controller-host RTL/LTR charts and accessible interactions could not be accepted. The strict delivered CSP is captured in `headers.txt`. |
| T-203 | Local regression pass only | Site 56/56, QC 25/25, UAT 13/13, controller fixture self-tests 2/2. These do not override the deployed integration failure. |
| T-204 | Fail | Exact preview is not frameable by the supplied trusted fixture origin. Console records the enforced `frame-ancestors` refusal; frame URL becomes `chrome-error://chromewebdata/`. |
| T-205 | Fail | Actual SDK initialization, ready, Navigate, held-command revocation, API 401 expiry, stale retention, and fresh-session recovery cannot begin because CSP blocks the guest document. Harness remains generation 1 with zero effects. |

## Reproduction

1. Intercept only `https://ylm.ylm.co.il/controller-host-fixture/**` and fulfill from the supplied fixture files.
2. Navigate to `index.html?preview=https%3A%2F%2F02ea3f16.app-milgam-dashboard.pages.dev`.
3. Wait three seconds and inspect frames, console, and `controllerHarness.state()`.
4. Observe the preview request followed by an enforced `frame-ancestors` refusal, a `chrome-error://chromewebdata/` child frame, zero host effects, and postMessage target-origin warnings.

Expected: preview loads, its packaged SDK initializes, and the unmodified bridge completes readiness so lifecycle cases can run.

Actual: CSP allows `mnt.ylm.co.il`, `simplylog.ylm.co.il`, `milgam.ylm.co.il`, and localhost origins, but not the controller-supplied `https://ylm.ylm.co.il` fixture origin.

Artifacts: `evidence/browser-results.json`, `evidence/controller-harness-desktop.png`, `evidence/headers.txt`, and the four TAP files. No real-host or tenant-permission claim is made; no guest SDK session was fabricated.
