{
  "schemaVersion": 1,
  "batchKey": "event-436697-batch-64aedcef61f479aaf509",
  "appName": "milgam-dashboard",
  "stage": "preview-review",
  "cycle": 2,
  "outcome": "rejected",
  "summary": "Exact-preview synthetic UAT passed the exercised current-snapshot, analytical independence, failure/retry, exact date/navigation, responsive RTL/LTR, and direct-timeout workflows in Chromium 140; core deployed artifacts hash-match the reviewed local files, and supporting suites pass 13/13 UAT plus 49/49 site assertions. Approval is withheld because no approved real SimplyLog host or controller host harness was available: synthetic postMessage context is diagnostic only and cannot prove the required real-host bootstrap, session-expiry, command-response binding, and authorized re-entry workflow.",
  "handledActionIds": [536946, 536949, 537034, 537037, 537040],
  "includeDescription": false,
  "roles": [{
    "role": "uat-tester",
    "verdict": "reject",
    "taskIds": ["T-101", "T-102", "T-103", "T-104", "T-105", "T-106", "T-107"],
    "evidence": [
      ".agents/uat-tester/runs/event-436697-batch-64aedcef61f479aaf509/preview-review-2/cases.md",
      ".agents/uat-tester/runs/event-436697-batch-64aedcef61f479aaf509/preview-review-2/evidence/summary.md",
      ".agents/uat-tester/runs/event-436697-batch-64aedcef61f479aaf509/preview-review-2/evidence/observations.json",
      ".agents/uat-tester/runs/event-436697-batch-64aedcef61f479aaf509/preview-review-2/evidence/desktop-rtl.png",
      ".agents/uat-tester/runs/event-436697-batch-64aedcef61f479aaf509/preview-review-2/evidence/phone-rtl.png",
      ".agents/uat-tester/runs/event-436697-batch-64aedcef61f479aaf509/preview-review-2/evidence/desktop-ltr.png",
      ".agents/uat-tester/runs/event-436697-batch-64aedcef61f479aaf509/preview-review-2/evidence/first-error-retry.png",
      ".agents/uat-tester/runs/event-436697-batch-64aedcef61f479aaf509/preview-review-2/evidence/direct-timeout.png",
      ".agents/uat-tester/runs/event-436697-batch-64aedcef61f479aaf509/preview-review-2/evidence/local-uat.tap",
      ".agents/uat-tester/runs/event-436697-batch-64aedcef61f479aaf509/preview-review-2/evidence/site-tests.tap"
    ]
  }],
  "findings": [{
    "fingerprint": "uat:real-host-authorization-lifecycle:unverified:v1",
    "severity": "medium",
    "confidence": "high",
    "taskIds": ["T-101", "T-103", "T-104", "T-106", "T-107"],
    "evidence": "UAT-006 and the live-host portion of UAT-012 are blocked because the controller supplied the exact standalone preview but no approved real SimplyLog host or controller-provided host harness. Synthetic parent messaging proved diagnostic behavior only.",
    "reproduction": "Open the exact preview through an approved SimplyLog test host/harness, verify authenticated bootstrap and current-report load, expire the authorized session, confirm zero unauthorized requests/commands with retained stale data, then re-enter with a fresh authorized context and verify recovery plus exact permit navigation response binding."
  }]
}
