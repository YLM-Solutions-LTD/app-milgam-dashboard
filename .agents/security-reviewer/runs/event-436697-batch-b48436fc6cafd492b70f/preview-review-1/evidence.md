# Security evidence — preview review cycle 1

## Scope and identity

- Exact preview: `https://8248a782.app-milgam-dashboard.pages.dev`.
- Controller-declared exact head: `1c5ebdae74cb6a1fae0f818b9f44997e43b8245c`; deployed footer rendered the validated 12-character prefix `1c5ebdae74cb` with explicit Preview labeling and Not released.
- Read-only SHA-256 comparison matched deployed and controller-supplied source bytes for `app.js`, `host-bootstrap.js`, `host-context.js`, `host-services.js`, `api-client.js`, `date-range.js`, `current-snapshot.js`, `constants.js`, `assets/simplyvibe-client.js`, `assets/release-footer.js`, and `assets/release-footer.css`.
- Response CSP: `default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:; connect-src 'self' https://api.ylm.co.il https://mntapi.ylm.co.il https://localhost:5721; frame-ancestors ... https://milgam.ylm.co.il ...; base-uri 'none'; object-src 'none'; form-action 'none'`; `Referrer-Policy: no-referrer`; `X-Content-Type-Options: nosniff`.

## Complete test inventory and commands

Inventory discovered before execution:

- Site: 11 `site/tests/*.test.js`; no applicable MJS/CJS/spec files.
- QC: three `tests/qc/*.test.mjs` and one `tests/qc/*.test.js`; no CJS/spec files.
- UAT: three `tests/uat/*.test.mjs`; no JS/CJS/spec files.
- Controller harness: one `host-fixture.test.mjs`.

Exact commands/results:

- `(cd /workspace/src/apps/milgam-dashboard/site && npm test)` → exit 0; 67 passed, 0 failed/skipped/cancelled/todo.
- `(cd /workspace/src/apps/milgam-dashboard && node --test tests/qc/*.test.js tests/qc/*.test.mjs)` → exit 0; 43 passed, 0 failed/skipped/cancelled/todo.
- `(cd /workspace/src/apps/milgam-dashboard && node --test tests/uat/*.test.mjs)` → exit 0; 29 passed, 0 failed/skipped/cancelled/todo.
- `(cd /workspace/.simplyvibe/input/controller-host-harness && node --test host-fixture.test.mjs)` → exit 0; 2 passed, 0 failed/skipped/cancelled/todo.
- Total: 141 passed, zero failures and zero omissions from the discovered applicable extensions.

## Exact-preview browser command and observations

Command: `(cd /workspace/src/apps/milgam-dashboard/.agents/security-reviewer/runs/event-436697-batch-b48436fc6cafd492b70f/preview-review-1 && node browser-security.mjs)` using Playwright Chromium 140.0.7339.16. The host fixture and API were locally fulfilled; only exact-preview public assets were network-readable; no real tenant request/token was used.

- Actual guest: `SimplyVibeClient` was a function; `SimplyVibeHostAdapter` was undefined.
- Initial accepted generation issued only three fixed snapshot POSTs with `{}` and one fixed discovery POST to `https://api.ylm.co.il`, all with synthetic generation-1 bearer.
- Synthetic CurrentEvents 401 caused terminal generation denial. A subsequent refresh issued zero requests. `controllerHarness.reenter()` rotated to generation 2 and restarted three snapshot plus discovery calls with the new synthetic bearer.
- A held Navigate followed by host revocation/release produced zero navigation effects. Harness unit evidence independently passed exact Navigate and old pending-command rejection.
- Direct exact-preview navigation plus forged same-window postMessage produced zero API requests and remained at the secure-connection waiting state.
- Synthetic private HTTP 500/401 response markers were absent from captured console entries; no page errors occurred.
- No third-party executable request occurred. All observed API requests stayed on the normalized approved API origin; unexpected/blocked request list was empty.
- Footer at 390×844: exactly one visible marker, no horizontal overflow; Hebrew RTL values were Version `1c5ebdae74cb (Preview)`, Last update `26.10.2026, 17:18`, Release date `Not released` (localized). It remained visible in direct/no-context state. The packaged renderer and complete automated suites cover invalid, waiting/loading/error/stale/ready and language variants without footer network/auth effects.

## Task traceability

- T-301: validated range construction and fixed request-body paths; source/tests show no URL or script sink from date input.
- T-302: fixed analytical endpoints, shared validated bounds, generation-bound completion, and bounded diagnostics passed source/test review.
- T-303: approved aggregate fields accept only safe decimal integers; malformed/unsafe values fail closed; snapshot routes remain exactly three fixed calls; private bodies stay out of DOM/logs/errors.
- T-304: complete suites passed; exact preview used real SDK/GuestBridge with locally intercepted synthetic context; CSP, direct denial, bearer confinement, 401 denial/re-entry, command revocation, and executable provenance passed.
- T-305: singular same-origin packaged footer uses controller-stamped preview metadata, discloses no sensitive/controller-internal values, makes no request, and reports Not released.

## Limitations

- Synthetic fixture permission decisions do not prove deployed tenant permissions or server authorization policy.
- No real token or tenant traffic was requested. Controller release authorization and production publication remain outside this role.
- The browser exercised representative hosted ready/error/authorization-loss/re-entry and direct no-context states. Remaining footer-state combinations are supported by byte-matched packaged renderer plus passing automated tests, not a real tenant.
