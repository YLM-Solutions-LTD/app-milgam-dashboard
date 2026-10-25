# UI preview evidence — process attempt 1

Exact candidate: controller-supplied commit `3b3f8d4373ff90c2073fb4e884e1fe622a8595a0` at `https://02ea3f16.app-milgam-dashboard.pages.dev`.

## Observable result

- Chromium `140.0.7339.16` loaded the exact preview under the controller-owned GuestBridge fixture served from the app-approved `https://milgam.ylm.co.il` host origin. All host/API traffic was intercepted locally; fixtures were synthetic and non-secret.
- At 1440×900 RTL, 390×844 RTL, and 1440×900 LTR the enabled snapshot rendered reconciled events (128/14 = 50/6 + 78/8), separate permits (92 valid, 7 missing, 4 overdue), and an aggregate-only 10,000 equipment state. Snapshot DOM count was 41 and observed horizontal overflow was zero.
- Each run issued the three current-report requests and the five analytical requests to intercepted local fixtures. The current reports used the expected routes and rendered independently of analytical presentation.
- Strict preview CSP retained `style-src 'self'`, `object-src 'none'`, and `base-uri 'none'`. The reviewed DOM had zero inline styles. Donut SVG segments, stacks, swatches, and bars had non-zero geometry and visible fills. No relevant CSP violation, uncaught page error, or third-party executable request was observed.
- The three permit metrics were native buttons with distinct accessible names. Activating the middle control did **not** produce a bridge effect or parent hash change: `controllerHarness.effects` remained empty, the hash remained empty, and the dashboard announced `לא ניתן לפתוח כעת את לוח האישורים. הנתונים נשארו זמינים.` The harness used the real controller-supplied GuestBridge; no fake adapter, `ready()`, or `executeCommand()` was injected.
- Because permit navigation never enters the real command lifecycle, command hold/revoke/release, response-generation binding, and successful fresh-generation navigation cannot be accepted for `T-205` on this candidate.

## Evidence files

- `playwright-results.json`: exact preview headers, browser version, local route observations, bridge state/effects, console/page messages, DOM metrics, status copy, and chart geometry.
- `preview-desktop-rtl.png`, `preview-mobile-rtl.png`, `preview-desktop-ltr.png`: exact-preview screenshots.
- `imagegen-permit-navigation-reference.png`: ImageGen-backed expected-success review reference, SHA-256 `8ec4e25f33862cc962281937b43e32b46e48d6f3510e428dbe84cb1dfbb9460b`. It is design guidance, not proof of implemented behavior.

## Evidence boundary

The fixture supplies synthetic permission decisions and is not proof of deployed tenant permissions. It is, however, the controller-owned faithful harness required to observe whether the deployed guest packages and uses the real SDK command lifecycle. Commit-to-preview identity is controller-supplied; provider state was not queried. No deployment, lifecycle API, real token, Git operation, or application/test mutation occurred.

