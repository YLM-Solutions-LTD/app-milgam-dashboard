# Security evidence — preview review cycle 2

## Identity and source

- Exact preview: `https://f9d0c736.app-milgam-dashboard.pages.dev`; controller-declared head: `2f47f48ed056df72c5d8b861778dad5cc4069703`.
- The deployed footer displayed the exact 12-character head prefix `2f47f48ed056`, explicit Preview labeling, trusted Last update, and Not released.
- SHA-256 matched deployed/current bytes for `app.css`, `app.js`, host bootstrap/context/services, API client, current snapshot, pagination, actual guest SDK, and packaged footer JS/CSS. `index.html` is controller-stamped at publication and was verified through its rendered footer rather than claimed byte-identical.
- The exact response used strict self-only scripts/styles, approved fixed API connect origins, approved `frame-ancestors`, `base-uri 'none'`, `object-src 'none'`, `form-action 'none'`, `Referrer-Policy: no-referrer`, and `nosniff`.

## Exact-preview Playwright evidence

Command: `node browser-security.mjs` from this run directory, Chromium `140.0.7339.16`. The trusted fixture and API were locally fulfilled; unexpected traffic was aborted. See `evidence/browser-results.json`.

- The actual guest exposed `SimplyVibeClient` and no legacy/fake adapter. All authenticated requests stayed on fixed `https://api.ylm.co.il` routes with synthetic generation-bound bearers. Unexpected requests and third-party executable requests were zero.
- A synthetic CurrentEvents 401 retained stale facts, disabled `#snapshot-refresh`, rendered zero retry controls, showed re-entry-only guidance, and repeated activation produced zero API calls. Distinct GuestBridge re-entry generated only generation-2 requests. This closes `uat-snapshot-terminal-401-retry-enabled-v1` for current cycle.
- A held Navigate followed by revoke/release produced zero effects. Direct exact-preview navigation plus forged same-window context produced zero API requests and remained at secure-connection waiting.
- Synthetic private 500/401 response markers and the synthetic bearer did not appear in captured console output; page errors and dialogs were zero.
- 1,000-row analytical fixtures included HTML/script-like division/category labels. The bounded dashboard rendered 297 descendants with ten paging controls, zero injected `img`/`script`/event-handler elements, and zero dialogs. This current-cycle evidence closes the security/XSS aspect of `perf-preview-analytical-1000-row-unbounded-dom-long-tasks-v1`; the performance role owns timing ceilings.
- At supplemental 320px RTL, the singular footer box stayed within the effective viewport (`left=16`, `right=288`, `innerWidth=304`, `scrollWidth=304`). This closes `qc-footer-320-rtl-edge-clipping-v1` for current cycle and confirms no clipping-based concealment of release state.
- The same singular truthful footer remained visible in direct/no-context state. It loaded only same-origin packaged assets and made no footer API/authentication request.

## Complete inventory and suites

Fresh discovery found 12 site JS tests, five QC tests (one JS/four MJS), four UAT MJS tests, and one controller-harness MJS test; no applicable CJS/spec files.

- `cd site && npm test` → 72 passed, 0 failed/skipped/cancelled/todo.
- `node --test tests/qc/*.test.js tests/qc/*.test.mjs` → 49 passed, 0 failed/skipped/cancelled/todo.
- `node --test tests/uat/*.test.mjs` → 33 passed, 0 failed/skipped/cancelled/todo.
- `node --test /workspace/.simplyvibe/input/controller-host-harness/host-fixture.test.mjs` → 2 passed, 0 failed/skipped/cancelled/todo.
- Total: 156 passed. Exact output is preserved under `evidence/*-tests.log`.

## Task traceability and limitations

- `T-301`: native date values are strictly validated before fixed-body requests; no URL/script sink is formed from range input.
- `T-302`: bounded pagination preserves escaped untrusted labels and introduces no executable DOM or API effects on paging.
- `T-303`: safe aggregate normalization, bounded diagnostics, terminal generation denial, and distinct-session recovery passed.
- `T-304`: actual SDK/GuestBridge, strict CSP, bearer confinement, direct denial, held-command revocation, complete suites, and current-cycle remediation checks passed.
- `T-305`: one truthful responsive all-state footer uses validated controller stamps, same-origin packaged assets, and no authentication/network dependency.
- Synthetic permissions do not prove deployed tenant permissions or server policy. No real token/tenant traffic was used. Production publication, controller approval, and overall batch completion remain unclaimed.

