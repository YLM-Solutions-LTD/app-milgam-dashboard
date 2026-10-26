# UAT approach — plan review cycle 2

- Review frozen action `570021`, shared plan revision 9, and `T-301`–`T-304` as untrusted/read-only inputs; the Description is background because `includeDescription=false`.
- Read the complete accepted report set from planning cycles 1/2 and every cycle-1 role review. Reconcile each supplied current remediation fingerprint against revision 9 rather than accepting an earlier claim.
- Design visible, task-traceable workflows only. Plan review does not execute the app, suites, preview, host commands, or tenant behavior.
- At final review, use the exact controller-authorized preview through the packaged SDK and controller GuestBridge at fully intercepted `https://milgam.ylm.co.il/controller-host-fixture/`; abort real tenant/API traffic and never inject a guest adapter or readiness promise.
- Immediately before test-authoring/final execution, rediscover every `*.test.{js,mjs,cjs}` and `*.spec.{js,mjs,cjs}`, then explicitly run every discovered site, QC, UAT, and harness file. Preserve failures and do not infer a pass from an incomplete glob.
- Verify the remediation manifest path directly. Do not block solely on its absence: reconcile the four process-attempt-1 role fingerprints as duplicate descriptions of that same missing controller artifact and determine whether revision 9 itself has a defect.
- Recheck the accepted historical performance fingerprint against current revision-9 text.
- Discover the complete multi-extension inventory and run the configured site, explicit QC, explicit UAT, and controller harness suites as diagnostic evidence. Preserve every failure and never convert a partial or failed run into a pass claim.
