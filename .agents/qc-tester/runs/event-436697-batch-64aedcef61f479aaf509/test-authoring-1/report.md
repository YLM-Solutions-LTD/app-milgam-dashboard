{
  "schemaVersion": 1,
  "batchKey": "event-436697-batch-64aedcef61f479aaf509",
  "appName": "milgam-dashboard",
  "stage": "test-authoring",
  "cycle": 1,
  "outcome": "rejected",
  "summary": "Process attempt 2 rejects T-101 through T-107. Expanded deterministic QC covers transport, trust, adapters, stale responses, failures, recovery, repetition, static responsive/accessibility/visual contracts, RTL/LTR, regression and flag safety. Eight of 11 QC tests pass; three reproduce two high-severity defects. The read-only app regression passes 47/47. No external effect occurred.",
  "handledActionIds": [536946, 536949, 537034, 537037, 537040],
  "roles": [{
    "role": "qc-tester",
    "verdict": "reject",
    "taskIds": ["T-101", "T-102", "T-103", "T-104", "T-105", "T-106", "T-107"],
    "evidence": [
      ".agents/qc-tester/runs/event-436697-batch-64aedcef61f479aaf509/test-authoring-1/evidence.md",
      ".agents/qc-tester/runs/event-436697-batch-64aedcef61f479aaf509/test-authoring-1/report.md",
      "tests/qc/snapshot-qc.test.js (SHA-256 db57cb9b47c2a73174dba5fd3ca3272cd12d71cf6ff6623c17586cbba93be0ac)"
    ]
  }],
  "findings": [
    {"fingerprint":"QC-HOST-BOUNDARY-001","severity":"high","confidence":"high","taskIds":["T-101","T-104"],"evidence":"site/host-context.js:49-62; failing QC subtest 2","reproduction":"Run node --test tests/qc/*.test.js; observe unbound-object assertion fail with Missing expected exception."},
    {"fingerprint":"QC-EQUIPMENT-DEDUPE-001","severity":"high","confidence":"high","taskIds":["T-101","T-102","T-106"],"evidence":"site/api-client.js:164-172; site/current-snapshot.js:100-103; failing QC subtests 4-5","reproduction":"Run node --test tests/qc/*.test.js; observe identical EquipmentId rows rejected before deduplication."}
  ]
}
