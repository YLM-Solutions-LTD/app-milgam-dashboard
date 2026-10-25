{
  "schemaVersion": 1,
  "batchKey": "event-436697-batch-7b4c276304a7e351ea41",
  "appName": "milgam-dashboard",
  "stage": "preview-review",
  "cycle": 1,
  "outcome": "approved",
  "summary": "Performance review approves exact controller-supplied head ea974089c5cfa402a44b99606514721807b49dd8 for the preview-testable browser and API-efficiency contracts. Chromium 140 at 390x844 and 1440x900 observed exactly three concurrent current-report POSTs with body {}, peak current concurrency three, one three-call generation for a ten-refresh burst, one command chain for 21 rapid permit activations, 4,070,434 decoded equipment bytes, 10-16 ms exact 10,000-row mapper durations, 41 snapshot descendants, no overflow, no >=50 ms long task, no console/page error, and no third-party executable request. The prior snapshot-disabled finding is resolved. T-205 approved-host expiry/re-entry remains outside synthetic preview evidence and is not claimed.",
  "handledActionIds": [536946, 536949, 537034, 537037, 537040, 547704, 547710, 547713, 569787, 569843],
  "roles": [{
    "role": "performance-reviewer",
    "verdict": "approve",
    "taskIds": ["T-201", "T-202", "T-203", "T-204", "T-205"],
    "evidence": [
      ".agents/performance-reviewer/runs/event-436697-batch-7b4c276304a7e351ea41/preview-review-1/evidence.md",
      ".agents/performance-reviewer/runs/event-436697-batch-7b4c276304a7e351ea41/preview-review-1/browser-measurements.json",
      ".agents/performance-reviewer/runs/event-436697-batch-7b4c276304a7e351ea41/preview-review-1/measure-preview.cjs",
      "site/constants.js",
      "site/current-snapshot.js",
      "site/app.js",
      "site/_headers"
    ]
  }],
  "findings": []
}
