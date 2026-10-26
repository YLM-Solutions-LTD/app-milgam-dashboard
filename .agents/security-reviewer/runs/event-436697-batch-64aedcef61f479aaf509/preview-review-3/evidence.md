# Security evidence — preview review cycle 3

- Exact preview: `https://c9756759.app-milgam-dashboard.pages.dev`
- Controller-supplied head: `50972d0b555115d3b1c9da90f7df0dc4790c6e8e`
- Preview `index.html` SHA-256 equals local source: `183ed56a8bbf32c46b5a0de77faf3a6b2494b58fa35dcf19f16bd1b3c763f478`.
- Preview/local XState 4.38.3 SHA-256: `06f5c308e93a6542c15c13c6bc16ac6841e995538ee48682a13909e298650024`.
- Preview response enforces `default-src 'self'; script-src 'self'`, explicit API `connect-src`, explicit `frame-ancestors`, `base-uri 'none'`, `object-src 'none'`, and `form-action 'none'`; it also sends `Referrer-Policy: no-referrer` and `X-Content-Type-Options: nosniff`.
- Browser executable trace contained only the preview origin and no third-party executable request.
- Synthetic approved-parent run accepted `https://mnt.ylm.co.il`, sent one analytics POST to approved `https://api.ylm.co.il` with the synthetic bearer, and sent the expected analytics body. The current-snapshot flag was false, so no current-report calls or permit command were expected.
- Direct/top-level forged message produced zero API requests and zero host calls; UI remained at the secure waiting state.
- Static source review confirmed parent source/origin checks, explicit HTTPS API-origin mapping, immutable private WeakMap capability branding, active-generation checks before/after API and host operations, 401/403 revocation, no token storage, and no dynamic HTML/eval/open-redirect sink.
- Artifacts: `headers.txt`, `index.html`, `xstate-headers.txt`, `xstate.js`, `constants.js`, `browser-security.mjs`, `browser-results.json`.

Limitation: an approved real SimplyLog host or controller-owned faithful lifecycle harness was not supplied. Synthetic messaging does not prove real-host expiry/re-entry behavior. This is retained as an external acceptance prerequisite under T-107, not reported as a concrete client-side vulnerability in this review.
