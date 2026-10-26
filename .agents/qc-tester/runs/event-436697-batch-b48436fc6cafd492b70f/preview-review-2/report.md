{
  "schemaVersion": 1,
  "batchKey": "event-436697-batch-b48436fc6cafd492b70f",
  "appName": "milgam-dashboard",
  "stage": "preview-review",
  "cycle": 2,
  "processAttempt": 1,
  "outcome": "ready",
  "summary": "QC approves exact head 2f47f48ed056df72c5d8b861778dad5cc4069703. Complete inventory-aware suites pass 72/72 site, 49/49 QC, 33/33 UAT, and 2/2 controller harness. Fresh actual-SDK/intercepted-preview evidence closes all three remediation-cycle-2 fingerprints: the 1,000-row analytical fixture renders 297 dashboard descendants with zero observed long tasks, terminal 401 disables refresh and exposes no retry until re-entry, and the footer is fully contained at supplemental 320px RTL. Required RTL/LTR viewports, inclusive range bodies, invalid zero-effect behavior, decimal-string snapshot facts, exact Navigate, truthful head-matched Preview/Not released metadata, no-context footer visibility, CSP, and page-error checks pass. Synthetic permissions are not tenant or release-authority evidence.",
  "handledActionIds": [570021],
  "includeDescription": false,
  "roles": [{
    "role": "qc-tester",
    "verdict": "approve",
    "taskIds": ["T-301", "T-302", "T-303", "T-304", "T-305"],
    "counts": {
      "site": {"passed": 72, "failed": 0, "skipped": 0},
      "qc": {"passed": 49, "failed": 0, "skipped": 0},
      "uat": {"passed": 33, "failed": 0, "skipped": 0},
      "controllerHarness": {"passed": 2, "failed": 0, "skipped": 0}
    },
    "evidence": [
      ".agents/qc-tester/runs/event-436697-batch-b48436fc6cafd492b70f/preview-review-2/evidence.md",
      ".agents/qc-tester/runs/event-436697-batch-b48436fc6cafd492b70f/preview-review-2/evidence/browser-results.json",
      ".agents/qc-tester/runs/event-436697-batch-b48436fc6cafd492b70f/preview-review-2/evidence/desktop-rtl.png",
      ".agents/qc-tester/runs/event-436697-batch-b48436fc6cafd492b70f/preview-review-2/evidence/mobile-ltr.png",
      ".agents/qc-tester/runs/event-436697-batch-b48436fc6cafd492b70f/preview-review-2/evidence/narrow-rtl.png"
    ]
  }],
  "findings": [],
  "limitations": [
    "Synthetic fixture permission decisions do not prove deployed-tenant permission configuration or backend behavior.",
    "No real tenant token or traffic was used; production publication, release authorization, and controller completion remain unclaimed."
  ]
}
