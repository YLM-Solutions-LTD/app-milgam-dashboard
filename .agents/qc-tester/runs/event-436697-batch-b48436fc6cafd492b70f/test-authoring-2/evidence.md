# Evidence

Environment: Node.js v20.20.2, npm 10.8.2. All traffic was synthetic/local; no tenant token, tenant request, provider operation, lifecycle API, or prohibited preview access occurred.

## Inventory

- Site: 12 `site/tests/*.test.js` files.
- QC: 5 files: one `.test.js`, four `.test.mjs`.
- UAT: 4 `.test.mjs` files (including the concurrently authored cycle-2 UAT regression).
- Harness: 1 `.test.mjs` file.
- No `.test.cjs` or `*.spec.{js,mjs,cjs}` files were found.

Discovery command:

`find site tests -type f \( -name '*.test.js' -o -name '*.test.mjs' -o -name '*.test.cjs' -o -name '*.spec.js' -o -name '*.spec.mjs' -o -name '*.spec.cjs' \) | sort`

## Exact configured executions

- `cd /workspace/src/apps/milgam-dashboard/site && npm test` — pass 72, fail 0, skip 0.
- `cd /workspace/src/apps/milgam-dashboard && node --test tests/qc/*.test.js tests/qc/*.test.mjs` — pass 49, fail 0, skip 0.
- `cd /workspace/src/apps/milgam-dashboard && node --test tests/uat/*.test.mjs` — final standalone pass 33, fail 0, skip 0.
- `cd /workspace/src/apps/milgam-dashboard && node --test /workspace/.simplyvibe/input/controller-host-harness/host-fixture.test.mjs` — pass 2, fail 0, skip 0.

An initial non-configured concurrent execution of all suites produced one UAT mapper-budget failure (`184.316ms` versus `<100ms`) while CPU-intensive site/QC/UAT suites competed. This failure is preserved: the exact standalone configured UAT command immediately passed 33/33 and measured the same 10,000-row mapper at `24.505ms`. It is classified as test-runner contention, not an application defect; final readiness relies on the required standalone commands above.

## Fingerprint decisions

- `perf-preview-analytical-1000-row-unbounded-dom-long-tasks-v1`: deterministic source regression closed locally. `tests/qc/remediation-cycle-2.test.mjs` walks all 1,000 items exactly once in stable ten-item windows and verifies division/category/closure renderers use `pageWindow(...).items`, accessible pager hooks, and focus restoration. Exact Chromium descendant and long-task budgets remain preview-stage verification.
- `uat-snapshot-terminal-401-retry-enabled-v1`: closed locally. The new QC regression proves 401 and 403 retain last-good facts, latch `terminalAuthorization`, and reduce a 20-attempt retry burst to zero additional effects; source assertions prove disabled toolbar refresh and re-entry-only copy without terminal retry markup.
- `qc-footer-320-rtl-edge-clipping-v1`: closed for deterministic integration contract. The new QC regression verifies the app-owned 320px body reset, footer border-box width, shrinkable fields/BDI wrapping, one semantic footer marker, and unchanged packaged footer ownership. Exact Chromium bounding boxes remain preview-stage verification.

The actual packaged SDK is byte-identical to the controller fixture (`ee67f5ae...c414bf1`), and harness tests passed 2/2 through the supplied GuestBridge. The new QC file digest is `c82ed234b0f19ecae1168bda3298ea594262cbe41e2d1941a46dd87183be1c41`.

## Limitations

The controller-denied deployed preview origin was not accessed. Therefore exact preview screenshots, computed 320/390/1440 geometry, zoom/contrast, delivered headers, browser console/network, dashboard descendant counts, render/long-task measurements, and stamped release-version/head equality are not claimed. Synthetic fixture permission decisions are not tenant permission proof.

