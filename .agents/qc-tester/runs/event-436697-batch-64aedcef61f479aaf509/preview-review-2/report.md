{
  "schemaVersion": 1,
  "batchKey": "event-436697-batch-64aedcef61f479aaf509",
  "appName": "milgam-dashboard",
  "stage": "preview-review",
  "cycle": 2,
  "outcome": "rejected",
  "summary": "Exact-preview QC rejects cycle 2 because permit-navigation rejection produces an uncaught focus-restoration TypeError. Functional transport, validated failure/retry and stale recovery, analytical-period independence, navigation locking/payload, raw host date delegation, RTL/LTR responsive geometry, accessible permit naming, snapshot DOM bound, and existing analytical rendering otherwise passed with synthetic host/API fixtures. Local suites pass 49/49 site, 20/20 QC, and 13/13 UAT. No real tenant token or authenticated live SimplyLog API was used.",
  "handledActionIds": [536946, 536949, 537034, 537037, 537040],
  "includeDescription": false,
  "roles": [{
    "role": "qc-tester",
    "verdict": "reject",
    "taskIds": ["T-101", "T-102", "T-103", "T-104", "T-105", "T-106", "T-107"],
    "evidence": [
      ".agents/qc-tester/runs/event-436697-batch-64aedcef61f479aaf509/preview-review-2/evidence.md",
      ".agents/qc-tester/runs/event-436697-batch-64aedcef61f479aaf509/preview-review-2/evidence/browser-results.json",
      ".agents/qc-tester/runs/event-436697-batch-64aedcef61f479aaf509/preview-review-2/evidence/phone-rtl.png",
      ".agents/qc-tester/runs/event-436697-batch-64aedcef61f479aaf509/preview-review-2/evidence/tablet-ltr.png",
      ".agents/qc-tester/runs/event-436697-batch-64aedcef61f479aaf509/preview-review-2/evidence/desktop-rtl.png",
      ".agents/qc-tester/runs/event-436697-batch-64aedcef61f479aaf509/preview-review-2/evidence/site-tests.tap",
      ".agents/qc-tester/runs/event-436697-batch-64aedcef61f479aaf509/preview-review-2/evidence/qc-tests.tap",
      ".agents/qc-tester/runs/event-436697-batch-64aedcef61f479aaf509/preview-review-2/evidence/uat-tests.tap"
    ],
    "testResults": {
      "browserScenarios": {"passed": 5, "failed": 1, "skipped": 0},
      "site": {"passed": 49, "failed": 0, "skipped": 0},
      "qc": {"passed": 20, "failed": 0, "skipped": 0},
      "uat": {"passed": 13, "failed": 0, "skipped": 0},
      "runtime": "Node.js v20.20.2",
      "browser": "Chromium 140.0.7339.16"
    }
  }],
  "findings": [{
    "fingerprint": "QC-PERMIT-FOCUS-001",
    "title": "Permit navigation rejection throws during focus restoration",
    "severity": "medium",
    "confidence": "high",
    "taskIds": ["T-104", "T-105", "T-106"],
    "evidence": ".agents/qc-tester/runs/event-436697-batch-64aedcef61f479aaf509/preview-review-2/evidence/browser-results.json",
    "reproduction": "In the exact preview with a valid synthetic host, activate a permit control while executeCommand is pending, then reject the command. The controls unlock and sanitized feedback renders, but the page emits TypeError: Cannot read properties of null (reading 'focus').",
    "expected": "The rejected command restores focus and completes cleanup without an uncaught exception.",
    "actual": "The async cleanup dereferences a cleared event target and emits an uncaught TypeError."
  }]
}

