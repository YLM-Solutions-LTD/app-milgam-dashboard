{
  "schemaVersion": 1,
  "batchKey": "event-436697-batch-64aedcef61f479aaf509",
  "appName": "milgam-dashboard",
  "stage": "test-authoring",
  "cycle": 3,
  "outcome": "approved",
  "summary": "Deterministic synthetic UAT passes 13/13 across T-101 through T-107, including revocable authorization generations, late-result denial, fresh synthetic re-entry, guarded permit cleanup, local pinned XState/CSP source contracts, and flag-safe delivery. App regression passes 55/55. Exact-preview browser/CSP/network behavior and approved real-host authorization lifecycle were unavailable and are not claimed.",
  "handledActionIds": [536946, 536949, 537034, 537037, 537040],
  "includeDescription": false,
  "roles": [{
    "role": "uat-tester",
    "verdict": "approve",
    "taskIds": ["T-101", "T-102", "T-103", "T-104", "T-105", "T-106", "T-107"],
    "evidence": [
      "tests/uat/current-snapshot.uat.test.mjs",
      ".agents/uat-tester/runs/event-436697-batch-64aedcef61f479aaf509/test-authoring-3/approach.md",
      ".agents/uat-tester/runs/event-436697-batch-64aedcef61f479aaf509/test-authoring-3/cases.md",
      ".agents/uat-tester/runs/event-436697-batch-64aedcef61f479aaf509/test-authoring-3/evidence/test-results.md",
      ".agents/uat-tester/runs/event-436697-batch-64aedcef61f479aaf509/test-authoring-3/evidence/uat.tap",
      ".agents/uat-tester/runs/event-436697-batch-64aedcef61f479aaf509/test-authoring-3/evidence/site.tap"
    ],
    "testResults": {
      "uat": {"passed": 13, "failed": 0, "skipped": 0},
      "regression": {"passed": 55, "failed": 0, "skipped": 0},
      "runtime": "Node.js v20.20.2",
      "browser": "not supplied; not executed"
    }
  }],
  "limitations": [
    "No exact authorized preview was supplied, so runtime response CSP, executable requests, deployed bytes, browser geometry, focus variants, and render timings were not executed.",
    "No approved real SimplyLog host or faithful controller harness was supplied; synthetic context is diagnostic and does not prove the authorization lifecycle release gate."
  ],
  "findings": []
}
