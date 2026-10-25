# Security evidence — preview review cycle 3

Exact preview: `https://5ab11833.app-milgam-dashboard.pages.dev`

Controller-supplied exact head: `c9686ba1ad6d4f7b0896ba32c29ad38dcf607022`

Browser: Chromium 140.0.7339.16. The unmodified controller fixture was served only at the intercepted `https://milgam.ylm.co.il/controller-host-fixture/` origin. API routes were locally fulfilled with non-secret fixtures; unexpected tenant API traffic was aborted. No real token or tenant request was used.

## Exact commands

```text
node .agents/security-reviewer/runs/event-436697-batch-7b4c276304a7e351ea41/preview-review-3/browser-security.mjs
curl -sSI https://5ab11833.app-milgam-dashboard.pages.dev/
curl -sS <exact-preview>/host-bootstrap.js | sha256sum
sha256sum site/host-bootstrap.js
curl -sS <exact-preview>/host-context.js | sha256sum
sha256sum site/host-context.js
```

The first browser attempt failed before preview load because a broad Milgam abort route shadowed the intercepted fixture route. The current-run script was corrected to remove that overlapping abort pattern, then completed successfully. This was a reviewer-harness error, not an app failure.

## Task and fingerprint evidence

- T-201: initial verified generation issued exactly one POST `{}` to each of the three fixed current-report routes. Direct preview load plus a forged `postMessage` generated zero API requests and remained “waiting for a secure connection.” `SimplyVibeClient` was a function and `SimplyVibeHostAdapter` was absent.
- T-202: delivered CSP was `default-src 'self'; script-src 'self'; style-src 'self'; ... frame-ancestors ... https://milgam.ylm.co.il ...; base-uri 'none'; object-src 'none'; form-action 'none'`. Browser trace contained zero third-party executable requests and zero CSP/page errors.
- T-203/T-204/T-205 terminal taint: after a populated snapshot, a current-events 401 revoked generation 1. The snapshot text stayed byte-for-byte equivalent in its displayed facts and status announced the last good update as stale. A further refresh before controller re-entry issued zero API requests. This closes `simplyvibe-auth-lifecycle-401-refresh-reuses-rejected-generation-v1` and `uat-authorization-expiry-old-generation-refresh-allowed-v1`.
- T-203/T-204 stale retention: both synthetic 500 and 401 refreshes retained all displayed event, permit, and equipment facts and showed the stale/error status. This closes `uat-snapshot-refresh-failure-last-good-cleared-v1`.
- T-203/T-205 recovery: `controllerHarness.reenter()` rotated from generation 1 to generation 2 and automatically issued exactly three new current POST `{}` calls with the generation-2 synthetic bearer. The supported analytical load also restarted separately. This closes `perf-preview-fresh-reentry-does-not-restart-snapshot-generation-v1`.
- T-203/T-204/T-205 command binding: holding the real bridge command and dispatching 20 additional click events produced exactly one generation-2 `Navigate` effect with `{Url:"#/Permits/Dashboard"}`. This closes `uat-permit-command-singleflight-race-v1`.
- T-203/T-204/T-205 overlap race: while a command was pending, revoke/release followed by synchronous `reenter()` and microtask `reenter()` recovered only the newest generation (generation 3), issued one three-route snapshot set with generation 3, produced no old-generation effect, and recorded zero `pageerror` and zero `unhandledrejection`. This closes `qc-sdk-reentry-client-disposed-unhandled-v1`.
- T-203/T-204 diagnostics: distinctive `PRIVATE-500-MARKER` and `PRIVATE-401-MARKER` response-body values were absent from captured console entries. Logged context summaries excluded raw API address and credentials.
- Exact/source identity: deployed and local `host-bootstrap.js` both hashed `95cf5d712e033039a104f9cc0b9e698bc06596c6e36444fa9448b35c4683a7f9`; deployed and local `host-context.js` both hashed `2b983836f5d4baf4b593c8ecb4213e873b82df577d0018b86bcf12322f2a88f7`.

## Legacy helper assessment

`host-context.js` still exports the old `contextFromMessage` and `installHostContextListener` helpers, and the helper can create a WeakMap-branded context without an SDK client. However, the exact production bootstrap imports only `contextFromSdk`; `index.html` loads the verified SDK; the legacy listener is never installed; and direct/forged messaging caused zero requests. Because no production source-to-effect path exists, this is dead compatibility surface rather than a reproducible authorization bypass. It should preferably be removed as defense-in-depth, but it is not reported as a concrete vulnerability in this review.

## Limitations

The synthetic fixture proves client-side capability lifecycle behavior only. It does not prove deployed tenant permissions, server-side authorization, controller deployment provenance, or production release state. Those were not contacted or inferred.
