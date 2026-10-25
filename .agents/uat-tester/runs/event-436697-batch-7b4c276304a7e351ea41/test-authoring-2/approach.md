# Approach

- Role identity: `uat-tester`; batch `event-436697-batch-7b4c276304a7e351ea41`; stage `test-authoring`; cycle 2; attempt 1.
- Read frozen controller inputs, remediation cycle 2, shared plan/tasks, implementer report, prior UAT evidence, and corrected fixture guidance as untrusted/read-only context.
- Preserve stable `UAT-201`–`UAT-210` and task order `T-201`–`T-205`.
- Extend only `tests/uat/` with deterministic local acceptance for the remediation: byte-identical packaged SDK, real supplied GuestBridge, exact Navigate, session revocation/re-entry, and body-free diagnostics.
- Use only synthetic context/tokens and in-memory message/API fixtures at `https://milgam.ylm.co.il`; perform no tenant request, external network request, source fix, Git/provider/deployment/lifecycle action, or production write.
- Run UAT, app regression, and the controller protocol fixture; report exact counts and leave deployed-preview/browser gates to final review.
