# UAT plan-review approach — revision 12

- Treat frozen inputs, shared plan/task board, site, prior reports, and controller harness as read-only; write only in the UAT role home.
- Reconcile action `570021` (`includeDescription=false`) and every structure task `T-301`–`T-305` against current source and accepted/archived report evidence.
- Verify the current remediation-manifest condition directly; never reconstruct absent controller data.
- Design stable end-to-end workflows for authorized entry, From/To validation and transport, generation isolation, decimal-string snapshot counts, failure/re-entry, actual-SDK navigation, performance/accessibility, all-state release metadata, and release gating.
- Discover all applicable JS/MJS/CJS test/spec files and execute the configured site, complete QC, complete UAT, and controller-harness suites. These baseline diagnostics validate the repaired environment, not the unimplemented candidate.
- Reserve exact-preview PASS claims for final review through the actual packaged SDK and controller GuestBridge with locally intercepted traffic. Do not access the controller-denied origin or treat synthetic permission decisions as tenant proof.
