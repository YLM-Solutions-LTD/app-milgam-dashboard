# UI evidence — exact preview cycle 3

## Outcome

Approve for the UI designer role across `T-201`–`T-205`. No stable UI, responsive, accessibility, interaction, or state-communication defect was reproduced on the exact preview.

## Exact artifact and method

- Controller-supplied head: `b138df3040ab4468220a29f595d0caa62920f679`.
- Preview: `https://42ad1c5f.app-milgam-dashboard.pages.dev`.
- Chromium: `140.0.7339.16`.
- Corrected local fixture origin with actual GuestBridge and packaged SDK; every API response was synthetic and locally fulfilled. No real tenant token/request was used.
- CSP kept `script-src 'self'` and `style-src 'self'`; 0 runtime inline styles and 0 relevant CSP/page errors were observed.

## Task evidence

- `T-201`: initial view issued all three exact current routes with `{}` and rendered events, three separate permit controls, and equipment total. Period analytics coexisted without clearing snapshot data.
- `T-202`: charts remained visible in desktop/mobile RTL and desktop LTR. All required views had 0 horizontal overflow; snapshot had 41 descendant nodes. Permit and refresh controls showed a 3 px visible keyboard outline.
- `T-203`: populated snapshot text length remained 276 after both 500 and 401. The stale message explicitly states that the last valid update remains shown. The distinctive synthetic body marker never appeared in console output. The three permit controls have distinct accessible names.
- `T-204`: 20 rapid activations while the real bridge command was held produced exactly one `Navigate` effect with `#/Permits/Dashboard`. The desktop, phone, and LTR captures show coherent hierarchy and intact charts.
- `T-205`: unchanged-session refresh after 401 added 0 requests. Fresh re-entry used generation 2 and automatically issued exactly three current-report calls, with supported analytical recovery. A held command followed by revoke/release and two overlapping re-entry calls reached generation 3 with 0 navigation effects and 0 page errors.

## Current fingerprint disposition

- `simplyvibe-auth-lifecycle-401-refresh-reuses-rejected-generation-v1`: not reproduced; unchanged-session retry added 0 calls.
- `perf-preview-fresh-reentry-does-not-restart-snapshot-generation-v1`: not reproduced; fresh generation 2 automatically issued three current calls.
- `uat-snapshot-refresh-failure-last-good-cleared-v1`: not reproduced; all populated facts remained visible after 500 and 401 with stale copy.
- `uat-authorization-expiry-old-generation-refresh-allowed-v1`: not reproduced; old-generation retry added 0 calls.
- `uat-permit-command-singleflight-race-v1`: not reproduced; 20 activations produced one effect.
- `qc-sdk-reentry-client-disposed-unhandled-v1`: not reproduced; overlapping re-entry race produced 0 page errors and no unhandled disposed/session-reset message.

## ImageGen comparison

Fresh reference: `imagegen-stale-reference.png`, SHA-256 `9708baa830b7b36c58e7e088742764d0a210f78c4cf71bc538fc33afe966aead`. It supports a persistent stale banner, retained metrics, discrete permit actions, visible retry focus, and continued chart visibility. The preview satisfies those behavioral principles; stylistic differences are non-blocking.

## Limitations

- Commit-to-preview binding is controller-supplied; provider and Git APIs were intentionally not called.
- The faithful harness validates client behavior with synthetic permissions, not real tenant permission configuration or controller release completion.
