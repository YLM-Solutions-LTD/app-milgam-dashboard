{
  "schemaVersion": 1,
  "batchKey": "event-436697-batch-7b4c276304a7e351ea41",
  "appName": "milgam-dashboard",
  "stage": "preview-review",
  "cycle": 3,
  "processAttempt": 1,
  "outcome": "ready",
  "summary": "QC approves exact head 3dc45f69655efd2a2c6b0ad016b1a8cf8f738066. The deployed artifact matches local release-candidate bytes and the controller-verified SDK. Fresh exact-preview evidence closes all six cycle-3 findings and the refresh request-amplification follow-up: bursts through both refresh controls and the stale retry coalesce to exactly three current requests, locks release after errors and re-entry, revoked and terminally rejected generations issue zero follow-up requests, and distinct re-entry automatically issues exactly three. Responsive RTL/LTR, CSP, chart, diagnostics, keyboard/focus, DOM, request-body, and console/page-error checks pass. No tenant traffic or release action occurred.",
  "handledActionIds": [536946, 536949, 537034, 537037, 537040, 547704, 547710, 547713, 569787, 569843],
  "includeDescription": false,
  "roles": [{
    "role": "qc-tester",
    "verdict": "approve",
    "taskIds": ["T-201", "T-202", "T-203", "T-204", "T-205"],
    "evidence": [
      ".agents/qc-tester/runs/event-436697-batch-7b4c276304a7e351ea41/preview-review-3/evidence.md",
      ".agents/qc-tester/runs/event-436697-batch-7b4c276304a7e351ea41/preview-review-3/evidence/browser-results.json",
      ".agents/qc-tester/runs/event-436697-batch-7b4c276304a7e351ea41/preview-review-3/evidence/desktop-rtl.png",
      ".agents/qc-tester/runs/event-436697-batch-7b4c276304a7e351ea41/preview-review-3/evidence/mobile-ltr.png"
    ],
    "testResults": {
      "site": {"passed": 61, "failed": 0, "skipped": 0},
      "qc": {"passed": 34, "failed": 0, "skipped": 0},
      "uat": {"passed": 23, "failed": 0, "skipped": 0},
      "controllerFixture": {"passed": 2, "failed": 0, "skipped": 0},
      "runtime": "Node.js v20.20.2; Chromium 140.0.7339.16"
    }
  }],
  "resolvedFindings": [
    "simplyvibe-auth-lifecycle-401-refresh-reuses-rejected-generation-v1",
    "perf-preview-fresh-reentry-does-not-restart-snapshot-generation-v1",
    "uat-snapshot-refresh-failure-last-good-cleared-v1",
    "uat-authorization-expiry-old-generation-refresh-allowed-v1",
    "uat-permit-command-singleflight-race-v1",
    "qc-sdk-reentry-client-disposed-unhandled-v1",
    "qc-revoke-refresh-race-issues-old-generation-requests-v1",
    "perf-preview-revoked-bridge-refresh-emits-old-generation-requests-v1",
    "perf-preview-refresh-verification-burst-request-amplification-v1"
  ],
  "findings": []
}
