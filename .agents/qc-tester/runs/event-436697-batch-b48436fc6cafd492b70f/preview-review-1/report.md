{
  "schemaVersion": 1,
  "batchKey": "event-436697-batch-b48436fc6cafd492b70f",
  "appName": "milgam-dashboard",
  "stage": "preview-review",
  "cycle": 1,
  "processAttempt": 1,
  "outcome": "ready",
  "summary": "QC approves the exact preview with one low-severity narrow-width finding. T-301 through T-305 pass the required 390x844 and 1440x900 RTL/LTR browser checks, exact four-request inclusive range contract, invalid zero-effect behavior, 40-request rapid Apply isolation, decimal-string snapshot rendering, real SDK/GuestBridge Navigate path, truthful stamped preview footer, strict CSP, and zero browser errors. Complete suites pass site 67/67, QC 43/43, UAT 29/29, and harness 2/2.",
  "handledActionIds": [570021],
  "includeDescription": false,
  "roles": [{
    "role": "qc-tester",
    "verdict": "approve_with_findings",
    "taskIds": ["T-301", "T-302", "T-303", "T-304", "T-305"],
    "counts": {
      "site": {"passed": 67, "failed": 0, "skipped": 0},
      "qc": {"passed": 43, "failed": 0, "skipped": 0},
      "uat": {"passed": 29, "failed": 0, "skipped": 0},
      "controllerHarness": {"passed": 2, "failed": 0, "skipped": 0}
    },
    "evidence": [
      ".agents/qc-tester/runs/event-436697-batch-b48436fc6cafd492b70f/preview-review-1/evidence.md",
      ".agents/qc-tester/runs/event-436697-batch-b48436fc6cafd492b70f/preview-review-1/evidence/browser-results.json",
      ".agents/qc-tester/runs/event-436697-batch-b48436fc6cafd492b70f/preview-review-1/evidence/desktop-rtl.png",
      ".agents/qc-tester/runs/event-436697-batch-b48436fc6cafd492b70f/preview-review-1/evidence/mobile-ltr.png"
    ]
  }],
  "findings": [{
    "fingerprint": "qc-footer-320-rtl-edge-clipping-v1",
    "taskIds": ["T-305"],
    "severity": "low",
    "confidence": "high",
    "summary": "At the supplemental 320x844 RTL checklist width, the release footer extends beyond the viewport edge, although the required 390x844 and 1440x900 widths pass.",
    "evidence": "Chromium geometry recorded the footer in the clipped-element set at 320x844 RTL; narrow-rtl.png shows the corresponding edge crop. document.scrollWidth remained 320, so users cannot horizontally pan to recover the clipped edge.",
    "reproduction": "Load the exact preview through the supplied intercepted controller harness in Chromium at 320x844 with Hebrew RTL synthetic context, scroll to the release footer, and compare its bounding box with innerWidth. Observe the footer crossing the viewport edge while document.scrollWidth equals 320."
  }],
  "limitations": [
    "Synthetic fixture permission decisions do not prove deployed tenant permissions; no real tenant token or traffic was used.",
    "Browser checks validate controller-approved synthetic host/API behavior, not rollback of effects already executed by a real server."
  ]
}
