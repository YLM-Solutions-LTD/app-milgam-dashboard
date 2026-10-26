# Exact-preview security evidence

Exact preview: `https://ea51f277.app-milgam-dashboard.pages.dev`  
Controller-supplied head: `8f1e577bbcb4670878dec24ff570c1382a18d170`

## Artifact and trust evidence

- Deployed `app.js`, `host-bootstrap.js`, `host-context.js`, `host-services.js`, `api-client.js`, `constants.js`, `index.html`, packaged SDK, and XState bytes match the reviewed source hashes. See `digests.txt` and `deployed/`.
- Packaged `assets/simplyvibe-client.js` SHA-256 is `ee67f5ae15c70fee8443701b4391946a2275d922acdf9d1797c69dad3c414bf1`, matching the controller-supplied verified SDK.
- Response CSP is enforced with self-only scripts/styles and corrected `frame-ancestors` including `https://milgam.ylm.co.il`; no policy widening to the stale mistaken origin was made. Executable guest requests were same-origin, with fixture scripts loaded only in the controller parent. No unexpected or tenant network request occurred.
- Direct top-level access plus a forged message produced zero API requests and remained in the secure-waiting state.

## SDK, command, disconnect, and re-entry

- The exact preview exposed the packaged `SimplyVibeClient` constructor and no `SimplyVibeHostAdapter` global.
- With the unmodified controller GuestBridge at `https://milgam.ylm.co.il/controller-host-fixture/`, the preview issued its enabled synthetic current-report requests and an activated certificate metric produced exactly `Navigate {Url:"#/Permits/Dashboard"}` in fixture generation 1.
- A second command was held, the bridge was revoked, and the response released. It produced no navigation effect. A post-disconnect refresh produced zero API requests.
- Controller `reenter()` rotated to generation 2. The preview used only `Bearer controller-synthetic-generation-2` for recovered requests and produced one generation-2 Navigate effect. This closes the legacy-context-survives-disconnect finding on exercised paths.

## API 401 lifecycle defect

- In generation 2, the current-events request was locally fulfilled with HTTP 401. The app moved to the secure-waiting state and did not log the synthetic private response body.
- Without `controllerHarness.reenter()` or bridge generation rotation, clicking the visible snapshot refresh invoked `hostBootstrap.reconnect()`, accepted the unchanged generation-2 bridge context, and sent the three current-report requests plus the analytical request again with `Bearer controller-synthetic-generation-2`.
- Source path: `app.js` maps snapshot refresh to `refreshAuthorization()` and unconditional `hostBootstrap.reconnect()`; `host-bootstrap.js` constructs a fresh client but has no requirement that the host session source or credential generation change after an HTTP authorization failure.
- This violates the shared requirement that 401/403 revoke the matching capability, deny subsequent old-generation authenticated work, and require fresh verified re-entry.

## Body-free diagnostics

- A synthetic analytical HTTP 500 body containing `personName=SYNTHETIC PRIVATE PERSON` and `internalRecord=SYNTHETIC-991` did not appear in captured console entries.
- A synthetic HTTP 401 body containing `SYNTHETIC 401 PRIVATE` likewise did not appear. Deployed `api-client.js` logs bounded status/body-byte metadata only. This closes `simplyvibe:diagnostics:api-error-body-console-disclosure:v1` on exercised paths.

## Limits

- All host/API traffic was locally fulfilled or aborted; no real tenant token, permission, host request, or API request was used. Fixture permission decisions are not evidence of tenant authorization configuration.
- The browser emitted `Error: Client disposed.` during deliberate session revocation. No credential/body disclosure or old command effect resulted, so this is not reported as a security finding.

Artifacts: `browser-security.mjs`, `browser-results.json`, `headers.txt`, `digests.txt`, and `deployed/`.
