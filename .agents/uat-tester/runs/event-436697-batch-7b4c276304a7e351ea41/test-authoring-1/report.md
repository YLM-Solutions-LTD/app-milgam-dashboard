{
  "schemaVersion": 1,
  "batchKey": "event-436697-batch-7b4c276304a7e351ea41",
  "appName": "milgam-dashboard",
  "stage": "test-authoring",
  "cycle": 1,
  "outcome": "approved",
  "summary": "Recovered-plan deterministic UAT passes 13/13 across T-201 through T-205 with the authorized live flag true, CSP-safe chart source contracts, exact synthetic snapshot transport, strict adapters, generation recovery, trust rejection, and local performance coverage. The app regression suite passes 56/56. Exact-preview and approved real-host gates were not supplied in this stage and are not claimed.",
  "handledActionIds": [536946, 536949, 537034, 537037, 537040, 547704, 547710, 547713, 569787, 569843],
  "roles": [{
    "role": "uat-tester",
    "verdict": "approve",
    "taskIds": ["T-201", "T-202", "T-203", "T-204", "T-205"],
    "evidence": [
      "tests/uat/current-snapshot.uat.test.mjs",
      ".agents/uat-tester/runs/event-436697-batch-7b4c276304a7e351ea41/test-authoring-1/cases.md",
      ".agents/uat-tester/runs/event-436697-batch-7b4c276304a7e351ea41/test-authoring-1/evidence/test-results.md"
    ],
    "testResults": {
      "uat": {"passed": 13, "failed": 0, "skipped": 0},
      "regression": {"passed": 56, "failed": 0, "skipped": 0},
      "runtime": "Node.js v20.20.2",
      "browser": "not supplied; not executed"
    }
  }],
  "limitations": [
    "No exact controller-authorized preview was supplied to this stage, so deployed bytes, runtime CSP console/network behavior, browser geometry, DOM/render budgets, and exact-preview burst behavior were not executed.",
    "No approved real SimplyLog host or controller-owned faithful harness was supplied; synthetic postMessage context cannot prove authorization expiry/revocation or command-response generation binding for T-205."
  ],
  "findings": []
}
