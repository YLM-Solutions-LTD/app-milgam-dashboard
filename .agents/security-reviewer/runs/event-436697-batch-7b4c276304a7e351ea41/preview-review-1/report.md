{
  "schemaVersion": 1,
  "batchKey": "event-436697-batch-7b4c276304a7e351ea41",
  "appName": "milgam-dashboard",
  "stage": "preview-review",
  "cycle": 1,
  "outcome": "rejected",
  "summary": "Security review rejects exact preview https://275c4e6f.app-milgam-dashboard.pages.dev for one low-severity, high-confidence diagnostic-data disclosure. The approved synthetic parent/API path preserved origin/source binding, API-origin confinement, exact current-report bodies, bearer-header-only use, and the fixed permit command; direct forged context produced zero authenticated requests and host calls. CSP is strict and self-only for scripts/styles, executable traffic was same-origin, and the deployed XState asset matched the reviewed local digest. However, an analytical HTTP error caused the exact preview to log the complete parsed API response body, including synthetic personal/internal fields, to the browser console. All T-201 through T-205 were reviewed; approved-real-host lifecycle acceptance in T-205 remains outside synthetic evidence and is not claimed.",
  "handledActionIds": [536946, 536949, 537034, 537037, 537040, 547704, 547710, 547713, 569787, 569843],
  "roles": [{
    "role": "security-reviewer",
    "verdict": "reject",
    "taskIds": ["T-201", "T-202", "T-203", "T-204", "T-205"],
    "evidence": [
      ".agents/security-reviewer/runs/event-436697-batch-7b4c276304a7e351ea41/preview-review-1/evidence.md",
      ".agents/security-reviewer/runs/event-436697-batch-7b4c276304a7e351ea41/preview-review-1/browser-results.json",
      ".agents/security-reviewer/runs/event-436697-batch-7b4c276304a7e351ea41/preview-review-1/headers.txt",
      "Synthetic approved-parent run: four approved-origin authenticated fixture requests, exact permit command chain, zero third-party executable requests; direct forged context: zero API requests and zero host calls",
      "Exact preview emitted the complete synthetic analytical 500 response body to console.error"
    ]
  }],
  "closedFingerprints": [
    "simplyvibe:host-boundary:parent-source-https-api-confinement:v1",
    "simplyvibe:dependency-integrity:cdn-script-token-realm:v1"
  ],
  "findings": [{
    "fingerprint": "simplyvibe:diagnostics:api-error-body-console-disclosure:v1",
    "severity": "low",
    "confidence": "high",
    "taskIds": ["T-203", "T-204"],
    "evidence": "On the exact preview, a synthetic MilgamDashboardByMonth HTTP 500 body containing personName=SYNTHETIC PRIVATE PERSON and internalRecord=SYNTHETIC-991 was emitted in full by console.error. Source site/api-client.js requestItems() passes the sanitized parsed body to the HTTP-error log, but sanitization removes token strings only and retains unrelated personal/internal fields. See evidence.md and browser-results.json.",
    "reproduction": "Load the exact preview in an approved-origin synthetic parent, send a valid synthetic host context, and intercept the analytical API route with an HTTP 500 JSON response containing a distinctive non-secret personal/internal marker. Capture browser console arguments and observe that the complete response object and marker are logged by [milgam-dashboard.api] HTTP error. No real tenant token or data is required."
  }]
}
