# UI exact-preview evidence

## Candidate and method

- Exact URL: `https://ef2f1185.app-milgam-dashboard.pages.dev`; controller-associated head: `3dc45f69655efd2a2c6b0ad016b1a8cf8f738066`.
- Chromium `140.0.7339.16`, corrected synthetic Milgam fixture, actual SDK/GuestBridge, 10,000 local equipment rows, and locally intercepted API routes. No tenant token or real tenant traffic was used.
- Strict CSP retained `script-src 'self'`, `style-src 'self'`, `object-src 'none'`, and `base-uri 'none'`. No inline chart style or page error occurred.

## Task evidence

- `T-201`: verified-host load displayed current events, permits, and 10,000 equipment in a 41-descendant snapshot; unchanged-session retry after 401 emitted zero calls.
- `T-202`: donut, stack, swatches, and bars were visible at 1440×900 RTL, 390×844 RTL, and 1440×900 LTR. Each had zero horizontal overflow and zero inline styles.
- `T-203`: after 500 and 401, all last-good facts stayed visible with explicit stale/retry copy. Fresh re-entry automatically made exactly three current calls and restored normal state.
- `T-204`: three permit controls had distinct accessible names. Holding the real bridge command while firing 20 activations produced one `Navigate` to `#/Permits/Dashboard`. Mobile focus had a visible 3px outline. Overlapping re-entry reached generation 3 with zero page errors/effects.
- `T-205`: 401 tainted the unchanged session; ordinary refresh could not recover it, while fresh re-entry did.

## Refresh-burst follow-up

- Ten synchronous rounds through both `#snapshot-refresh` and `#refresh-button` produced exactly three current calls. Both controls disabled synchronously while pending and re-enabled on settlement.
- After a 500 exposed retry, ten retry activations produced exactly three current calls. A later successful retry made exactly three calls and restored normal status, proving error-path lock release.

## Finding disposition

- `simplyvibe-auth-lifecycle-401-refresh-reuses-rejected-generation-v1`: not reproduced; unchanged-session retry added zero requests.
- `perf-preview-fresh-reentry-does-not-restart-snapshot-generation-v1`: not reproduced; re-entry issued three current calls.
- `uat-snapshot-refresh-failure-last-good-cleared-v1`: not reproduced for 500 or 401; facts remained visibly stale.
- `uat-authorization-expiry-old-generation-refresh-allowed-v1`: not reproduced; old-generation refresh remained denied.
- `uat-permit-command-singleflight-race-v1`: not reproduced; 20 activations produced one navigation.
- `qc-sdk-reentry-client-disposed-unhandled-v1`: not reproduced; overlapping re-entry produced no page error.
- `perf-preview-refresh-verification-burst-request-amplification-v1`: not reproduced through either refresh control or retry; each burst produced three current calls.

Fresh ImageGen reference: `imagegen-stale-reference-v2.png`, SHA-256 `a904312ca29915001e95e9492956efc6a7b849effd19a2f6c0df84c0bf32b90c`. The preview implements its important behavior—retained facts, stale messaging, retry, distinct actions, responsive RTL hierarchy, and visible focus—without requiring source changes.

Limitations: commit association is controller-supplied; the fixture proves client behavior with synthetic permissions, not tenant permission configuration, publication, or controller release completion.

