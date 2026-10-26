# Evidence

## Exact commands and results

1. `node --test tests/qc/*.test.js` from `/workspace/src/apps/milgam-dashboard`
   - First authoring run: 20 passed, 3 failed. All three were test-assumption defects discovered while updating the suite: shared revoked context across HTTP cases, stale `hostServices` spelling after stable-service capture, and an incorrect 100 KB asset-size floor. The test code was corrected; application source was not changed.
   - Final run: 23 passed, 0 failed, 0 skipped; duration 288.335 ms.
   - 10,000-row equipment mapper, five warmed samples: 25.342–32.448 ms for 2,083,924 decoded bytes; below the 100 ms ceiling.
2. `npm test` from `/workspace/src/apps/milgam-dashboard/site`
   - 55 passed, 0 failed, 0 skipped; duration 232.461 ms.
3. `node --test tests/uat/*.test.mjs` from `/workspace/src/apps/milgam-dashboard`
   - 13 passed, 0 failed, 0 skipped; duration 172.173 ms.
4. `sha256sum tests/qc/snapshot-qc.test.js site/assets/xstate-4.38.3.js site/_headers`
   - QC suite: `df1ae33e757f56ad56c0f832f4f7beb7d1ad1a0419b9f4a1d2d96f6f89a6dcba`
   - XState asset: `06f5c308e93a6542c15c13c6bc16ac6841e995538ee48682a13909e298650024`
   - Static headers: `60a0abdd450a5075a3e202e20ad30f9542ba913dcaeaa5e07df603b8e9a5623c`

## Bounded observations

- Synthetic accepted context sends exactly three independent snapshot searches with body `{}` and authorization only after private capability binding.
- Replacement context revokes the older generation; API and host-service completions that return after revocation are rejected; a fresh generation is accepted.
- Permit cleanup captures `event.currentTarget` before either await, unlocks only connected controls, and focuses only a connected, enabled, focusable control. This directly guards the cycle-2 failure shape.
- Static HTML loads only `./assets/xstate-4.38.3.js`; `_headers` confines scripts to self and limits connections to the approved API origins.
- Failure cases remain distinguishable and sanitized; last-good snapshot data survives a later failure.
- Responsive/accessibility evidence in this authoring cycle is deterministic source-contract coverage, not computed browser geometry or screenshots.

## Limitations

- This was test-authoring, not exact-preview review; no controller-supplied cycle-3 preview identity was provided or exercised.
- No approved real SimplyLog host/harness was supplied. Synthetic fixtures cannot establish real session expiry, command-response binding, or host re-entry acceptance.
- Computed contrast, actual keyboard focus after live DOM replacement, zoom, browser console/network behavior, response-header delivery, and viewport geometry require the next exact-preview review.
- The delivered feature flag is intentionally false, so synthetic API-path tests invoke modules directly rather than enabling the app's live snapshot bootstrap.
