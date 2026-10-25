# QC test-authoring cycle 2 plan

- Identity: `event-436697-batch-7b4c276304a7e351ea41`, `milgam-dashboard`, `test-authoring`, cycle 2, process attempt 1.
- Preserve task IDs `T-201` through `T-205`, action order `[536946,536949,537034,537037,537040,547704,547710,547713,569787,569843]`, and `includeDescription: false`.
- Retain the existing functional, failure, concurrency, responsive-source, accessibility-source, visual/CSP, RTL/LTR, and performance checks in `tests/qc/snapshot-qc.test.js`.
- Add deterministic real-transport checks using the packaged `SimplyVibeClient`, supplied `GuestBridge`, corrected Milgam fixture origin, synthetic context, and local message bus only.
- Prove exact `Navigate`, session rotation, zero old-command effects, old capability denial, and fresh-generation recovery without a fake adapter/readiness path.
- Run QC, site regression, accepted UAT, and controller fixture suites. Record exact counts, runtime, hashes, limits, and stable findings without inferring deployed-preview results.
