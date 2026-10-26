# UI preview evidence — cycle 2, attempt 1

## Candidate and method

- Controller-supplied PR head: `8f1e577bbcb4670878dec24ff570c1382a18d170`.
- Exact preview: `https://ea51f277.app-milgam-dashboard.pages.dev`.
- Trusted fixture: `https://milgam.ylm.co.il/controller-host-fixture/`.
- Browser: Chromium `140.0.7339.16`.
- The controller fixture, GuestBridge, and preview-packaged same-origin `assets/simplyvibe-client.js` were used. No adapter, fake readiness, tenant token, or live tenant request was used. API calls were fulfilled locally; no request escaped the preview, fixture, or synthetic API origins.

## Observable results by task

- `T-201`: enabled snapshot rendered the reconciled 128/14 overall, 50/6 headquarters, 78/8 branches data plus permit and equipment sections. Current calls used `{}` and the three documented routes. The harness's initial iframe lifecycle delivered two complete bootstraps in the recorded run; each bootstrap contained one call to each current route, rather than a user-triggered retry.
- `T-202`: CSP retained `style-src 'self'`; affected rendered UI contained zero inline style attributes. Donut segments, swatches, stacked comparison, and bar fills had non-zero geometry in desktop and phone evidence. No page error or relevant CSP console violation occurred, and executable requests were same-origin preview assets plus the local fixture bridge.
- `T-203`: the real packaged SDK completed the corrected-origin handshake. Three permit controls had distinct accessible names. Keyboard activation emitted exactly `Navigate` with `#/Permits/Dashboard`, changed the parent hash, and restored a usable ready UI. No raw API body marker was present in diagnostics observed during the success path.
- `T-204`: the enabled snapshot showed 92 valid, 7 missing, 4 overdue permits and 10,000 equipment items with treatment classification explicitly unavailable. Snapshot descendants: 41. Horizontal overflow: 0 px at 1440×900 RTL, 390×844 RTL, and 1440×900 LTR. No page errors were recorded.
- `T-205`: after `controllerHarness.revoke()`, activating snapshot refresh added zero API calls, retained last-good data, and exposed the stale/retry status `הנתונים המוצגים הם העדכון התקין האחרון. הרענון נכשל. נסו שוב`. This is UI/harness evidence only; controller deployment status and tenant permission configuration are not claimed.

## Interaction, accessibility, responsive, and states

- Native permit buttons remain keyboard operable; accessible names include metric, exact value, and destination action.
- Polite status regions expose host connection and snapshot update/state feedback; data meaning remains available in text rather than color alone.
- RTL mobile stacks the three snapshot cards without horizontal clipping. LTR fixture context switches the document to `dir=ltr` with the same information architecture and no overflow.
- Loading behavior was observed during bootstrap; ready, stale/retry, and host-revoked states were observed. Empty, initial-error, validation, and success/error analytical state contracts remain covered by accepted deterministic evidence; this review did not invent preview state through a fake adapter.
- Fresh ImageGen comparison evidence follows the SimplyLog baseline and highlights visible focus, responsive stacking, textual chart labels, and the same information hierarchy. It is design evidence, not runtime code.

## Stable findings

None. The prior `ui:permit-navigation-real-bridge-unavailable:v1` finding is closed on this exact preview: the packaged client is present and a real GuestBridge command produced the required effect.

## Evidence integrity

- `playwright-results.json`: `b0a3ed657be20a00fa36de2fdc1432be0ee8d007c6580ddce1b9c7acef748e0c`
- `preview-desktop-rtl.png`: `602986b14376014a93ee781a43ffb43de25cc22cd411869b361aed4b0f7214e0`
- `preview-mobile-rtl.png`: `855b7b35479f8803877cbbe293d7f8d1b963039051ba32a3e58dfa696d834f52`
- `preview-desktop-ltr.png`: `23086f9e8ff884f8c84aa23b764773b881798afc9179e705f23581dc0354c6ea`
- `imagegen-responsive-reference.png`: `1086c92dde497a5223956ce6f17a89bdf5750784f46779af3b3323ac363c8912`

