# UAT test-authoring cycle 2 evidence

- Batch: `event-436697-batch-b48436fc6cafd492b70f`
- Role: `uat-tester`; verdict: `approve`; handled action IDs: `[570021]`; `includeDescription=false`.
- Shared tasks: `T-301`, `T-302`, `T-303`, `T-304`, `T-305`.
- Runtime: Node.js `v20.20.2`.
- Safety: synthetic postMessage/API fixtures only; actual packaged SDK and controller GuestBridge fixture; no real tenant token or tenant request; forbidden deployed origin not accessed.

## Complete inventory and commands

The inventory in `inventory.log` found 12 site JS tests, four QC tests (one JS, three MJS), four UAT MJS tests, and one harness MJS test; no CJS or spec files exist.

1. `cd /workspace/src/apps/milgam-dashboard/site && npm test` — 72 passed, 0 failed, 0 skipped.
2. `cd /workspace/src/apps/milgam-dashboard && node --test tests/qc/*.test.js tests/qc/*.test.mjs` — 49 passed, 0 failed, 0 skipped.
3. `cd /workspace/src/apps/milgam-dashboard && node --test tests/uat/*.test.mjs` — 33 passed, 0 failed, 0 skipped.
4. `cd /workspace/src/apps/milgam-dashboard && node --test /workspace/.simplyvibe/input/controller-host-harness/host-fixture.test.mjs` — 2 passed, 0 failed, 0 skipped.

Detailed command output is preserved in `site.log`, `qc.log`, `uat.log`, and `harness.log`.

## Current remediation fingerprints

- `perf-preview-analytical-1000-row-unbounded-dom-long-tasks-v1` (`T-302`, `T-304`): locally corrected. UAT-307 traverses exactly 1,000 stable rows through 100 ten-item windows and proves no detail window exceeds ten items. Current source is `site/pagination.js` and the bounded renderers in `site/app.js`. Exact Chromium descendant count and long-task measurement require the authorized preview review and are not claimed here.
- `uat-snapshot-terminal-401-retry-enabled-v1` (`T-303`, `T-304`): corrected and directly verified. UAT-308 loads last-good data, produces a synthetic HTTP 401, verifies stale retention plus `terminalAuthorization=true`, then activates retry ten times and observes zero additional loader effects. It also checks disabled-toolbar and re-entry-only UI source contracts in `site/app.js`; controller behavior is in `site/current-snapshot.js`.
- `qc-footer-320-rtl-edge-clipping-v1` (`T-305`): locally corrected. UAT-309 proves packaged footer JS/CSS remain byte-identical and app-owned CSS supplies exact-320 body shrinkage, bounded footer width, shrinkable fields, and recoverable wrapping without footer-level overflow hiding. Exact Chromium 320x844 RTL bounding boxes require preview review and are not claimed here.

## Preserved workflows

The complete UAT suite also passes inclusive boundary/leap/cross-year ranges, four identical analytical bodies, decimal-string normalization/rejection, analytical/snapshot isolation, enabled snapshot calls, all-state truthful footer metadata, actual SDK/GuestBridge Navigate, bridge re-entry, old-generation denial, and disclosure controls. Packaged and supplied SDK SHA-256 values both equal `ee67f5ae15c70fee8443701b4391946a2275d922acdf9d1797c69dad3c414bf1`.

## Limitations

This test-authoring stage did not execute an authorized deployed preview. Browser DOM/long-task budgets, 320px/390px/desktop geometry, exact deployed metadata, and actual tenant permission configuration remain controller-owned final-preview gates. Synthetic permission decisions are not tenant proof.
