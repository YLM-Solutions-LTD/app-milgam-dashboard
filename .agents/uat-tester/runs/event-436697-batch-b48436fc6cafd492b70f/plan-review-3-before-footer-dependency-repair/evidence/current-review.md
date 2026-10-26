# Current revision-11 UAT evidence

## Identity and remediation reconciliation

- `plan.md`: revision 11, SHA-256 `0f14eb8c7253949a7d9dd158e444e0fd114a867417839a0b95ad569d3c59b408`.
- `tasks.json`: revision 11, SHA-256 `67e6bc68f33f48b15675e0d3df34f8d4d0568cd3506721fe73798c68746f0e0a`.
- Frozen action order is exactly `[570021]`; `includeDescription=false` (`plan.md:5-9`; `tasks.json`).
- `/workspace/.simplyvibe/input/remediation-cycle-3.json` was directly checked and is absent. Because no manifest exists, there are no supplied cycle-3 fingerprints to enumerate or reconstruct. Revision 11 accurately records the absence as controller packaging state (`plan.md:27-32`) and preserves current-source reconciliation. This is a verified explanation, not an application defect or readiness claim.
- Historical `perf:plan:range-and-count-release-missing-measurable-budgets:v1` remains resolved by revision-11 analytical budgets (`plan.md:67-68`), snapshot budgets (`plan.md:86-87`), and required measurement evidence (`plan.md:91-104`).

## Current-source evidence

- `T-301/T-302`: `site/date-range.js:8-14` still creates month-only bounds ending `T23:59:59`; `site/dashboard-machine.js:93-150` still models selected periods; `site/app.js:154-176` still couples analytical retry to snapshot refresh. Revision 11 explicitly requires draft/applied From/To state, `.997`, four identical generation-bound requests, refresh semantics, and isolation (`plan.md:34-68`).
- `T-303`: `site/current-snapshot.js:26-56,116` still sends all five named aggregate fields through a number-only safe-integer guard, while `site/current-snapshot.js:60-73,111-116` shows the envelope/equipment contract to preserve. Revision 11 specifies field-limited decimal-string normalization, strict rejection/reconciliation, bounded diagnostics, terminal authorization handling, and exact snapshot topology (`plan.md:70-87`).
- `T-304`: revision 11 requires exact authorized-preview execution through the actual packaged SDK/GuestBridge at the fully intercepted trusted fixture origin and expressly forbids fake readiness/adapters or synthetic-permission tenant claims (`plan.md:89-104`; controller harness README).

## Complete inventory and diagnostic execution

Discovery covered repository and controller harness predicates for `*.test.{js,mjs,cjs}` and `*.spec.{js,mjs,cjs}`.

- Site: 9 JS files under `site/tests/`.
- QC: `tests/qc/snapshot-qc.test.js`, `operator-reentry-race.test.mjs`, `sdk-bridge-qc.test.mjs`.
- UAT: `tests/uat/current-snapshot.uat.test.mjs`, `verified-host-bridge.uat.test.mjs`.
- Harness: `/workspace/.simplyvibe/input/controller-host-harness/host-fixture.test.mjs`.
- No CJS or spec files exist.

Fresh commands and outcomes on 2026-10-26:

- From `site/`, `npm test` -> exit 1; 50 total, 49 pass, 1 fail, 0 skipped. `site/tests/dashboard-machine.test.js` failed before execution with `ERR_MODULE_NOT_FOUND: Cannot find package 'xstate'`. The configured script is `node --test tests/*.test.js`; `site/package.json` declares devDependency `xstate: 4.38.3`, but it is not installed. No site-suite pass is claimed.
- From app root, `node --test tests/qc/snapshot-qc.test.js tests/qc/operator-reentry-race.test.mjs tests/qc/sdk-bridge-qc.test.mjs` -> exit 0; 34/34 pass, 0 skipped.
- From app root, `node --test tests/uat/current-snapshot.uat.test.mjs tests/uat/verified-host-bridge.uat.test.mjs` -> exit 0; 23/23 pass, 0 skipped.
- From controller harness, `node --test host-fixture.test.mjs` -> exit 0; 2/2 pass, 0 skipped.

These are plan-stage diagnostics on current source, primarily carrying earlier task IDs. They do not execute revision-11 preview cases and do not establish implementation or release readiness. Revision 11 correctly requires dependency restoration and an unchanged complete-suite pass on the exact candidate before a later readiness claim (`plan.md:31,91-104`).
