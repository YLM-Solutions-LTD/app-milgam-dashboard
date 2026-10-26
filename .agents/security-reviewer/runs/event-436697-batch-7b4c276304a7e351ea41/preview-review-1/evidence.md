# Exact-preview security evidence

Exact preview: `https://02ea3f16.app-milgam-dashboard.pages.dev`  
Controller-supplied head: `3b3f8d4373ff90c2073fb4e884e1fe622a8595a0`

## Faithful host-protocol exercise

- Served the controller-owned, unmodified GuestBridge fixture under approved synthetic parent origin `https://mnt.ylm.co.il` and intercepted every API call locally. No real tenant, credential, provider, or lifecycle API was contacted.
- The preview accepted the fixture's legacy context message and issued three exact current-report `POST {}` calls plus the analytical request to the approved API origin with synthetic generation-1 bearer data.
- The guest loaded neither `SimplyVibeClient` nor a `SimplyVibeHostAdapter` (`typeof` both was `undefined`). Clicking a permit metric produced no GuestBridge command and no host navigation effect.
- After `controllerHarness.revoke()` disconnected the real GuestBridge session, the preview still displayed “connected,” retained active generation-1 authorization, and a user refresh issued all three current-report calls again with `Bearer controller-synthetic-generation-1`. This demonstrates authenticated effects after host-session revocation.
- Direct top-level access plus a forged same-page message issued zero API requests and remained waiting for a secure connection.

## Diagnostic response-body disclosure

- The exact preview's analytical route was locally fulfilled with HTTP 500 and synthetic body `{personName:"SYNTHETIC PRIVATE PERSON", internalRecord:"SYNTHETIC-991"}`.
- Browser console capture contains that complete object in `[milgam-dashboard.api] HTTP error`. Deployed `api-client.js` matches source SHA-256 `9a03d6a3ba3053f4455c6e8d9cc1019ff764a075163d5d6875329046e6c4b2ad`.
- Token sanitization does not remove unrelated personal/internal fields. Impact remains limited to diagnostic exposure in an already-authorized browser, so severity remains low.

## Other controls and limits

- Response CSP remains strict and self-only for guest scripts/styles; guest executable requests were same-origin. The reviewed XState digest is `06f5c308e93a6542c15c13c6bc16ac6841e995538ee48682a13909e298650024`.
- Approved tenant permission configuration was not tested and is not inferred from fixture permission decisions.
- Because the guest SDK is absent, command hold/release, old-command-response rejection, fresh SDK session rotation, and successful Navigate could not be completed; this is part of the failed lifecycle/bridge implementation, not evidence of success.

Artifacts: `browser-security.mjs`, `browser-results.json`, `headers.txt`, `index.html`, deployed reviewed modules, and `digests.txt` in this run directory.
