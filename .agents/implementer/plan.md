# Implementation plan

Batch: `event-436697-batch-7b4c276304a7e351ea41`  
Cycle: `implementation-1`, process attempt 2  
Frozen actions: `536946`, `536949`, `537034`, `537037`, `537040`, `547704`, `547710`, `547713`, `569787`, `569843` (`includeDescription=false`)

- [x] T-201: Set and tested the explicitly authorized release-candidate snapshot flag as `true`; preserved exact authenticated three-route `{}` concurrency and analytical-period independence.
- [x] T-202: Replaced chart inline styles with same-origin CSS classes and SVG presentation attributes; preserved strict CSP, exact accessible values, responsive RTL/LTR layout, focus, and visible chart semantics.
- [x] T-203: Extended deterministic regressions for flag and CSP-safe markup, then passed the existing adapter, private host binding, revocation/generation, snapshot race, permit focus, accessibility, analytical, and representative-volume tests.
- [x] T-204: Prepared and recorded source/static evidence; exact deployed-preview browser validation remains correctly assigned to the controller-owned preview stage and is stated as an external gate.
- [x] T-205: Preserved approved-host revocation/re-entry contracts and documented the external approved-host/release gate without simulating closure or performing deployment/lifecycle work.

Implementation order: `T-201` and `T-202` source changes → `T-203` regression and performance verification → `T-204` evidence handoff → `T-205` release-gate handoff.

Process attempt 2 revalidates the preserved implementation and refreshes only implementer-owned evidence/reporting unless focused checks expose a source defect.
