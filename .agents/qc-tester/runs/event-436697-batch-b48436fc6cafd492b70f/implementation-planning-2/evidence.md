# QC planning evidence — cycle 2

## Identity and inputs

- Shared plan revision 13 SHA-256: `46c77fd80d12cb56e7d2bc6b830fed1736d4906a4c2df1b685b16cbb35af9a9f`.
- Shared tasks SHA-256: `a5407b56bb46631b935dbfa7be4e0de92fb25265b0970ddef85acdb0f532b5c5`.
- Frozen action acknowledgement: `[570021]`; `includeDescription=false`.
- Accepted current-batch plan-review-3 reports for performance, security, UAT, and UI were read as prior plan evidence, not reused as implementation approval.
- The builder footer reference and packaged JS/CSS/HTML were reviewed. App footer JS and CSS remain byte-identical to the repaired package: JS `bd3aa96202a55cd9533d2d4dca2c2c49e62aafc6035fe81448fe809a0959c08a`; CSS `8630140fc81581724156afa21d80393359561fdcc8c11d1567aab1385c1daa31`.
- The controller harness requires the actual SDK/GuestBridge at fully intercepted `https://milgam.ylm.co.il/controller-host-fixture/`. No fake adapter/readiness, tenant traffic, or denied Pages-origin access is permitted.

## Complete discovered inventory

- Site JS (11): `api-client.test.js`, `current-snapshot.test.js`, `dashboard-data.test.js`, `dashboard-machine.test.js`, `data-mappers.test.js`, `date-range.test.js`, `host-bootstrap.test.js`, `host-context.test.js`, `host-services.test.js`, `release-footer.test.js`, `ui-contract.test.js`.
- QC (4): `snapshot-qc.test.js`, `operator-reentry-race.test.mjs`, `range-footer-qc.test.mjs`, `sdk-bridge-qc.test.mjs`.
- UAT MJS (3): `current-snapshot.uat.test.mjs`, `range-footer.uat.test.mjs`, `verified-host-bridge.uat.test.mjs`.
- Harness MJS (1): `/workspace/.simplyvibe/input/controller-host-harness/host-fixture.test.mjs`.
- No matching `*.test.cjs` or `*.spec.{js,mjs,cjs}` files exist.

## Fresh unchanged-source baseline

Process attempt 2 rediscovered the same complete six-extension inventory and reran every configured suite; the results below are the current attempt-2 results, not an earlier-cycle substitution.

1. From `site/`, `npm test` (configured command `node --test tests/*.test.js`) -> exit 0; 67/67 pass; 0 fail, skip, cancel, todo.
2. From app root, `node --test tests/qc/*.test.js tests/qc/*.test.mjs` -> exit 0; 43/43 pass; 0 fail, skip, cancel, todo.
3. From app root, `node --test tests/uat/*.test.mjs` -> exit 0; 29/29 pass; 0 fail, skip, cancel, todo.
4. From app root, `node --test /workspace/.simplyvibe/input/controller-host-harness/host-fixture.test.mjs` -> exit 0; 2/2 pass; 0 fail, skip, cancel, todo.

These passes establish the repaired local environment and complete inventory only. They do not test revision-13 remediation because source has not changed in this planning stage.

The repaired packaged renderer was also rechecked byte-for-byte in process attempt 2. Its exact environment guard accepts only `preview` or `production`; `undefined`, empty, `PREVIEW`, `staging`, and `production ` are covered by the current five-variant site test and yield Unavailable for version, update, and release.

## Current fingerprint evidence and required closure

- `perf-preview-analytical-1000-row-unbounded-dom-long-tasks-v1` remains reproducible by source structure: `site/app.js:440-471` maps every division into an SVG segment plus legend item, `:500-510` maps every category into a bar, and `:513-540` maps every closure item into a table row. Accepted preview evidence measured 13,066 descendants and 115–152 ms long tasks. QC-323/QC-324 require fresh before/after local-browser evidence and <=600 descendants/no >=50 ms app task.
- `uat-snapshot-terminal-401-retry-enabled-v1` remains reproducible: `site/current-snapshot.js:87-108` stores a bounded error but no persistent terminal-denied state; `site/app.js:274-299` disables refresh only for pending/loading/disabled and emits retry buttons for error and stale states. QC-325/QC-326 require terminal 401/403/revocation denial until distinct verified re-entry.
- `qc-footer-320-rtl-edge-clipping-v1` remains reproducible from accepted browser evidence and the integration seam: `site/app.css:31-34` combines `min-inline-size:320px` with hidden horizontal overflow while the unchanged packaged footer uses full-width padding/border. QC-327 requires before/after geometry at 320x844 RTL without counting clipped overflow as success.

## Readiness assessment

Revision 13 is QC-implementation-ready: all three current fingerprints have explicit before/after gates, every T-301–T-305 acceptance criterion maps to QC-321–QC-333, and deterministic versus intercepted-browser versus later exact-preview evidence is separated. The three defects remain `implementation_required`; no fix, preview approval, tenant proof, production publication, or controller completion is claimed.
