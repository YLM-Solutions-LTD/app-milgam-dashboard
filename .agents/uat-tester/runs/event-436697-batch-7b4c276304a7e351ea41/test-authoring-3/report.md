{
  "schemaVersion": 1,
  "batchKey": "event-436697-batch-7b4c276304a7e351ea41",
  "appName": "milgam-dashboard",
  "stage": "test-authoring",
  "cycle": 3,
  "attempt": 1,
  "outcome": "ready",
  "summary": "Deterministic UAT passes 23/23 with synthetic local fixtures and the actual packaged controller SDK/GuestBridge; site passes 61/61 and controller harness passes 2/2. Every cycle-3 fingerprint has behavioral evidence, including terminal 401 taint, stale retention, fresh/overlapping re-entry, shared live verification, silent-disconnect denial, exact Navigate, and no unhandled disposal rejection. Exact-preview browser and real tenant permission checks remain later-stage limitations.",
  "handledActionIds": [536946, 536949, 537034, 537037, 537040, 547704, 547710, 547713, 569787, 569843],
  "roles": [{
    "role": "uat-tester",
    "verdict": "approve",
    "taskIds": ["T-201", "T-202", "T-203", "T-204", "T-205"],
    "evidence": [
      "tests/uat/current-snapshot.uat.test.mjs",
      "tests/uat/verified-host-bridge.uat.test.mjs",
      ".agents/uat-tester/runs/event-436697-batch-7b4c276304a7e351ea41/test-authoring-3/cases.md",
      ".agents/uat-tester/runs/event-436697-batch-7b4c276304a7e351ea41/test-authoring-3/evidence/test-results.md"
    ],
    "testResults": {
      "uat": {"passed": 23, "failed": 0, "skipped": 0},
      "regression": {"passed": 61, "failed": 0, "skipped": 0},
      "controllerFixture": {"passed": 2, "failed": 0, "skipped": 0},
      "runtime": "Node.js v20.20.2",
      "browser": "not executed in test-authoring"
    }
  }],
  "resolvedFindings": [
    "simplyvibe-auth-lifecycle-401-refresh-reuses-rejected-generation-v1",
    "perf-preview-fresh-reentry-does-not-restart-snapshot-generation-v1",
    "uat-snapshot-refresh-failure-last-good-cleared-v1",
    "uat-authorization-expiry-old-generation-refresh-allowed-v1",
    "uat-permit-command-singleflight-race-v1",
    "qc-sdk-reentry-client-disposed-unhandled-v1",
    "unchanged-sdk-session-capability-remint-v1",
    "permit-single-flight-cleared-by-revocation-v1",
    "legacy-context-remains-independent-authority-v1",
    "host-context-diagnostics-expose-runtime-address-v1",
    "operator-overlapping-reentry-newest-generation-recovery-v1"
  ],
  "limitations": [
    "The faithful controller-owned protocol fixture proves local SDK/GuestBridge behavior, not a real tenant permission configuration.",
    "No exact deployed preview was authorized for test-authoring, so deployed browser, CSP/network, DOM/render, 20-activation burst, and deployed automatic re-entry observations were not executed or claimed."
  ],
  "findings": []
}
