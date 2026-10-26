# UAT test-authoring evidence

## Inventory

Command:

`find site/tests tests/uat tests/qc /workspace/.simplyvibe/input/controller-host-harness -type f \( -name '*.test.js' -o -name '*.test.mjs' -o -name '*.test.cjs' -o -name '*.spec.js' -o -name '*.spec.mjs' -o -name '*.spec.cjs' \) -print | sort`

Discovered 11 site JS tests, 3 UAT MJS tests, 4 QC tests (1 JS, 3 MJS), and 1 controller-harness MJS test; no CJS or spec files.

## Exact commands and results

- `cd /workspace/src/apps/milgam-dashboard/site && npm test` — 67 passed, 0 failed, 0 skipped.
- `cd /workspace/src/apps/milgam-dashboard && node --test tests/uat/*.test.mjs` — 29 passed, 0 failed, 0 skipped.
- `cd /workspace/src/apps/milgam-dashboard && node --test /workspace/.simplyvibe/input/controller-host-harness/host-fixture.test.mjs` — 2 passed, 0 failed, 0 skipped.
- `cd /workspace/src/apps/milgam-dashboard && node --test tests/qc/*.test.js tests/qc/*.test.mjs` — 43 passed, 0 failed, 0 skipped (final complete rerun after concurrent QC authoring settled).

Runtime: Node.js v20.20.2. Browser: not executed in test-authoring.

## Evidence boundaries

- Synthetic context and API fixtures only; no real tenant token or tenant/deployed-origin request.
- The UAT actual-SDK workflows read the controller-supplied unmodified GuestBridge and compare the packaged SDK byte-for-byte with the supplied SDK.
- The release renderer and stylesheet compare byte-for-byte with the builder skill packaged assets.
- No exact preview, deployed release metadata, real tenant permissions, browser viewport/render timing, or production release is claimed.
