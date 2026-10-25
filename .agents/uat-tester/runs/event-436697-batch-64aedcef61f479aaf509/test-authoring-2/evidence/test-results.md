# Test evidence

Runtime: Node.js v20.20.2.

## Commands and results

From `/workspace/src/apps/milgam-dashboard`:

`node --version && node --test tests/uat/*.test.mjs`

- 13 passed, 0 failed, 0 skipped, 0 cancelled.
- Total duration: 174.622 ms.
- Three-call initial-load start spread remained below the asserted 50 ms ceiling.
- Generation burst: 9 superseded signals aborted; only generation 10 committed.
- Representative mapper measurements after warm-up:
  - 0 rows: 27 decoded bytes, 0.007 ms, 0 unique.
  - 1 row: 127 decoded bytes, 0.010 ms, 1 unique.
  - 1,000 rows: 103,422 decoded bytes, 2.974 ms, 1,000 unique.
  - 10,000 rows: 1,043,924 decoded bytes, 25.370 ms, 10,000 unique.

From `/workspace/src/apps/milgam-dashboard/site`:

`npm test`

- 49 passed, 0 failed, 0 skipped, 0 cancelled.
- Total duration: 288.733 ms.

## Remediation evidence

- `uat:equipment-identical-dedup:envelope-cardinality:v1`: closed. UAT-002 accepts two identical EquipmentId 101 facts with envelope TotalCount 1 and maps total 1.
- `QC-HOST-BOUNDARY-001`: closed for deterministic UAT. UAT-006 rejects plain and public-marker-forged objects before fetch, verifies zero fetch/command effects, and proves accepted token data is frozen and cannot be replaced.
- UAT test SHA-256: `e32a4e29f1912b7af600a658d88cbb7b73bc0d8cbca44d0fbad4c5e6bd09f4da`.

## Limitations

- No controller-authorized exact preview URL/digest, browser harness, or approved SimplyLog host was supplied in this test-authoring stage.
- Browser viewport render timing, DOM cardinality, keyboard interaction, visual RTL/LTR layout, 20 physical rapid activations, and real host command integration were not executed; module/source contracts are diagnostic evidence only.
- No tenant token, real network, production data, external write, or lifecycle action was used.
