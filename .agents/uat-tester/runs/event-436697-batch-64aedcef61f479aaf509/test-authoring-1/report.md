{
  "schemaVersion": 1,
  "batchKey": "event-436697-batch-64aedcef61f479aaf509",
  "appName": "milgam-dashboard",
  "stage": "test-authoring",
  "cycle": 1,
  "attempt": 2,
  "outcome": "rejected",
  "summary": "Synthetic UAT is traceable across T-101 through T-107. Regression passed 47/47; UAT passed 12/13 and exposed rejection of identical duplicate equipment facts before required EquipmentId deduplication. Exact-preview, browser, live-host, and tenant checks were not supplied and are not claimed.",
  "handledActionIds": [536946, 536949, 537034, 537037, 537040],
  "includeDescription": false,
  "roles": [{
    "role": "uat-tester",
    "verdict": "reject",
    "taskIds": ["T-101", "T-102", "T-103", "T-104", "T-105", "T-106", "T-107"],
    "evidence": ["tests/uat/current-snapshot.uat.test.mjs", ".agents/uat-tester/runs/event-436697-batch-64aedcef61f479aaf509/test-authoring-1/cases.md", ".agents/uat-tester/runs/event-436697-batch-64aedcef61f479aaf509/test-authoring-1/approach.md", ".agents/uat-tester/runs/event-436697-batch-64aedcef61f479aaf509/test-authoring-1/evidence/test-results.md", ".agents/uat-tester/memory.md"],
    "testResults": {"uat":{"passed":12,"failed":1,"skipped":0},"regression":{"passed":47,"failed":0,"skipped":0},"runtime":"Node.js v20.20.2","browser":"not supplied; not executed"}
  }],
  "findings": [{
    "fingerprint": "uat:equipment-identical-dedup:envelope-cardinality:v1",
    "severity": "high",
    "confidence": "high",
    "taskIds": ["T-102", "T-106"],
    "caseId": "UAT-002",
    "title": "Identical equipment duplicates are rejected before required EquipmentId deduplication",
    "evidence": "site/current-snapshot.js:61 invokes requireEnvelope, whose cardinality rule rejects Items.length 2 with population TotalCount 1 before the map at lines 62-70 can deduplicate. tests/uat/current-snapshot.uat.test.mjs:108 fails with DatasetValidationError.",
    "reproduction": "Run node --test tests/uat/*.test.mjs from /workspace/src/apps/milgam-dashboard and observe UAT-002 fail for two identical EquipmentId 101 rows with TotalCount 1.",
    "impact": "A contract-valid duplicate response prevents the current snapshot from becoming ready instead of displaying the deduplicated equipment population."
  }]
}
