{
  "schemaVersion": 1,
  "batchKey": "event-436697-batch-7b4c276304a7e351ea41",
  "appName": "milgam-dashboard",
  "stage": "test-authoring",
  "cycle": 2,
  "processAttempt": 1,
  "outcome": "ready_with_limitations",
  "summary": "Deterministic QC is ready. The expanded 28-test QC suite uses the byte-identical packaged SimplyVibeClient and supplied real GuestBridge at the corrected Milgam fixture origin, proving Ready, exact Navigate, old-command zero effects after session rotation, old capability revocation, and fresh generation-2 recovery without an injected adapter or network. Site 59/59, QC 28/28, accepted UAT 16/16, and controller fixture 2/2 passed. Exact deployed-preview browser checks remain a later stage.",
  "handledActionIds": [536946, 536949, 537034, 537037, 537040, 547704, 547710, 547713, 569787, 569843],
  "includeDescription": false,
  "roles": [{
    "role": "qc-tester",
    "verdict": "approve_with_limitations",
    "taskIds": ["T-201", "T-202", "T-203", "T-204", "T-205"],
    "counts": {
      "qc": {"pass": 28, "fail": 0, "skip": 0},
      "siteRegression": {"pass": 59, "fail": 0, "skip": 0},
      "uat": {"pass": 16, "fail": 0, "skip": 0},
      "controllerHarness": {"pass": 2, "fail": 0, "skip": 0}
    },
    "evidence": [
      ".agents/qc-tester/runs/event-436697-batch-7b4c276304a7e351ea41/test-authoring-2/evidence.md",
      ".agents/qc-tester/runs/event-436697-batch-7b4c276304a7e351ea41/test-authoring-2/evidence/qc-tests.tap",
      ".agents/qc-tester/runs/event-436697-batch-7b4c276304a7e351ea41/test-authoring-2/evidence/site-tests.tap",
      ".agents/qc-tester/runs/event-436697-batch-7b4c276304a7e351ea41/test-authoring-2/evidence/uat-tests.tap",
      ".agents/qc-tester/runs/event-436697-batch-7b4c276304a7e351ea41/test-authoring-2/evidence/controller-harness.tap",
      ".agents/qc-tester/runs/event-436697-batch-7b4c276304a7e351ea41/test-authoring-2/evidence/sha256.txt"
    ],
    "limitations": [
      "No exact deployed preview was supplied during test authoring, so computed responsive/visual/accessibility geometry, delivered headers, browser console/network, screenshots, render/DOM budgets, and third-party request checks remain for preview review.",
      "The local faithful bridge test does not substitute for full exact-preview API revocation, stale-retention, refresh-denial, and app re-entry exercise."
    ]
  }],
  "findings": []
}
