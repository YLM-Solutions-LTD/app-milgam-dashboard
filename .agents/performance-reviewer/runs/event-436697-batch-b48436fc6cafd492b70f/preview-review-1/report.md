{
  "schemaVersion": 1,
  "batchKey": "event-436697-batch-b48436fc6cafd492b70f",
  "appName": "milgam-dashboard",
  "stage": "preview-review",
  "cycle": 1,
  "processAttempt": 1,
  "outcome": "rejected",
  "summary": "Performance review rejects the exact preview. Request topology, snapshot burst coalescing, 10,000-row snapshot DOM, responsive overflow, no-context gating, packaged SDK identity, and truthful preview footer passed. However, the required 1,000-row-per-analytical-report fixture rendered 13,066 dashboard descendants and produced 115-152 ms long tasks at both required viewports, materially exceeding the accepted ceilings of 600 descendants and no task at or above 50 ms.",
  "handledActionIds": [570021],
  "includeDescription": false,
  "roles": [{
    "role": "performance-reviewer",
    "verdict": "reject",
    "taskIds": ["T-301", "T-302", "T-303", "T-304", "T-305"],
    "evidence": [
      ".agents/performance-reviewer/runs/event-436697-batch-b48436fc6cafd492b70f/preview-review-1/evidence.md",
      ".agents/performance-reviewer/runs/event-436697-batch-b48436fc6cafd492b70f/preview-review-1/evidence/observations.json",
      ".agents/performance-reviewer/runs/event-436697-batch-b48436fc6cafd492b70f/preview-review-1/run-preview.mjs"
    ]
  }],
  "findings": [{
    "fingerprint": "perf:preview:analytical-1000-row-unbounded-dom-long-tasks:v1",
    "severity": "medium",
    "confidence": "high",
    "taskIds": ["T-302", "T-304"],
    "title": "Representative analytical volume creates an unbounded dashboard DOM and long main-thread tasks",
    "evidence": "With valid locally intercepted fixtures containing 1,000 division, 1,000 category, and 1,000 closure rows, the exact preview created 13,066 #dashboard descendants at both 1440x900 RTL and 390x844 LTR. PerformanceObserver recorded 152/143 ms desktop long tasks and 125/115 ms phone long tasks. The accepted limits are <=600 descendants and zero app-attributable tasks >=50 ms.",
    "reproduction": "Run the recorded run-preview.mjs command. Inspect desktop-rtl and phone-ltr in evidence/observations.json: metrics.dashboardNodes=13066 and metrics.longTasks contains durations from 115 through 152 ms. API traffic remains locally intercepted and uses no tenant token.",
    "recommendation": "Bound or progressively disclose the analytical row presentation (or virtualize it) so the 1,000-row-per-report case stays within the agreed 600-descendant and <50 ms task ceilings, then remeasure both viewports with the same fixtures."
  }],
  "limitations": [
    "Synthetic permissions and API fixtures do not prove deployed tenant permissions or server behavior.",
    "The review does not authorize release, deployment, merge, or controller completion."
  ]
}
