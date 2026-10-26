{
  "schemaVersion": 1,
  "batchKey": "event-436697-batch-b48436fc6cafd492b70f",
  "appName": "milgam-dashboard",
  "stage": "preview-review",
  "cycle": 1,
  "processAttempt": 1,
  "outcome": "rejected",
  "summary": "UAT rejects the exact preview because the required terminal 401 recovery workflow presents an enabled retry and ordinary retry guidance instead of disabling retry until fresh verified re-entry. Range, decimal-string rendering, navigation, responsive/footer, CSP, and complete configured suites otherwise passed with intercepted actual-SDK evidence.",
  "handledActionIds": [570021],
  "includeDescription": false,
  "roles": [{
    "role": "uat-tester",
    "verdict": "reject",
    "taskIds": ["T-301", "T-302", "T-303", "T-304", "T-305"],
    "evidence": [
      ".agents/uat-tester/runs/event-436697-batch-b48436fc6cafd492b70f/preview-review-1/cases.md",
      ".agents/uat-tester/runs/event-436697-batch-b48436fc6cafd492b70f/preview-review-1/evidence.md",
      ".agents/uat-tester/runs/event-436697-batch-b48436fc6cafd492b70f/preview-review-1/evidence/observations.json",
      ".agents/uat-tester/runs/event-436697-batch-b48436fc6cafd492b70f/preview-review-1/evidence/browser-run.log"
    ]
  }],
  "findings": [{
    "fingerprint": "uat:snapshot-terminal-401-retry-enabled:v1",
    "title": "Terminal snapshot 401 is presented as retryable",
    "severity": "high",
    "confidence": "high",
    "taskIds": ["T-303", "T-304"],
    "evidence": "With good snapshot data displayed, intercept one current-report response as HTTP 401 and click snapshot refresh. The preview retains stale facts and blocks subsequent old-generation API effects, but keeps #snapshot-refresh enabled, renders one [data-snapshot-retry], and announces ordinary try-again guidance.",
    "reproduction": [
      "Open the exact preview inside the supplied controller host harness with all API routes locally intercepted and allow the initial three current reports to succeed.",
      "Make the next current-report response HTTP 401, then activate snapshot refresh.",
      "Observe retained stale data, enabled snapshot refresh, an enabled retry control, and Hebrew ordinary retry guidance; activate retry and observe zero API calls until re-entry."
    ]
  }],
  "limitations": [
    "Synthetic fixture permission decisions do not prove deployed tenant permissions.",
    "Performance-role warmed mapping/render and long-task budgets are not claimed here.",
    "No production release, controller completion, provider write, or real tenant request was performed."
  ]
}
