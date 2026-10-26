{
  "schemaVersion": 1,
  "batchKey": "event-436697-batch-b48436fc6cafd492b70f",
  "appName": "milgam-dashboard",
  "stage": "test-authoring",
  "cycle": 1,
  "processAttempt": 1,
  "outcome": "ready",
  "summary": "UAT approves deterministic test authoring for T-301 through T-305. Complete UAT passes 29/29 using synthetic API/postMessage fixtures and the actual controller GuestBridge/packaged SDK; site passes 67/67, complete QC JS+MJS passes 43/43, and controller harness passes 2/2. New cases cover exact inclusive ranges and four-body isolation, decimal-string aggregate acceptance/rejection, enabled independent snapshots, exact Navigate, and the unchanged packaged truthful footer. Exact-preview browser, deployed metadata identity, and real tenant permission checks remain later-stage limitations and are not claimed.",
  "handledActionIds": [570021],
  "includeDescription": false,
  "roles": [{
    "role": "uat-tester",
    "verdict": "approve",
    "taskIds": ["T-301", "T-302", "T-303", "T-304", "T-305"],
    "evidence": [
      "tests/uat/current-snapshot.uat.test.mjs",
      "tests/uat/range-footer.uat.test.mjs",
      "tests/uat/verified-host-bridge.uat.test.mjs",
      ".agents/uat-tester/runs/event-436697-batch-b48436fc6cafd492b70f/test-authoring-1/approach.md",
      ".agents/uat-tester/runs/event-436697-batch-b48436fc6cafd492b70f/test-authoring-1/cases.md",
      ".agents/uat-tester/runs/event-436697-batch-b48436fc6cafd492b70f/test-authoring-1/evidence.md"
    ],
    "testResults": {
      "uat": {"passed": 29, "failed": 0, "skipped": 0},
      "site": {"passed": 67, "failed": 0, "skipped": 0},
      "qcCrossCheck": {"passed": 43, "failed": 0, "skipped": 0},
      "controllerFixture": {"passed": 2, "failed": 0, "skipped": 0},
      "runtime": "Node.js v20.20.2",
      "browser": "not executed in test-authoring"
    }
  }],
  "findings": [],
  "limitations": [
    "No exact authorized preview was supplied or accessed; the forbidden deployed origin was not accessed.",
    "Browser viewport, focus, DOM cardinality, long-task/render timing, and exact stamped preview-version checks remain preview-review gates.",
    "Synthetic fixture permissions do not prove real tenant permission configuration; no tenant token or traffic was used.",
    "Production release and controller completion remain controller-owned and unclaimed."
  ]
}
