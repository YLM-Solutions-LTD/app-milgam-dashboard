{
  "schemaVersion": 1,
  "batchKey": "event-436697-batch-7b4c276304a7e351ea41",
  "appName": "milgam-dashboard",
  "stage": "preview-review",
  "cycle": 3,
  "outcome": "rejected",
  "summary": "Exact-preview performance review rejects the supplied head because a ten-click refresh burst starts 29-33 current-report requests instead of one three-request generation, amplifying the 4.07 MB decoded equipment payload roughly tenfold. All six incoming cycle-3 lifecycle findings are verified resolved: terminal 401 denial, stale retention, fresh and overlapping re-entry, permit single-flight, and handled disposal/reconnect behavior pass with the real packaged SDK and GuestBridge. Baseline 10,000-row mapping, DOM, rendering, responsive, CSP, and old-generation suppression budgets also pass.",
  "handledActionIds": [536946, 536949, 537034, 537037, 537040, 547704, 547710, 547713, 569787, 569843],
  "roles": [{
    "role": "performance-reviewer",
    "verdict": "reject",
    "taskIds": ["T-201", "T-202", "T-203", "T-204", "T-205"],
    "evidence": [
      ".agents/performance-reviewer/runs/event-436697-batch-7b4c276304a7e351ea41/preview-review-3/evidence.md",
      ".agents/performance-reviewer/runs/event-436697-batch-7b4c276304a7e351ea41/preview-review-3/evidence/browser-measurements.json",
      ".agents/performance-reviewer/runs/event-436697-batch-7b4c276304a7e351ea41/preview-review-3/evidence/lifecycle-measurements.json",
      "site/app.js:149-160 and site/current-snapshot.js:87-103"
    ]
  }],
  "findings": [{
    "fingerprint": "perf-preview-refresh-verification-burst-request-amplification-v1",
    "role": "performance-reviewer",
    "title": "Refresh burst bypasses single-flight while authorization verification is pending",
    "severity": "medium",
    "confidence": "high",
    "taskIds": ["T-203", "T-204", "T-205"],
    "evidence": "With a populated 10,000-row snapshot, ten synchronous refresh clicks started 29 current-report requests at 390x844 and 33 at 1440x900, rather than one three-request generation; peak current concurrency matched those counts and 27/30 requests were subsequently aborted. Each generation includes a roughly 4.07 MB decoded equipment response. The button stays enabled while every handler awaits the shared verification promise, then every continuation independently starts analytical and snapshot work.",
    "reproduction": "Load the exact preview through the corrected local controller fixture with the real packaged SDK and 10,000-row equipment fixture. After ready, synchronously click #snapshot-refresh ten times. Record 29-33 current POSTs and peak concurrency rather than three. Inspect site/app.js:149-160: refreshAuthorization has no guard before await hostBootstrap.verify(); inspect site/current-snapshot.js:87-103: cancellation begins only after each refresh invocation has already started."
  }]
}

