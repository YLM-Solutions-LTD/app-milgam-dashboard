# Security evidence — preview review cycle 3, attempt 1

Exact preview: `https://42ad1c5f.app-milgam-dashboard.pages.dev`

Controller-supplied exact head: `b138df3040ab4468220a29f595d0caa62920f679`

Browser: Chromium 140.0.7339.16. The unmodified controller fixture was served only at intercepted `https://milgam.ylm.co.il/controller-host-fixture/`. All API responses used local non-secret fixtures; no real tenant token or request was used.

## Commands

```text
node .agents/security-reviewer/runs/event-436697-batch-7b4c276304a7e351ea41/preview-review-3/browser-security.mjs
curl -sSI https://42ad1c5f.app-milgam-dashboard.pages.dev/
curl -sS <preview>/host-bootstrap.js | sha256sum; sha256sum site/host-bootstrap.js
curl -sS <preview>/host-context.js | sha256sum; sha256sum site/host-context.js
curl -sS <preview>/app.js | sha256sum; sha256sum site/app.js
```

## Task and current-fingerprint evidence

- T-201: verified generation 1 issued one POST `{}` to each fixed current route. Direct preview load plus forged legacy context issued zero API calls and stayed “waiting for a secure connection”. Runtime had `SimplyVibeClient` and no public `SimplyVibeHostAdapter`.
- T-202: response CSP was strict/self-only (`script-src 'self'`, `style-src 'self'`, fixed `connect-src` and `frame-ancestors`, `base-uri 'none'`, `object-src 'none'`, `form-action 'none'`). Trace had zero external executable requests, CSP errors, or page errors.
- T-203/T-204/T-205 — `simplyvibe-auth-lifecycle-401-refresh-reuses-rejected-generation-v1`, `uat-authorization-expiry-old-generation-refresh-allowed-v1`, `unchanged-sdk-session-capability-remint-v1`: a synthetic current-events 401 terminally denied generation 1. A subsequent ordinary refresh emitted zero requests. Only distinct bridge re-entry recovered.
- T-203/T-204 — `uat-snapshot-refresh-failure-last-good-cleared-v1`: after both 500 and 401 refresh failures, event, permit, and equipment facts remained identical and visibly stale.
- T-203/T-205 — `perf-preview-fresh-reentry-does-not-restart-snapshot-generation-v1`: distinct controller re-entry rotated to generation 2 and automatically issued exactly the three current-report POST `{}` calls with the new synthetic bearer.
- T-203/T-204/T-205 — `uat-permit-command-singleflight-race-v1`, `permit-single-flight-cleared-by-revocation-v1`: a held real bridge command plus 20 additional activations resulted in exactly one generation-2 `Navigate` effect to `#/Permits/Dashboard`.
- T-203/T-204/T-205 — `qc-sdk-reentry-client-disposed-unhandled-v1`: revoke/release plus synchronous and microtask re-entry recovered only generation 3, issued one three-current-route set for generation 3, produced zero old-generation navigation effects, zero page errors, and zero unhandled rejections.
- T-203/T-204 — `legacy-context-remains-independent-authority-v1`: production bootstrap imports `contextFromSdk`; no legacy listener is installed. Direct forged `postMessage` produced zero effects. The exported compatibility helper is unreachable from the production bootstrap, so no source-to-effect authorization bypass was reproduced.
- T-203/T-204 — `host-context-diagnostics-expose-runtime-address-v1` and prior body-log fingerprint: `PRIVATE-500-MARKER`, `PRIVATE-401-MARKER`, raw API address, bearer values, and response bodies were absent from captured console values. Diagnostics contained bounded dataset/status/error/count metadata.
- Deployed/source equality: host-bootstrap `62e0a181…5f42`, host-context `2b983836…a88f7`, and app `7ee79a34…b355` matched byte-for-byte between the exact preview and local reviewed source.

## Limitations

The faithful fixture proves the reviewed browser capability lifecycle, not real tenant permission configuration, provider state, deployment provenance, or controller release state.
