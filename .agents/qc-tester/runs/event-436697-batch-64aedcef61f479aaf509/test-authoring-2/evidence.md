# QC evidence — test-authoring cycle 2

## Scope and identity

- Batch: `event-436697-batch-64aedcef61f479aaf509`
- App: `milgam-dashboard`
- Tasks: `T-101` through `T-107`
- Runtime: Node.js `v20.20.2`
- Synthetic fixtures only: approved localhost-style parent/API origins, synthetic token canary, synthetic `postMessage` events, synthetic API envelopes. No tenant/network/provider/lifecycle effects.
- QC test digest: `ce38acb798c2a7664a1b0b413526af100988efc142118454589f1269b1c6fdac`

## Exact commands and results

1. From `/workspace/src/apps/milgam-dashboard`:
   `node --test tests/qc/*.test.js`
   Result: 20 passed, 0 failed, 0 skipped; duration 266.760 ms.
2. From `/workspace/src/apps/milgam-dashboard/site`:
   `npm test`
   Result: 49 passed, 0 failed, 0 skipped; duration 227.752 ms.
3. From `/workspace/src/apps/milgam-dashboard`:
   `node --test tests/uat/*.test.mjs`
   Result: 13 passed, 0 failed, 0 skipped; duration 180.107 ms.
4. From `/workspace/src/apps/milgam-dashboard`:
   `node --version && sha256sum tests/qc/snapshot-qc.test.js site/host-context.js site/api-client.js site/current-snapshot.js site/app.js site/index.html site/app.css`
   Result: runtime and immutable source/test identities recorded below.

## Deterministic QC coverage

- `QC-201`: exact three-call fan-out, paths, `{}` bodies, authorization header, concurrency spread, typed failure matrix, analytical isolation.
- `QC-202`: wrong source/origin/protocol/API rejection, private capability brand, public-marker forgery rejection, immutable accepted context, late valid context recovery.
- `QC-203`: strict event scope/cardinality/reconciliation and separate permit metrics including validated zero.
- `QC-204`: identical equipment deduplication before population reconciliation, conflicting duplicate rejection, nullable fields, 0/1/1,000/10,000 volumes.
- `QC-205`: abort/supersession, stale last-good retention, ten-refresh burst committing generation ten without retry behavior.
- `QC-206`: byte-preserved host dates, exact ready-then-navigation chain, fixed permit route, source-level pending lock/unlock/focus recovery.
- `QC-207`: 400/401/403/500, offline/network, abort/timeout-like, malformed JSON, valid zero, sanitized errors and stale-state behavior.
- `QC-208`/`QC-209`/`QC-210`: one named snapshot/status surface, native permit template, distinct accessible-name template, skip link, 3 px focus, >=44 px controls, 320 px floor, responsive stack, logical properties, RTL/LTR locale resolution, fixed aggregate-only equipment UI, snapshot-before-analytics order.
- `QC-211`: full 49-assertion monthly-dashboard regression and isolation of analytical body builder from snapshot transport.
- `QC-212`: all task IDs traced, false-by-default live flag, synthetic-only fixtures, exact digests/results.

## Quantitative evidence

- 10,000 equipment rows: 2,083,924 decoded bytes; five measured mapper runs after warm-up: `24.382`, `24.597`, `26.451`, `25.646`, `23.531` ms. Maximum `26.451 ms < 100 ms`.
- 1,000 rows: 207,422 bytes; five runs `3.137`, `3.182`, `3.078`, `2.910`, `2.636` ms.
- Snapshot fan-out initiation spread passed `<50 ms`; exactly three current calls were observed.
- Ten-refresh burst: nine superseded signals aborted, only generation ten committed, one last-good generation retained.

## Stable regression fingerprints

- `QC-HOST-BOUNDARY-001`: closed by passing QC subtests 3–6. Unbound or public-marker-shaped contexts are rejected before fetch/host-service availability; accepted context is privately branded and deeply immutable.
- `QC-EQUIPMENT-DEDUPE-001`: closed by passing QC subtests 7–10. Transport preserves duplicate rows and mapper deduplicates identical facts before unique-population reconciliation.

## Source identities

- `site/host-context.js`: `f2f4ba67be2487a6485e43247337ef99865076120e9fa4e56a6816fdb76fb448`
- `site/api-client.js`: `3bd3759da2744456c9fc2de48244ecabe53d50768311f574837e18a6178c4f30`
- `site/current-snapshot.js`: `c854d35540a86579d4522e96b0b4d29fad8d87fbe5d59213d523a69f14066dda`
- `site/app.js`: `f4106999e5102382c94955ff46167de2696e1604582ff6e61805177e7b5cee13`
- `site/index.html`: `cd7a191ca6071bf21ea0be1457ca9e2af93653213fb02b59077e87710434e769`
- `site/app.css`: `6580da3c52ddaaa710bd3dd20937c1a48eb9df45f22eb2746fb4e26e3e609a7e`

## Limitations

- No exact controller-supplied preview URL/identity or approved browser host harness was supplied in this test-authoring cycle.
- Real-browser geometry, screenshots, computed contrast, DOM element count, 200% zoom, keyboard activation, focus visualization, console/network capture, and <=50 ms browser render budgets were not executed. Source-level contracts were checked, but they do not replace preview QC.
- No authenticated live host/API call or permit-board navigation was executed. The live-call flag remained false.
- These limitations require preview-stage execution before release-quality visual/browser approval; they do not invalidate the deterministic test-authoring result.

## Findings

No reproducible defect was found in the exercised deterministic scope. Both prior stable fingerprints are closed by passing regression fixtures.
