{
  "schemaVersion": 1,
  "batchKey": "event-436697-batch-b48436fc6cafd492b70f",
  "appName": "milgam-dashboard",
  "stage": "test-authoring",
  "cycle": 2,
  "processAttempt": 1,
  "outcome": "ready",
  "handledActionIds": [570021],
  "includeDescription": false,
  "roles": [{"role":"qc-tester","verdict":"approve","taskIds":["T-301","T-302","T-303","T-304","T-305"],"evidence":["tests/qc/remediation-cycle-2.test.mjs",".agents/qc-tester/runs/event-436697-batch-b48436fc6cafd492b70f/test-authoring-2/evidence.md"]}],
  "summary": "Deterministic cycle-2 QC passes: site 72/72, QC 49/49, standalone UAT 33/33, harness 2/2; exact deployed-browser verification remains prohibited and unclaimed.",
  "findings": [{"fingerprint":"qc-concurrent-suite-performance-contention-v1","severity":"info","confidence":"high","taskIds":["T-304"],"status":"non_blocking_test_execution_observation","evidence":"One non-configured parallel run failed the 100ms mapper budget at 184.316ms; the required standalone UAT command passed 33/33 at 24.505ms."}]
}
