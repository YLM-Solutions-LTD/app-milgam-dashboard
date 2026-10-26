# Implementation cycle 2 evidence

## Scope and source changes

- Batch `event-436697-batch-b48436fc6cafd492b70f`; shared revision 13; action `570021`; `includeDescription=false`.
- T-301 was regression-preserved: native From/To, exact timezone-less inclusive `.997` bounds, invalid-input zero effects, four identical analytical bodies, and snapshot isolation remain covered by the complete suites.
- T-302: `site/pagination.js:1-20` defines a deterministic ten-item window. `site/app.js:43-44,218-225,434-589` resets/clamps five independent windows, renders complete-data totals with bounded division/category/closure slices, exposes stable range text and keyboard buttons, and changes pages without an API path. `site/tests/pagination.test.js:5-24` proves 1,000 stable items are all reachable exactly once, slices never exceed ten, and boundaries clamp.
- T-303: `site/current-snapshot.js:76-111,128-129` persists a bounded terminal latch for authorization-revoked/401/403, retains last-good data, and makes subsequent refresh attempts zero-effect. `site/app.js:77-92,282-312` replaces the controller only on verified host re-entry and disables toolbar/retry UI with re-entry guidance. `site/tests/current-snapshot.test.js:104-130` covers 401, 403, ten denied retries, stale retention, and explicit revocation.
- T-305: packaged footer JS/CSS remain unchanged. `site/app.css:31-54` provides an exact 320px shrink override plus border-box, max-width, shrink, and wrapping containment for footer fields. The semantic single footer remains outside `main` in `site/index.html`.

## Fingerprint disposition

- `perf-preview-analytical-1000-row-unbounded-dom-long-tasks-v1`: locally remediated in source. Eager 1,000-row markup was replaced by five ten-row windows; deterministic traversal proves stable complete reachability and constant visible cardinality. Exact Chromium descendant/long-task measurements remain a later intercepted-preview check because no browser runtime is installed locally.
- `uat-snapshot-terminal-401-retry-enabled-v1`: fixed and locally verified. 401/403/revocation latch the rejected controller, stale facts remain, ten refresh attempts make no new load, toolbar refresh is disabled, retry markup is omitted, and a distinct verified host callback constructs the fresh generation.
- `qc-footer-320-rtl-edge-clipping-v1`: locally remediated in app-owned CSS while builder assets remain byte-identical. Static QC verifies the narrow override/shrink contract; exact 320px RTL browser bounds remain a later intercepted-preview check because no browser runtime is installed locally.

## Complete inventory and commands

Rediscovery immediately before final execution found 12 site JS tests (including new `pagination.test.js`), four QC tests (one JS, three MJS), three UAT MJS tests, and one harness MJS test. No applicable CJS or spec files exist.

- `cd site && npm test` -> 72/72 pass, zero fail/skip/cancel/todo.
- `node --test tests/qc/*.test.js tests/qc/*.test.mjs` -> 43/43 pass, zero fail/skip/cancel/todo.
- `node --test tests/uat/*.test.mjs` -> 29/29 pass, zero fail/skip/cancel/todo.
- `node --test /workspace/.simplyvibe/input/controller-host-harness/host-fixture.test.mjs` -> 2/2 pass, zero fail/skip/cancel/todo using the real packaged SDK and GuestBridge with synthetic local decisions.
- Syntax: `node --check site/app.js`, `node --check site/current-snapshot.js`, and `node --check site/pagination.js` passed.
- Runtime: Node.js v20.20.2.

The first post-change QC execution failed 41/43 because two archived source assertions required the legacy base `body { min-inline-size:320px; overflow-x:hidden; }` text. The implementation preserved those declarations and added `@media (max-width:320px) { body { min-inline-size:0; } }` plus actual footer containment rules; the exact complete QC command was rerun and passed 43/43. The failure was not hidden or excluded.

## Integrity and limitations

- Footer JS SHA-256 `bd3aa96202a55cd9533d2d4dca2c2c49e62aafc6035fe81448fe809a0959c08a` and CSS `8630140fc81581724156afa21d80393359561fdcc8c11d1567aab1385c1daa31` match the builder package.
- SDK SHA-256 `ee67f5ae15c70fee8443701b4391946a2275d922acdf9d1797c69dad3c414bf1` matches the controller harness vendor asset. XState remains `06f5c308e93a6542c15c13c6bc16ac6841e995538ee48682a13909e298650024`.
- `CURRENT_SNAPSHOT_LIVE_CALLS_ENABLED=true`; no OData/backend/database/provider/lifecycle/deployment operation was added or invoked.
- The prohibited Pages origin and real tenant were not accessed. Exact-preview asset identity, stamped version/head equality, 320px/390px/1440px browser geometry, browser long-task/render budgets, and deployed host permissions remain explicitly deferred to independent controller testing; none is claimed passed here.
