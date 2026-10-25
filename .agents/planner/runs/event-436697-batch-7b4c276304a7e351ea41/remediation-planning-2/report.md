# Planner remediation report

```json
{
  "verdict": "ready",
  "batchKey": "event-436697-batch-7b4c276304a7e351ea41",
  "appName": "milgam-dashboard",
  "stage": "remediation-planning",
  "cycle": 2,
  "processAttempt": 1,
  "planRevision": 6,
  "taskIds": ["T-201", "T-202", "T-203", "T-204", "T-205"],
  "handledActionIds": [536946, 536949, 537034, 537037, 537040, 547704, 547710, 547713, 569787, 569843],
  "evidence": [
    ".agents/shared/plan.md revision 6 makes the verified SDK session authoritative, requires metadata-only diagnostics, and applies the corrected local-only fixture origin without widening CSP.",
    ".agents/shared/tasks.json retains structure-based tasks T-201 through T-205 and adds observable SDK bootstrap, revocation, Navigate, diagnostics, and fresh-generation acceptance.",
    "tasks.json passed the required task-board schema; includeDescription, exact frozen action order, and exact task IDs passed separate checks.",
    "Read-only source and accepted review evidence establish the missing packaged client/global adapter dependency and response-body logging roots.",
    "No application source, Git, deployment, provider, tenant, issue, or lifecycle operation was performed."
  ],
  "stableFindings": [
    {
      "fingerprint": "verified-guest-sdk-command-path-missing-v1",
      "severity": "high",
      "taskIds": ["T-203", "T-204", "T-205"],
      "status": "planned",
      "summary": "Package and privately initialize the supplied verified SimplyVibeClient so exact permit commands traverse GuestBridge without an injected adapter."
    },
    {
      "fingerprint": "host-session-revocation-must-invalidate-legacy-context-v1",
      "severity": "medium",
      "taskIds": ["T-203", "T-204", "T-205"],
      "status": "planned",
      "summary": "SDK disconnect or session rotation must revoke legacy context authority, abort old work, and require fresh verified re-entry."
    },
    {
      "fingerprint": "api-diagnostics-response-body-disclosure-v1",
      "severity": "low",
      "taskIds": ["T-203", "T-204"],
      "status": "planned",
      "summary": "Browser diagnostics must expose bounded metadata only and no raw, parsed, or snippet response-body fields."
    },
    {
      "fingerprint": "mistaken-fixture-origin-frame-ancestor-v1",
      "severity": "none",
      "taskIds": ["T-204", "T-205"],
      "status": "superseded-controller-fixture-error",
      "summary": "Use the corrected milgam.ylm.co.il fixture locally; do not widen trusted origins or CSP for the mistaken ylm.ylm.co.il example."
    }
  ]
}
```
