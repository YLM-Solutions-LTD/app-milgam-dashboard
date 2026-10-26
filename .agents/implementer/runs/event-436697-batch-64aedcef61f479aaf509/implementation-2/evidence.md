# Implementation cycle 2 evidence

## Source remediation

- `site/host-context.js`: accepted contexts are deep-copied, recursively frozen, and registered in a module-private `WeakSet` only after exact parent/source, approved HTTPS host origin, approved HTTPS API origin, and token validation. Public marker-shaped clones do not retain the capability.
- `site/api-client.js` and `site/host-services.js`: authenticated fetch and privileged host services require the private capability. Current searches retain exact `POST`, endpoint, authorization, `{}` body, and abort signal. Events/permits retain fixed report cardinality; equipment transport permits raw identical duplicates.
- `site/current-snapshot.js`: equipment normalizes/deduplicates in one `Map` pass, accepts field-identical duplicates, rejects conflicts, and compares unique population with outer `TotalCount`. Classification remains `unavailable`.
- `site/tests/host-context.test.js`, `site/tests/api-client.test.js`, `site/tests/current-snapshot.test.js`: added nested immutability, forged marker zero-effect, and identical-equipment duplicate regressions.

## Local test results

Runtime: Node.js `v20.20.2`; npm `10.8.2`. Synthetic fixtures only; no live token, tenant, or network.

- `cd site && npm test`: exit 0; 49 assertions passed, 0 failed, 0 skipped across 47 top-level tests.
- `node --test tests/qc/*.test.js`: exit 0; 11 passed, 0 failed, 0 skipped. Both prior fingerprints now pass.
- `node --test tests/uat/*.test.mjs`: exit 0; 13 passed, 0 failed, 0 skipped; UAT-001 through UAT-012 cover `T-101`–`T-107`.
- UAT mapper metrics: 0 rows / 27 bytes / 0.007 ms; 1 row / 127 bytes / 0.010 ms; 1,000 rows / 103,422 bytes / 3.038 ms; 10,000 rows / 1,043,924 bytes / 31.943 ms. All unique counts matched and the warmed 10,000-row result stayed below 100 ms.
- QC concurrent fan-out, abort/current-generation behavior, fixed UI contract, exact raw-date/navigation arguments, and live-flag assertions passed.
- Static scan found no `/odata/`, `SearchAllEvents`, API-key header, or source-shaped bearer secret. `CURRENT_SNAPSHOT_LIVE_CALLS_ENABLED` is `false` and gates only current snapshot loading in `app.js`.

## Task traceability

- `T-101`: private immutable capability, exact transport, zero-effect rejection.
- `T-102`: strict events/permits plus post-dedup equipment population semantics.
- `T-103`: independent three-call lifecycle and stale suppression (QC/UAT).
- `T-104`: capability-gated raw-date and exact permit navigation services.
- `T-105`: unchanged approved aggregate-only accessible RTL/LTR UI contract.
- `T-106`: production regressions plus full site/QC/UAT evidence.
- `T-107`: false local flag and controller-owned live/deployment boundary.

## Skipped/unavailable checks

- Authenticated live procedure/API verification: skipped; no approved host context or tenant token supplied.
- Exact deployed preview, real SimplyLog SDK/host bridge, browser identity, visual/accessibility inspection, DOM count, and 390×844/1440×900 render timings: skipped; no controller-authorized preview or browser harness supplied.
- No deployment, Git write, provider call, lifecycle call, SQL/backend/database change, or issue-tracker action was performed.
