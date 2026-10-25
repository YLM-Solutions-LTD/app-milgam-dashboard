# QC test-authoring cycle 2 evidence

## Identity and constraints

- Batch: `event-436697-batch-7b4c276304a7e351ea41`
- App/stage: `milgam-dashboard` / `test-authoring` cycle 2 attempt 1
- Runtime: Node.js `v20.20.2`
- Inputs: frozen controller inputs, shared plan revision 6/tasks, implementation cycle-2 report, corrected controller harness and verified vendor files.
- No tenant token, network request, deployment, Git/provider operation, lifecycle API, fake adapter, or fake readiness path was used.

## Commands and results

From `/workspace/src/apps/milgam-dashboard`:

```sh
node --test tests/qc/*.test.js tests/qc/*.test.mjs
(cd site && npm test)
node --test tests/uat/*.test.mjs
node --test ../../../.simplyvibe/input/controller-host-harness/host-fixture.test.mjs
node --check site/app.js
node --check site/host-bootstrap.js
sha256sum tests/qc/*.test.* site/assets/simplyvibe-client.js ../../../.simplyvibe/input/controller-host-harness/vendor/simplyvibe-client.js
```

- QC: 28 passed, 0 failed, 0 skipped.
- Site regression: 59 passed, 0 failed, 0 skipped.
- Accepted UAT present at execution time: 16 passed, 0 failed, 0 skipped. `tests/uat/` is owned by the concurrent UAT role and was not edited.
- Controller SDK/GuestBridge fixture: 2 passed, 0 failed, 0 skipped.
- Syntax checks: 2 passed.
- Packaged client and supplied verified client SHA-256: `ee67f5ae15c70fee8443701b4391946a2275d922acdf9d1797c69dad3c414bf1` for both.
- New real-transport QC file SHA-256: `e7e45c093bcb07f4a1e8db509c34dee53f66421afb649ffeaaddcb800f262ac1`.

Raw TAP and hash evidence is under `evidence/` in this run folder.

## Coverage and observations

- `T-201`: release flag remains true; verified contexts authorize exactly three concurrent `{}` snapshot calls; rejected contexts authorize none; analytical period transport remains isolated.
- `T-202`: strict local CSP/static chart presentation, accessible exact values, focus, responsive source contracts, and RTL/LTR locale resolution remain covered.
- `T-203`: strict mapping, identical/conflicting duplicate behavior, failure/error/stale states, latest-generation wins, bounded diagnostics, focus cleanup, 10-refresh suppression, and 10,000-row mapping remain covered. Recorded warm 10,000-row QC runs were `23.284–26.363 ms` for `2,083,924` decoded bytes, below 100 ms.
- `T-204`: deterministic source/transport checks cover same-origin assets, no adapter dependency, exact command payload, CSP rules, responsive/a11y/visual source contracts, and marker-free error serialization. A deployed browser preview was not supplied for this stage.
- `T-205`: the new QC suite evaluates the actual packaged SDK and supplied GuestBridge at `https://milgam.ylm.co.il`; it proves Ready, exact Navigate, zero old pending-command effects after rotation, old bound-context revocation/denial, and recovery with synthetic generation 2.

## Stable findings

- `verified-guest-sdk-command-path-missing-v1`: closed for deterministic source/integration regression.
- `host-session-revocation-must-invalidate-legacy-context-v1`: closed for deterministic command/capability regression.
- `api-diagnostics-response-body-disclosure-v1`: closed for deterministic error serialization/console regression.
- `qc-controller-harness-frame-ancestor-missing-v1`: obsolete/superseded controller-fixture configuration finding; it was not used to widen origins or CSP.

## Limitations

- No exact deployed preview identity was supplied for this test-authoring stage. Computed 390×844/1440×900 geometry, screenshots, zoom, contrast, focus appearance, delivered CSP headers, browser console/network, render/DOM budgets, and third-party request inspection remain unexecuted.
- The local real bridge proves SDK command/session behavior but does not replace the next exact-preview browser exercise of in-flight API abort, stale retention, refresh denial, and full app re-entry.
- This is QC evidence only, not controller deployment or release authorization.
