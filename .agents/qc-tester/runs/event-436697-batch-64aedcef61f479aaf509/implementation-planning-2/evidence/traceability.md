# Planning evidence and traceability

## Input identity

- Batch/app/stage/cycle: `event-436697-batch-64aedcef61f479aaf509` / `milgam-dashboard` / `implementation-planning` / `2`.
- Action IDs, preserved exactly: `[536946,536949,537034,537037,537040]`.
- `includeDescription` is `false`; event description is excluded.
- Authoritative structure is plan revision 3 and unchanged task IDs `T-101` through `T-107`.
- Read-only accepted context reconciled: planner planning-2 and remediation-planning-2; UI, security, performance, and UAT plan-review-2 reports/evidence; implementer implementation-planning-1 and implementation-1 reports/evidence; QC implementation-planning-1 and test-authoring-1 reports/evidence.

## Revision-3 reconciliation

| Stable concern | Revision-3 requirement | Planned proof | Disposition now |
|---|---|---|---|
| `QC-HOST-BOUNDARY-001` | Bound immutable context must carry non-forgeable private provenance; public markers are insufficient. | QC-202 negative matrix and late-context recovery; QC-212 mutation gate. | Required regression gate; not executed in this stage. |
| `QC-EQUIPMENT-DEDUPE-001` | Equipment dedupes normalized identical IDs before comparing unique population with envelope total. | QC-204 exact former failure fixtures plus conflict/mismatch/volume; QC-212 mutation gate. | Required regression gate; not executed in this stage. |
| Zero vs unavailable | Errors, missing shapes, and unresolved classifications cannot become zero. | QC-203, QC-204, QC-207. | Fully planned. |
| Independent snapshot lifecycle | No period-triggered current calls; newest complete generation commits atomically. | QC-201, QC-205, QC-211. | Fully planned. |
| Exact host services | Raw dates and exact unfiltered navigation, bound to accepted source/origin. | QC-202, QC-206. | Fully planned; approved host needed later. |
| Numeric performance evidence | Three calls, 50 ms spread, 100 ms mapping, 50 ms renders, bounded DOM, burst counts. | QC-201, QC-204, QC-205, QC-206, QC-210, QC-212. | Fully planned; measurements deferred. |

## Required evidence at execution

- Automated: sanitized request ledger, typed-error table, mapper fixtures/timings/bytes, state/generation/abort log, command/date call log, trust zero-effect counters, DOM/accessibility snapshots, test command results, and redaction scan.
- Preview: exact preview identity/digest, approved host/harness identity, browser/OS/viewports/DPR/direction, screenshot matrix, geometry/zoom data, accessibility tree/scanner/contrast/focus logs, console/network/assets trace, interaction recording, and performance trace.
- No plan statement, local page load, or static screenshot may substitute for authenticated host behavior or exact-preview interaction evidence.

## Planning verdict basis

Every task acceptance criterion is mapped to at least one focused case, and critical behavior has both positive and negative coverage. The two prior high-confidence defects are preserved as explicit stop-gates with their stable fingerprints. Therefore the QC test plan is ready for implementation/test-authoring, while application quality and remediation remain unverified.

