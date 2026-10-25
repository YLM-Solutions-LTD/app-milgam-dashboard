# QC evidence — cycle 3, process attempt 2

Complete inventories included QC `*.test.js` and `*.test.mjs`, UAT `*.test.mjs`, site tests, and the controller harness. The actual packaged SimplyVibeClient and controller GuestBridge ran at fully intercepted `https://milgam.ylm.co.il/controller-host-fixture/`; no fake adapter/readiness, tenant token/traffic, deployment, Git, provider, or lifecycle mutation occurred.

Exact commands from `/workspace/src/apps/milgam-dashboard`:

1. `cd site && npm test` — 61 passed, 0 failed, 0 skipped.
2. `node --test tests/qc/*.test.js tests/qc/*.test.mjs` — 34 passed, 0 failed, 0 skipped.
3. `node --test tests/uat/*.test.mjs` — 23 passed, 0 failed, 0 skipped.
4. `node --test /workspace/.simplyvibe/input/controller-host-harness/host-fixture.test.mjs` — 2 passed, 0 failed, 0 skipped.
5. `node /workspace/.simplyvibe/operator-recovery/20261026-refresh-guard/milgam-refresh-burst-local.cjs .agents/qc-tester/tmp/test-authoring-3-attempt-2/browser-refresh-burst.json` — both 390×844 and 1440×900 passed: exactly 3 burst current requests, peak concurrency 3, 0 revoked requests, exactly 3 fresh-re-entry requests, and 0 page errors.

`tests/qc/snapshot-qc.test.js` now checks that snapshot refresh, analytical refresh, and stale/error retry enter the same synchronously acquired pending operation, coalesce a mixed burst, retain the lock through verification/snapshot settlement, and release it for a later retry. The browser replay adds actual app/bridge lifecycle evidence, so the conclusion is not source-regex-only.

All cycle-3 fingerprints are closed in fresh local evidence: terminal 401/403 taint until distinct re-entry; exactly one three-request automatic fresh-generation load; last-good retention on 500/401; permit single-flight through settlement; handled reset/disposal/overlapping re-entry with no unhandled rejection; silent-disconnect denial; and refresh-burst amplification reduced to exactly three requests. T-201 through T-205 remain covered.

Limitations: this is the local release candidate, not a newly controller-selected deployed preview identity. CDN-delivered artifact/header identity and real tenant permission configuration remain controller concerns; synthetic permission decisions are not tenant proof.
