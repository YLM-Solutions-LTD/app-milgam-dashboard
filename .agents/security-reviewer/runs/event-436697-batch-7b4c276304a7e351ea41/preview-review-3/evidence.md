# Security evidence — preview review cycle 3, attempt 1

Exact preview: `https://ef2f1185.app-milgam-dashboard.pages.dev`

Controller-supplied exact head: `3dc45f69655efd2a2c6b0ad016b1a8cf8f738066`

Browser: Chromium 140.0.7339.16. The unmodified controller fixture was served only at intercepted `https://milgam.ylm.co.il/controller-host-fixture/`. Every API response was a local, synthetic non-secret fixture; no tenant credential or tenant request was used.

## Commands and artifacts

```text
node .agents/security-reviewer/runs/event-436697-batch-7b4c276304a7e351ea41/preview-review-3/browser-security.mjs > .../browser-results.json
curl -sSI https://ef2f1185.app-milgam-dashboard.pages.dev/
curl -sS <preview>/<file> | sha256sum; sha256sum site/<file>
```

Durable outputs are `browser-results.json`, `headers.txt`, and `digests.txt` in this run folder.

## Task and current-fingerprint evidence

- `T-201`: generation 1 issued exactly one POST `{}` to each fixed current route. Direct preview access plus a forged legacy context issued zero API calls and remained in the secure-connection waiting state. Runtime exposed the packaged `SimplyVibeClient` and no public `SimplyVibeHostAdapter`.
- `T-202`: the exact response enforced self-only script/style CSP, fixed approved connect/frame origins, `base-uri 'none'`, `object-src 'none'`, and `form-action 'none'`. The browser trace contained zero third-party executable requests, relevant CSP errors, or page errors.
- `T-203`/`T-204`/`T-205` — `simplyvibe-auth-lifecycle-401-refresh-reuses-rejected-generation-v1`, `uat-authorization-expiry-old-generation-refresh-allowed-v1`, and `unchanged-sdk-session-capability-remint-v1`: a synthetic current-events 401 terminally denied generation 1. The next ordinary refresh emitted zero requests. Only distinct bridge re-entry recovered.
- `T-203`/`T-204` — `uat-snapshot-refresh-failure-last-good-cleared-v1`: after both 500 and 401 refresh failures, the complete snapshot text remained byte-identical to the last good content and the visible status marked it stale.
- `T-203`/`T-205` — `perf-preview-fresh-reentry-does-not-restart-snapshot-generation-v1`: distinct controller re-entry rotated to generation 2 and automatically issued exactly three current-report POST `{}` requests with the generation-2 synthetic bearer.
- `T-203`/`T-204`/`T-205` — `uat-permit-command-singleflight-race-v1` and `permit-single-flight-cleared-by-revocation-v1`: a held real bridge command plus 20 further activations yielded exactly one generation-2 `Navigate` effect to `#/Permits/Dashboard`.
- `T-203`/`T-204`/`T-205` — `qc-sdk-reentry-client-disposed-unhandled-v1` and overlapping re-entry: revoke/release plus synchronous and microtask re-entry recovered generation 3, issued exactly one three-route current set for generation 3, produced no old-generation navigation, no page error, and no unhandled rejection.
- `T-203`/`T-204` — `legacy-context-remains-independent-authority-v1`: production bootstrap imports `contextFromSdk` and installs no legacy context listener. Direct forged `postMessage` produced zero authenticated effects.
- `T-203`/`T-204` — `host-context-diagnostics-expose-runtime-address-v1` and body-log regression: synthetic private 500/401 markers, API address, bearer values, and response bodies were absent from captured console values. Exercised diagnostics were bounded metadata.
- `T-203`/`T-204`/`T-205` — `perf-preview-refresh-verification-burst-request-amplification-v1`: ten synchronous activations alternating the header snapshot control and analytical control produced exactly three current requests (four total including the single analytical request). After an injected 500 rendered the stale retry control, ten retry activations produced exactly three current requests. Both bursts had zero browser errors. The 401 denial and distinct re-entry checks above demonstrate the same lock does not authorize revoked work and releases for fresh-session recovery.
- Deployed/source equality: `host-bootstrap.js` `62e0a181…5f42`, `host-context.js` `2b983836…a88f7`, `app.js` `c3712bda…75ce`, and packaged client `ee67f5ae…4bf1` matched byte-for-byte. The packaged client hash also matches the controller manifest.

## Source inspection

The refresh lock is acquired synchronously before `hostBootstrap.verify()` and spans optional analytical retry plus `snapshotController.refresh()`, with cleanup in `finally` and a current-context identity check. Verification uses a shared disposable SDK handshake and terminally denies the unchanged session on failure. API requests require a private active bound context, use fixed routes and the approved API origin, revoke on 401/403, and never log response bodies. Dynamic report labels and host-formatted dates are escaped before HTML insertion; no dynamic code execution, credential persistence, or event-controlled navigation sink was found.

## Limitations

The faithful fixture proves the reviewed browser capability lifecycle, not real tenant permission configuration, provider state, deployment provenance, or controller release state.
