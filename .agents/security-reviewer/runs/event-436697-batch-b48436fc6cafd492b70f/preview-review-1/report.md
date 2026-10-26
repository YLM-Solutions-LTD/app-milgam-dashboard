{
  "schemaVersion": 1,
  "batchKey": "event-436697-batch-b48436fc6cafd492b70f",
  "appName": "milgam-dashboard",
  "stage": "preview-review",
  "cycle": 1,
  "processAttempt": 1,
  "outcome": "approved",
  "summary": "Security review approves exact preview 8248a782 at controller-declared head 1c5ebdae74cb6a1fae0f818b9f44997e43b8245c across T-301 through T-305. The deployed security-relevant assets matched controller-supplied source bytes; strict CSP and same-origin executable provenance held. Through the locally intercepted controller GuestBridge, the actual packaged SDK confined the synthetic bearer to fixed API routes, denied direct forged context, stopped the rejected 401 generation, rotated credentials only on fresh re-entry, rejected a revoked held Navigate, and emitted neither synthetic private response markers nor page errors. The visible singular footer truthfully identified the preview and Not released. Complete inventory-aware suites passed 141/141. No concrete client-security defect was reproduced; synthetic permissions are not tenant or release-authority evidence.",
  "handledActionIds": [570021],
  "includeDescription": false,
  "roles": [{
    "role": "security-reviewer",
    "verdict": "approve",
    "taskIds": ["T-301", "T-302", "T-303", "T-304", "T-305"],
    "evidence": [
      ".agents/security-reviewer/runs/event-436697-batch-b48436fc6cafd492b70f/preview-review-1/approach.md",
      ".agents/security-reviewer/runs/event-436697-batch-b48436fc6cafd492b70f/preview-review-1/evidence.md",
      ".agents/security-reviewer/runs/event-436697-batch-b48436fc6cafd492b70f/preview-review-1/browser-security.mjs"
    ]
  }],
  "findings": [],
  "limitations": [
    "Synthetic fixture permission decisions do not prove deployed tenant permissions or server authorization policy.",
    "No real tenant token or traffic was used; controller approval, production publication, and lifecycle completion remain unclaimed.",
    "Representative preview states were exercised in-browser; remaining footer state combinations rely on byte-matched packaged assets and passing automated tests."
  ]
}
