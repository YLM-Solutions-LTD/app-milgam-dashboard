# QC test-authoring evidence

## Identity

- Batch/app/stage/cycle/process attempt: `event-436697-batch-64aedcef61f479aaf509` / `milgam-dashboard` / `test-authoring` / `1` / `2`.
- Tasks: `T-101`–`T-107`; actions in frozen order: `[536946,536949,537034,537037,537040]`; `includeDescription=false`.
- Runtime: Node `v20.20.2`, npm `10.8.2`.
- QC test SHA-256: `db57cb9b47c2a73174dba5fd3ca3272cd12d71cf6ff6623c17586cbba93be0ac`.

## Exact commands and results

1. `node --test tests/qc/*.test.js` from app root: 11 tests, 8 passed, 3 failed, 0 skipped; exit 1; 77.309084 ms.
2. `npm test` from read-only `site/`: 47 tests, 47 passed, 0 failed, 0 skipped; exit 0; 175.73015 ms.
3. `sha256sum tests/qc/snapshot-qc.test.js site/host-context.js site/api-client.js site/current-snapshot.js && node --version && npm --version`: QC `db57cb...e0ac`; host `94c293...b9d`; client `fb1d72...602`; mapper `859433...1d0`.

Synthetic postMessage events, a literal non-secret token canary, in-memory API fixtures, and stubbed host services were used. No network, tenant token, preview, deployment, provider, Git, or lifecycle API was used. Browser visual interaction was not run at this test-authoring stage; static responsive, focus, semantic, and bidi contracts were checked.

## Coverage

- `T-101/T-103`: exact concurrent three-POST fan-out, `{}` bodies, authorization and domain separation passed.
- `T-101/T-104`: wrong source/origin, HTTP origin and cross-environment API denial passed; forged unbound context failed.
- `T-102`: event/permit/equipment adapters exercised; identical equipment dedupe failed at transport and mapper.
- `T-103/T-106`: abort/newest-generation/stale retention, sanitized errors, HTTP 400/401/403/500, offline, timeout-like abort, malformed response and valid zero passed.
- `T-104/T-105`: raw-date delegation, exact ready-before-Navigate order/URL and three repeated activations passed.
- `T-105/T-106`: landmark/status/buttons, names, 3 px focus, 44 px controls, responsive stack and RTL/LTR passed.
- `T-107`: local live-call flag false passed. Existing regression passed 47/47.

## Findings

### QC-HOST-BOUNDARY-001 — high / high confidence

- Tasks: `T-101`, `T-104`.
- Evidence: `site/host-context.js:49-62` accepts caller-supplied `__trustedHostOrigin` without requiring `__hostContextBound === true`; authenticated client construction therefore succeeds. QC subtest 2 fails with `Missing expected exception`.
- Reproduction: run `node --test tests/qc/*.test.js`; observe subtest 2. The fixture performs no fetch.

### QC-EQUIPMENT-DEDUPE-001 — high / high confidence

- Tasks: `T-101`, `T-102`, `T-106`.
- Evidence: `site/api-client.js:164-172` and `site/current-snapshot.js:100-103` enforce `TotalCount === Items.length` before EquipmentId dedupe. Two identical `EQP-DUP` rows with complete-population `TotalCount: 1` fail QC subtests 4 and 5.
- Reproduction: run `node --test tests/qc/*.test.js`; observe `DatasetValidationError` and `DashboardRequestError` in subtests 4 and 5.

Writes were limited to `tests/qc/`, this current run folder and QC memory.
