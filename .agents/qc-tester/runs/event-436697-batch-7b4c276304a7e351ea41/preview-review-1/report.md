{
  "schemaVersion": 1,
  "batchKey": "event-436697-batch-7b4c276304a7e351ea41",
  "appName": "milgam-dashboard",
  "stage": "preview-review",
  "cycle": 1,
  "processAttempt": 1,
  "outcome": "rejected",
  "summary": "The exact preview cannot load in the controller-supplied trusted host fixture because its enforced frame-ancestors CSP omits https://ylm.ylm.co.il. This blocks actual guest SDK initialization and every authenticated preview/lifecycle acceptance path. Deterministic suites pass (fixture 2/2, site 56/56, QC 25/25, UAT 13/13), but they do not compensate for the deployed integration failure.",
  "handledActionIds": [536946, 536949, 537034, 537037, 537040, 547704, 547710, 547713, 569787, 569843],
  "includeDescription": false,
  "roles": [{
    "role": "qc-tester",
    "verdict": "reject",
    "taskIds": ["T-201", "T-202", "T-203", "T-204", "T-205"],
    "evidence": [
      ".agents/qc-tester/runs/event-436697-batch-7b4c276304a7e351ea41/preview-review-1/evidence.md",
      ".agents/qc-tester/runs/event-436697-batch-7b4c276304a7e351ea41/preview-review-1/evidence/browser-results.json",
      ".agents/qc-tester/runs/event-436697-batch-7b4c276304a7e351ea41/preview-review-1/evidence/controller-harness-desktop.png",
      ".agents/qc-tester/runs/event-436697-batch-7b4c276304a7e351ea41/preview-review-1/evidence/headers.txt",
      ".agents/qc-tester/runs/event-436697-batch-7b4c276304a7e351ea41/preview-review-1/harness-tests.tap",
      ".agents/qc-tester/runs/event-436697-batch-7b4c276304a7e351ea41/preview-review-1/site-tests.tap",
      ".agents/qc-tester/runs/event-436697-batch-7b4c276304a7e351ea41/preview-review-1/qc-tests.tap",
      ".agents/qc-tester/runs/event-436697-batch-7b4c276304a7e351ea41/preview-review-1/uat-tests.tap"
    ]
  }],
  "findings": [{
    "fingerprint": "qc-controller-harness-frame-ancestor-missing-v1",
    "title": "Exact preview CSP blocks the controller-supplied trusted host fixture",
    "severity": "high",
    "confidence": "high",
    "taskIds": ["T-201", "T-202", "T-204", "T-205"],
    "evidence": ".agents/qc-tester/runs/event-436697-batch-7b4c276304a7e351ea41/preview-review-1/evidence/browser-results.json",
    "reproduction": "Serve the supplied controller fixture at https://ylm.ylm.co.il/controller-host-fixture/, navigate it with preview=https://02ea3f16.app-milgam-dashboard.pages.dev, and inspect the child frame and console. Chromium refuses the preview under frame-ancestors and replaces it with chrome-error://chromewebdata/.",
    "expected": "The exact preview loads within the supplied trusted fixture and initializes its real packaged SDK so readiness, Navigate, revocation, expiry, and re-entry can be exercised.",
    "actual": "The delivered frame-ancestors directive omits https://ylm.ylm.co.il; SDK initialization never starts, no snapshot/API work occurs, and controllerHarness records zero effects."
  }]
}
