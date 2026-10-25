{
  "schemaVersion": 1,
  "batchKey": "event-436697-batch-7b4c276304a7e351ea41",
  "appName": "milgam-dashboard",
  "stage": "preview-review",
  "cycle": 1,
  "outcome": "rejected",
  "summary": "Exact-preview QC passes the supported T-201 through T-204 functional, responsive, RTL/LTR, accessibility, failure/retry, CSP visual, network, concurrency, 10,000-row mapping, DOM, and burst checks. Local suites pass 56/56 site, 25/25 QC, and 13/13 UAT. Release remains blocked because T-205 explicitly requires an approved real SimplyLog host or controller-owned faithful harness, which was not supplied; synthetic messaging cannot prove that lifecycle gate.",
  "handledActionIds": [536946, 536949, 537034, 537037, 537040, 547704, 547710, 547713, 569787, 569843],
  "includeDescription": false,
  "roles": [{
    "role": "qc-tester",
    "verdict": "reject",
    "taskIds": ["T-201", "T-202", "T-203", "T-204", "T-205"],
    "evidence": [
      ".agents/qc-tester/runs/event-436697-batch-7b4c276304a7e351ea41/preview-review-1/evidence.md",
      ".agents/qc-tester/runs/event-436697-batch-7b4c276304a7e351ea41/preview-review-1/evidence/browser-results.json",
      ".agents/qc-tester/runs/event-436697-batch-7b4c276304a7e351ea41/preview-review-1/evidence/headers.txt",
      ".agents/qc-tester/runs/event-436697-batch-7b4c276304a7e351ea41/preview-review-1/qc-tests.tap",
      ".agents/qc-tester/runs/event-436697-batch-7b4c276304a7e351ea41/preview-review-1/site-tests.tap",
      ".agents/qc-tester/runs/event-436697-batch-7b4c276304a7e351ea41/preview-review-1/uat-tests.tap"
    ]
  }],
  "findings": [{
    "fingerprint": "real-host-authorization-lifecycle-unverified-v1",
    "title": "Approved-host authorization lifecycle gate is unverified",
    "severity": "high",
    "confidence": "high",
    "taskIds": ["T-205"],
    "evidence": ".agents/qc-tester/runs/event-436697-batch-7b4c276304a7e351ea41/preview-review-1/evidence.md",
    "reproduction": "Attempt to execute T-205 in the supplied preview-review environment. Only synthetic postMessage/API fixtures are available; no approved real SimplyLog host or controller-owned faithful harness was supplied.",
    "expected": "Approved-host evidence proves mid-request and mid-command revocation, zero old-generation effects, stale retention, denial until fresh verified re-entry, and command-response generation binding.",
    "actual": "The exact-preview synthetic suite exercises supported browser behavior but is explicitly insufficient to close the approved-host lifecycle acceptance gate."
  }]
}
