{
  "schemaVersion": 1,
  "batchKey": "event-436697-batch-7b4c276304a7e351ea41",
  "appName": "milgam-dashboard",
  "stage": "test-authoring",
  "cycle": 3,
  "processAttempt": 2,
  "outcome": "ready",
  "summary": "QC approves: site 61/61, QC 34/34 across .js and .mjs, UAT 23/23, harness 2/2, plus 2/2 local browser viewports with exactly three requests for a ten-click burst, concurrency three, zero revoked requests, three fresh-re-entry requests, and zero page errors.",
  "handledActionIds": [536946, 536949, 537034, 537037, 537040, 547704, 547710, 547713, 569787, 569843],
  "includeDescription": false,
  "roles": [{
    "role": "qc-tester",
    "verdict": "approve_with_findings",
    "taskIds": ["T-201", "T-202", "T-203", "T-204", "T-205"],
    "testResults": {
      "site": {"passed": 61, "failed": 0, "skipped": 0},
      "qc": {"passed": 34, "failed": 0, "skipped": 0},
      "uat": {"passed": 23, "failed": 0, "skipped": 0},
      "controllerFixture": {"passed": 2, "failed": 0, "skipped": 0},
      "browserFixtureViewports": {"passed": 2, "failed": 0}
    },
    "evidence": ["tests/qc/snapshot-qc.test.js", "tests/qc/operator-reentry-race.test.mjs", "tests/qc/sdk-bridge-qc.test.mjs", ".agents/qc-tester/runs/event-436697-batch-7b4c276304a7e351ea41/test-authoring-3/evidence.md", ".agents/qc-tester/tmp/test-authoring-3-attempt-2/browser-refresh-burst.json"]
  }],
  "resolvedFindings": ["simplyvibe-auth-lifecycle-401-refresh-reuses-rejected-generation-v1", "perf-preview-fresh-reentry-does-not-restart-snapshot-generation-v1", "uat-snapshot-refresh-failure-last-good-cleared-v1", "uat-authorization-expiry-old-generation-refresh-allowed-v1", "uat-permit-command-singleflight-race-v1", "qc-sdk-reentry-client-disposed-unhandled-v1", "qc-revoke-refresh-race-issues-old-generation-requests-v1", "perf-preview-revoked-bridge-refresh-emits-old-generation-requests-v1", "perf-preview-refresh-verification-burst-request-amplification-v1"],
  "findings": [{
    "fingerprint": "deferred-controller-selected-preview-and-tenant-qc-v1",
    "role": "qc-tester",
    "title": "Deployed artifact identity and tenant permissions remain controller-owned",
    "severity": "low",
    "confidence": "high",
    "taskIds": ["T-204", "T-205"],
    "evidence": "Local source and faithful fixture passed; no new deployed preview identity or real tenant permission verification was in scope.",
    "reproduction": "Rerun the intercepted fixture workflow against the exact controller-selected deployment and validate tenant authorization separately without exposing credentials."
  }]
}
