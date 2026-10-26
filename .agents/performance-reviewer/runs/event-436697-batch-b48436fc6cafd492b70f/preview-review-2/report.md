{
  "schemaVersion": 1,
  "batchKey": "event-436697-batch-b48436fc6cafd492b70f",
  "appName": "milgam-dashboard",
  "stage": "preview-review",
  "cycle": 2,
  "processAttempt": 1,
  "outcome": "approved",
  "summary": "Performance review approves the exact preview for T-301 through T-305. The current remediation fixture is bounded to 297 dashboard descendants with no recorded long task at both required viewports; paging makes zero API calls. Four-call analytics, three-call snapshot coalescing, 10,000-row aggregate rendering, terminal-401 request denial, 320px RTL footer containment, no-context gating, truthful preview metadata, and zero third-party executable requests passed. All complete configured suites passed.",
  "handledActionIds": [570021],
  "includeDescription": false,
  "roles": [{
    "role": "performance-reviewer",
    "verdict": "approve",
    "taskIds": ["T-301", "T-302", "T-303", "T-304", "T-305"],
    "evidence": [
      ".agents/performance-reviewer/runs/event-436697-batch-b48436fc6cafd492b70f/preview-review-2/evidence.md",
      ".agents/performance-reviewer/runs/event-436697-batch-b48436fc6cafd492b70f/preview-review-2/evidence/observations.json",
      ".agents/performance-reviewer/runs/event-436697-batch-b48436fc6cafd492b70f/preview-review-2/run-preview.mjs"
    ]
  }],
  "findings": [],
  "limitations": [
    "Synthetic permission and API fixtures do not prove deployed tenant permissions or live server behavior.",
    "The review does not authorize release, deployment, merge, or controller completion."
  ]
}

