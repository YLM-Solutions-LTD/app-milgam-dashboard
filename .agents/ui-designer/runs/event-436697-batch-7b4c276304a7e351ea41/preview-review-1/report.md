{
  "schemaVersion": 1,
  "batchKey": "event-436697-batch-7b4c276304a7e351ea41",
  "appName": "milgam-dashboard",
  "stage": "preview-review",
  "cycle": 1,
  "role": "ui-designer",
  "verdict": "blocked",
  "taskIds": ["T-201", "T-202", "T-203", "T-204", "T-205"],
  "commit": "ea974089c5cfa402a44b99606514721807b49dd8",
  "preview": "https://275c4e6f.app-milgam-dashboard.pages.dev",
  "summary": "The exact preview passes the observable UI review for enabled snapshots, responsive RTL/LTR layout, keyboard focus, exact permit navigation, and CSP-safe visible charts. Release approval remains blocked because the required approved-host authorization lifecycle evidence for T-205 was not supplied and cannot be replaced by synthetic preview messaging.",
  "evidence": [
    ".agents/ui-designer/runs/event-436697-batch-7b4c276304a7e351ea41/preview-review-1/evidence/review.md",
    ".agents/ui-designer/runs/event-436697-batch-7b4c276304a7e351ea41/preview-review-1/evidence/playwright-results.json",
    ".agents/ui-designer/runs/event-436697-batch-7b4c276304a7e351ea41/preview-review-1/evidence/preview-desktop-rtl.png",
    ".agents/ui-designer/runs/event-436697-batch-7b4c276304a7e351ea41/preview-review-1/evidence/preview-mobile-rtl.png",
    ".agents/ui-designer/runs/event-436697-batch-7b4c276304a7e351ea41/preview-review-1/evidence/preview-desktop-ltr.png",
    ".agents/ui-designer/runs/event-436697-batch-7b4c276304a7e351ea41/preview-review-1/evidence/imagegen-review-reference.png"
  ],
  "findings": [
    {
      "fingerprint": "ui:approved-host-lifecycle-evidence-unavailable:v1",
      "severity": "medium",
      "confidence": "high",
      "taskIds": ["T-205"],
      "title": "Approved-host authorization lifecycle gate is unverified",
      "evidence": "The supplied inputs contain no accepted evidence from an approved real SimplyLog host or controller-owned faithful harness. Synthetic allowed-origin Playwright messaging proved the deployed UI path but cannot prove revocation/expiry during requests and commands, zero old-generation effects, fresh verified re-entry, or command-response generation binding.",
      "reproduction": "Run the exact preview inside an approved real SimplyLog test host or controller-owned faithful harness. Revoke or expire authorization while snapshot/analytical requests and a permit command are pending; settle old responses and verify zero effects plus stale retention and denial. Then provide fresh verified authorization and prove recovery under a new generation with only correctly bound command responses accepted."
    }
  ]
}

