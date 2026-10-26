{
  "schemaVersion": 1,
  "batchKey": "event-436697-batch-64aedcef61f479aaf509",
  "appName": "milgam-dashboard",
  "stage": "preview-review",
  "cycle": 3,
  "outcome": "blocked",
  "summary": "Performance review cannot approve exact head 50972d0b555115d3b1c9da90f7df0dc4790c6e8e because the deployed current snapshot is disabled. Synthetic trusted-host runs at 390x844 and 1440x900 observed zero current-report requests, a disabled refresh control, and no snapshot data, so exact-head request, concurrency, decoded-byte, 10,000-row mapping/render, DOM-bound, refresh-burst, and permit-burst budgets remain unmeasured. The disabled shell had 48 document elements, no overflow, no console error, no >=50 ms long task, and same-origin executable resources under CSP. No real tenant token was used.",
  "handledActionIds": [536946, 536949, 537034, 537037, 537040],
  "roles": [{
    "role": "performance-reviewer",
    "verdict": "blocked",
    "taskIds": ["T-101", "T-102", "T-103", "T-104", "T-105", "T-106", "T-107"],
    "evidence": [
      ".agents/performance-reviewer/runs/event-436697-batch-64aedcef61f479aaf509/preview-review-3/evidence.md",
      ".agents/performance-reviewer/runs/event-436697-batch-64aedcef61f479aaf509/preview-review-3/browser-measurements.json",
      ".agents/performance-reviewer/runs/event-436697-batch-64aedcef61f479aaf509/preview-review-3/measure-preview.cjs",
      "site/constants.js",
      "site/app.js",
      "site/current-snapshot.js"
    ]
  }],
  "findings": [{
    "fingerprint": "perf:preview:snapshot-disabled-blocks-performance-acceptance:v1",
    "severity": "high",
    "confidence": "high",
    "taskIds": ["T-103", "T-105", "T-106", "T-107"],
    "evidence": "The exact preview serves CURRENT_SNAPSHOT_LIVE_CALLS_ENABLED=false. At both tested viewports it rendered the explicit disabled status, disabled refresh, no equipment total, and issued zero MilgamDashboardCurrentEvents/CurrentPermits/CurrentEquipment requests, preventing every current-head snapshot performance acceptance measurement.",
    "reproduction": "Open the exact preview inside an allowed synthetic parent, post a valid synthetic host context, intercept the three current-report routes with representative fixtures, and observe #snapshot-status, #snapshot-refresh, and request logs. The status says the snapshot is not enabled, refresh remains disabled, and zero current-report calls occur. Supply an exact preview with the authorized one-deployment flag enabled, then rerun the recorded harness to measure the three-request, volume, DOM, timing, and burst budgets."
  }]
}
