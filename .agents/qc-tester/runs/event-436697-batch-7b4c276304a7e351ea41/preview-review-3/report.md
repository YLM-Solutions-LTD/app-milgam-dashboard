{
  "schemaVersion": 1,
  "batchKey": "event-436697-batch-7b4c276304a7e351ea41",
  "appName": "milgam-dashboard",
  "stage": "preview-review",
  "cycle": 3,
  "processAttempt": 1,
  "outcome": "rejected",
  "summary": "QC rejects the exact preview because a session-reset race still permits three current-report requests from generation 1 after controllerHarness.revoke(), while the faithful harness remains unauthorized and before any distinct re-entry. All six incoming cycle-3 fingerprints otherwise close on fresh exact-preview and full local-suite evidence: terminal 401 taint, last-good retention, exactly-three overlapping re-entry recovery, permit single-flight, and zero disposed-client/unhandled errors pass. Responsive RTL/LTR, CSP, diagnostics, request bodies, DOM, chart, keyboard/focus, and artifact-integrity checks also pass. No tenant traffic or release action occurred.",
  "handledActionIds": [536946, 536949, 537034, 537037, 537040, 547704, 547710, 547713, 569787, 569843],
  "includeDescription": false,
  "roles": [{
    "role": "qc-tester",
    "verdict": "reject",
    "taskIds": ["T-201", "T-202", "T-203", "T-204", "T-205"],
    "evidence": [
      ".agents/qc-tester/runs/event-436697-batch-7b4c276304a7e351ea41/preview-review-3/evidence.md",
      ".agents/qc-tester/runs/event-436697-batch-7b4c276304a7e351ea41/preview-review-3/evidence/browser-results.json",
      ".agents/qc-tester/runs/event-436697-batch-7b4c276304a7e351ea41/preview-review-3/evidence/mobile-rtl.png",
      ".agents/qc-tester/runs/event-436697-batch-7b4c276304a7e351ea41/preview-review-3/evidence/desktop-ltr.png"
    ]
  }],
  "findings": [{
    "fingerprint": "qc-revoke-refresh-race-issues-old-generation-requests-v1",
    "role": "qc-tester",
    "title": "Session-reset refresh race issues old-generation current requests",
    "severity": "high",
    "confidence": "high",
    "taskIds": ["T-203", "T-204", "T-205"],
    "evidence": "Exact-preview browser-results.json records revocation-reentry.revoked as authorized=false, generation=1, effects=[], retained=true, but newCalls=3 before controllerHarness.reenter(). The same run has zero page errors and uses the actual packaged SDK/GuestBridge.",
    "reproduction": "Load the exact preview through the corrected locally intercepted controller fixture; wait for the 10,000-item snapshot; hold a real permit command; activate a permit; call controllerHarness.revoke(); release the command; immediately force #snapshot-refresh without re-entry. Observe three new current-report requests while the harness remains unauthorized generation 1. Expected zero until distinct re-entry."
  }]
}
