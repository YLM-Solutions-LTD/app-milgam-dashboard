# Test evidence

Runtime: Node.js v20.20.2.

Commands from `/workspace/src/apps/milgam-dashboard` unless noted:

1. `node --test tests/uat/*.test.mjs`
   - Passed: 16; failed: 0; skipped: 0.
   - 10,000-row equipment mapping: 29.751 ms after warm-up; decoded fixture bytes: 1,043,924; unique rows: 10,000.
   - Faithful bridge results: packaged SDK equality passed; generation-1 Navigate passed; revoked pending command produced zero effects; fresh generation-2 Navigate passed; synthetic response marker absent.
2. `npm test` from `/workspace/src/apps/milgam-dashboard/site`
   - Passed: 59 tests (57 top-level subtests plus 2 nested); failed: 0; skipped: 0.
3. `node --test .simplyvibe/input/controller-host-harness/host-fixture.test.mjs` from `/workspace`
   - Passed: 2; failed: 0; skipped: 0.

Fixture identity:

- Controller GuestBridge SHA-256: `320b7db387ffb2b8e94d8736b5ab14c8db74a84b3c3847124d59ec9f4c6853cf`.
- Supplied and packaged SimplyVibeClient SHA-256: `ee67f5ae15c70fee8443701b4391946a2275d922acdf9d1797c69dad3c414bf1`; byte equality asserted by UAT.
- Corrected synthetic parent origin: `https://milgam.ylm.co.il/controller-host-fixture/`.
- All API and protocol behavior was fulfilled locally/in memory with non-secret synthetic values. No real tenant/network request occurred.
