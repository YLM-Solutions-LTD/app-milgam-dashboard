{
  "schemaVersion": 1,
  "batchKey": "event-436697-batch-7b4c276304a7e351ea41",
  "appName": "milgam-dashboard",
  "stage": "preview-review",
  "cycle": 2,
  "processAttempt": 1,
  "outcome": "rejected",
  "summary": "The corrected controller fixture successfully exercised the exact enabled preview through the packaged verified SDK. Snapshot, CSP-safe charts, responsive RTL/LTR layout, local-only API behavior, single-flight permit navigation, error redaction, revocation isolation, stale retention, and fresh re-entry otherwise passed. QC rejects because revocation followed by fresh SDK re-entry emits an uncaught page error: Error: Client disposed.",
  "handledActionIds": [536946, 536949, 537034, 537037, 537040, 547704, 547710, 547713, 569787, 569843],
  "includeDescription": false,
  "roles": [{
    "role": "qc-tester",
    "verdict": "reject",
    "taskIds": ["T-201", "T-202", "T-203", "T-204", "T-205"],
    "evidence": [
      ".agents/qc-tester/runs/event-436697-batch-7b4c276304a7e351ea41/preview-review-2/evidence.md",
      ".agents/qc-tester/runs/event-436697-batch-7b4c276304a7e351ea41/preview-review-2/evidence/browser-results.json",
      ".agents/qc-tester/runs/event-436697-batch-7b4c276304a7e351ea41/preview-review-2/evidence/desktop-rtl.png",
      ".agents/qc-tester/runs/event-436697-batch-7b4c276304a7e351ea41/preview-review-2/evidence/desktop-ltr.png",
      ".agents/qc-tester/runs/event-436697-batch-7b4c276304a7e351ea41/preview-review-2/evidence/mobile-rtl.png",
      ".agents/qc-tester/runs/event-436697-batch-7b4c276304a7e351ea41/preview-review-2/evidence/mobile-ltr.png"
    ]
  }],
  "findings": [{
    "fingerprint": "qc-sdk-reentry-client-disposed-unhandled-v1",
    "role": "qc-tester",
    "title": "SDK session replacement emits an uncaught disposed-client error",
    "severity": "medium",
    "confidence": "high",
    "taskIds": ["T-203", "T-204", "T-205"],
    "evidence": ".agents/qc-tester/runs/event-436697-batch-7b4c276304a7e351ea41/preview-review-2/evidence/browser-results.json (scenario revocation-reentry)",
    "reproduction": "In the corrected controller fixture, hold a permit command, activate a permit control, revoke and release generation 1, then call controllerHarness.reenter(). Old effects remain blocked and generation 2 recovers, but Chromium reports uncaught Error: Client disposed. via pageerror.",
    "expected": "Disposal/session replacement is handled as a normal authorization transition without an uncaught exception.",
    "actual": "The application recovers on generation 2 but the disposed prior client's error escapes to the page."
  }]
}
