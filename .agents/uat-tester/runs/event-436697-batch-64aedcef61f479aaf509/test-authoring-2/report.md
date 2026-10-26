{
  "schemaVersion": 1,
  "batchKey": "event-436697-batch-64aedcef61f479aaf509",
  "appName": "milgam-dashboard",
  "stage": "test-authoring",
  "cycle": 2,
  "outcome": "approved",
  "summary": "Deterministic synthetic UAT passes 13/13 across T-101 through T-107, including direct regressions for identical-equipment deduplication and non-forgeable immutable host context. The app regression passes 49/49. Exact-preview, real-browser, and approved live-host behavior were not supplied or claimed and remain final-review limitations.",
  "handledActionIds": [536946, 536949, 537034, 537037, 537040],
  "includeDescription": false,
  "roles": [{
    "role": "uat-tester",
    "verdict": "approve",
    "taskIds": ["T-101", "T-102", "T-103", "T-104", "T-105", "T-106", "T-107"],
    "evidence": [
      "tests/uat/current-snapshot.uat.test.mjs",
      ".agents/uat-tester/runs/event-436697-batch-64aedcef61f479aaf509/test-authoring-2/approach.md",
      ".agents/uat-tester/runs/event-436697-batch-64aedcef61f479aaf509/test-authoring-2/cases.md",
      ".agents/uat-tester/runs/event-436697-batch-64aedcef61f479aaf509/test-authoring-2/evidence/test-results.md",
      ".agents/uat-tester/memory.md"
    ],
    "testResults": {
      "uat": {"passed": 13, "failed": 0, "skipped": 0},
      "regression": {"passed": 49, "failed": 0, "skipped": 0},
      "runtime": "Node.js v20.20.2",
      "browser": "not supplied; not executed"
    }
  }],
  "findings": []
}
