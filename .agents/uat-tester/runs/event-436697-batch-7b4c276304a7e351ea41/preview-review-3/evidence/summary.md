# Exact-preview UAT evidence

- Preview/head: `https://ef2f1185.app-milgam-dashboard.pages.dev` / `3dc45f69655efd2a2c6b0ad016b1a8cf8f738066`.
- Runtime: Chromium 140.0.7339.16, Node v20.20.2; controller-owned real GuestBridge with deployed packaged SDK; synthetic local API fixtures only.
- Four responsive sessions (1440x900 and 390x844, RTL and LTR): exactly three `{}` current POSTs, 4.11–7.34 ms request-start spread, 41 snapshot descendants, no overflow, no inline styles, and no page errors.
- Authorization: HTTP 401 retained last-good data; forced old-generation refresh added zero calls; fresh bridge generation 2 automatically issued exactly three current calls.
- Refresh amplification: twenty synchronous activations split across `#snapshot-refresh` and `#refresh-button` issued exactly three current calls total. After a synthetic 500, ten `[data-snapshot-retry]` activations issued exactly three current calls and the refresh lock became enabled again.
- Permit lifecycle: twenty held activations produced one generation-1 Navigate; revoked held command produced zero old effects; fresh generation produced one exact Navigate to `#/Permits/Dashboard`.
- Diagnostics: expected browser network messages for injected 401/500 were observed; there were no page errors, disposal/reset errors, or private response marker leaks.
- CSP: `default-src 'self'; script-src 'self'; style-src 'self'; ... base-uri 'none'; object-src 'none'`; observed app executable requests were same-origin, while the harness scripts came only from the intercepted fixture origin.
- Supporting commands: `(cd site && npm test)` → 61/61; `node --test tests/qc/*.test.js tests/qc/*.test.mjs` → 34/34; `node --test tests/uat/*.test.mjs` → 23/23; `(cd /workspace/.simplyvibe/input/controller-host-harness && node --test host-fixture.test.mjs)` → 2/2.
- SHA-256 deployed/local equality: app `c3712bda…75ce`; host bootstrap `62e0a181…2aa5`; SDK `ee67f5ae…bf1`.
- Limitation: fixture permission decisions are synthetic and do not prove real tenant permission configuration.
