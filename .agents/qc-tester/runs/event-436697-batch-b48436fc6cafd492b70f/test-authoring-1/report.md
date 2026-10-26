{
  "schemaVersion": 1,
  "batchKey": "event-436697-batch-b48436fc6cafd492b70f",
  "appName": "milgam-dashboard",
  "stage": "test-authoring",
  "cycle": 1,
  "processAttempt": 1,
  "outcome": "ready",
  "summary": "QC approves the deterministic test-authoring candidate for T-301 through T-305. Complete extension-aware execution passes site 67/67, QC 43/43, UAT 29/29, and actual packaged SDK/GuestBridge harness 2/2, with zero skips. New QC covers inclusive From/To ranges, four identical isolated analytics calls, field-limited decimal-string snapshot counts, responsive/accessibility/RTL-LTR source contracts, and the truthful all-state release footer. The obsolete coupled-refresh QC assertion was replaced with revision-12 behavioral isolation. The denied deployed origin was not accessed; exact-preview visual, metadata/head, browser budget, and real-tenant gates remain limitations.",
  "handledActionIds": [570021],
  "includeDescription": false,
  "roles": [{
    "role": "qc-tester",
    "verdict": "approve",
    "taskIds": ["T-301", "T-302", "T-303", "T-304", "T-305"],
    "counts": {
      "site": {"passed": 67, "failed": 0, "skipped": 0},
      "qc": {"passed": 43, "failed": 0, "skipped": 0},
      "uat": {"passed": 29, "failed": 0, "skipped": 0},
      "controllerHarness": {"passed": 2, "failed": 0, "skipped": 0}
    },
    "evidence": [
      "tests/qc/range-footer-qc.test.mjs",
      "tests/qc/snapshot-qc.test.js",
      ".agents/qc-tester/runs/event-436697-batch-b48436fc6cafd492b70f/test-authoring-1/evidence.md",
      ".agents/qc-tester/runs/event-436697-batch-b48436fc6cafd492b70f/test-authoring-1/session.md"
    ]
  }],
  "findings": [],
  "limitations": [
    "The controller-forbidden deployed preview was not accessed; exact-preview stamped version/head equality, delivered headers, screenshots, computed contrast/geometry/zoom, browser render/long-task/DOM budgets, and console/network inspection remain later gates.",
    "Synthetic host permission decisions do not prove deployed tenant permissions; no tenant token or tenant traffic was used.",
    "An initial wildcard UAT command failed because unmatched extension globs were passed literally; the complete discovered three-file inventory was then run explicitly and passed 29/29."
  ]
}
