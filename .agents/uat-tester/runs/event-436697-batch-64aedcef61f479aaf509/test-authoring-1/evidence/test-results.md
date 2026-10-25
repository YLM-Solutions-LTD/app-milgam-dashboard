# Local UAT evidence — attempt 2

- Runtime: Node.js `v20.20.2`; synthetic host context/API fixtures only.
- Browser, exact preview, approved host: not supplied; not executed.
- Source SHA-256: `859433a41cea441b772cab7e7d2ff663ccaf28c2c017c82754be5833474716d0`.
- UAT SHA-256: `0c86c3fb6a7c66152a1744feeb3ad933463cb1b83f9ca161a02a5ad09a6ee2d2`.

## Commands

- `cd /workspace/src/apps/milgam-dashboard && node --test tests/uat/*.test.mjs`: exit 1; 13 tests, 12 passed, 1 failed, 0 skipped. UAT-002 rejected two identical EquipmentId rows with population `TotalCount: 1` before deduplication. Mapper rows 0/1/1,000/10,000 used 27/127/103,422/1,043,924 bytes and 0.006/0.010/2.772/25.402 ms.
- `cd /workspace/src/apps/milgam-dashboard/site && npm test`: exit 0; 47 passed, 0 failed, 0 skipped.

## Finding

Fingerprint `uat:equipment-identical-dedup:envelope-cardinality:v1`. `site/current-snapshot.js:61` invokes the generic envelope validator before building the EquipmentId map. Its `TotalCount === Items.length` rule rejects a population count of one with two identical facts before required deduplication. Reproduction is the assertion at `tests/uat/current-snapshot.uat.test.mjs:108`.

No browser, live-host, authenticated-tenant, network, or production-write check was run or claimed.
