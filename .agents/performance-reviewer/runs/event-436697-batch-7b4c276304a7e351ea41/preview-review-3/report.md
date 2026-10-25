{
  "schemaVersion": 1,
  "batchKey": "event-436697-batch-7b4c276304a7e351ea41",
  "appName": "milgam-dashboard",
  "stage": "preview-review",
  "cycle": 3,
  "processAttempt": 1,
  "outcome": "reject",
  "summary": "Exact-preview performance and API-efficiency acceptance passes request concurrency, 10,000-row mapping, DOM/render, responsive, refresh-burst, 401 terminal denial, stale retention, fresh/overlapping re-entry, command single-flight, and disposed-client error checks. It rejects because bridge revocation followed by refresh reproducibly emits four authenticated generation-1 requests at both viewports, violating the zero-old-generation traffic contract in T-203/T-205. The legacy message context remains an independent source-level authority path as a corroborating non-performance shared-task gap.",
  "handledActionIds": [536946, 536949, 537034, 537037, 537040, 547704, 547710, 547713, 569787, 569843],
  "includeDescription": false,
  "roles": [{
    "role": "performance-reviewer",
    "verdict": "reject",
    "taskIds": ["T-201", "T-202", "T-203", "T-204", "T-205"],
    "evidence": [
      ".agents/performance-reviewer/runs/event-436697-batch-7b4c276304a7e351ea41/preview-review-3/evidence.md",
      ".agents/performance-reviewer/runs/event-436697-batch-7b4c276304a7e351ea41/preview-review-3/browser-measurements.json",
      ".agents/performance-reviewer/runs/event-436697-batch-7b4c276304a7e351ea41/preview-review-3/lifecycle-measurements.json",
      "site/host-bootstrap.js:34-44,48-72,82-105",
      "site/host-context.js:75-97,119-190"
    ]
  }],
  "findings": [{
    "fingerprint": "perf:preview:revoked-bridge-refresh-emits-old-generation-requests:v1",
    "role": "performance-reviewer",
    "title": "Revoked bridge refresh emits an old-generation four-request burst",
    "severity": "high",
    "confidence": "high",
    "taskIds": ["T-203", "T-204", "T-205"],
    "evidence": "At both 390x844 and 1440x900, after controllerHarness.revoke(), a forced ordinary refresh emitted the three current-report POSTs and one MilgamDashboardByMonth POST with Bearer controller-synthetic-generation-1. Fresh re-entry later used generation 2 correctly, proving the four calls preceded and bypassed fresh authorization.",
    "reproduction": [
      "Run measure-preview.cjs against the recorded exact preview through the fully intercepted controller fixture.",
      "Complete the generation-1 snapshot, call controllerHarness.revoke(), then activate #snapshot-refresh before controllerHarness.reenter().",
      "Observe four API requests carrying the generation-1 synthetic bearer at either viewport; expected count is zero until a distinct bridge re-entry."
    ],
    "recommendation": "Terminally deny the observed session source for a verified bridge AuthorizationRevoked/disconnect just as for 401/403, and remove or make non-authoritative the legacy message-context binding. Re-run the exact sequence and require zero requests before distinct re-entry and exactly one three-current-request generation afterward."
  }]
}
