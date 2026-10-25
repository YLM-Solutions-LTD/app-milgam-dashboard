{
  "schemaVersion": 1,
  "batchKey": "event-436697-batch-7b4c276304a7e351ea41",
  "appName": "milgam-dashboard",
  "stage": "preview-review",
  "cycle": 1,
  "outcome": "rejected",
  "summary": "Security review rejects exact preview https://02ea3f16.app-milgam-dashboard.pages.dev. The controller-owned GuestBridge harness demonstrated that host-session disconnect does not revoke the preview's legacy context capability: a post-revocation refresh sent all three authenticated current-report requests with the old synthetic generation-1 token. The preview does not package or initialize SimplyVibeClient, so permit navigation and command/session response binding are unavailable. The prior low-severity API error-body console disclosure also remains reproducible. Direct forged context produced zero requests; API origin confinement, strict CSP, and same-origin guest execution held on exercised paths. All T-201 through T-205 were reviewed. Fixture permission decisions are not evidence of tenant permissions.",
  "handledActionIds": [536946, 536949, 537034, 537037, 537040, 547704, 547710, 547713, 569787, 569843],
  "roles": [{
    "role": "security-reviewer",
    "verdict": "reject",
    "taskIds": ["T-201", "T-202", "T-203", "T-204", "T-205"],
    "evidence": [
      ".agents/security-reviewer/runs/event-436697-batch-7b4c276304a7e351ea41/preview-review-1/evidence.md",
      ".agents/security-reviewer/runs/event-436697-batch-7b4c276304a7e351ea41/preview-review-1/browser-results.json",
      ".agents/security-reviewer/runs/event-436697-batch-7b4c276304a7e351ea41/preview-review-1/headers.txt",
      "Faithful GuestBridge disconnect followed by snapshot refresh: three old-generation authenticated requests; guest SDK and adapter both undefined; zero Navigate effects",
      "Exact-preview synthetic analytical 500 emitted complete personal/internal response object to console"
    ]
  }],
  "closedFingerprints": ["simplyvibe:host-boundary:parent-source-https-api-confinement:v1", "simplyvibe:dependency-integrity:cdn-script-token-realm:v1"],
  "findings": [
    {
      "fingerprint": "simplyvibe:auth-lifecycle:legacy-context-survives-host-disconnect:v1",
      "severity": "medium",
      "confidence": "high",
      "taskIds": ["T-203", "T-204", "T-205"],
      "evidence": "The exact preview accepts the GuestBridge legacy JSON context but does not load or initialize SimplyVibeClient; both SimplyVibeClient and SimplyVibeHostAdapter were undefined. After the controller-owned harness disconnected the host session, the preview still rendered connected and a refresh sent the three current-report POST {} calls using Bearer controller-synthetic-generation-1. No permit command reached the real bridge. Source paths: index.html, app.js, host-context.js, and host-services.js. See browser-results.json and evidence.md.",
      "reproduction": "Serve the supplied controller-host-harness under the preview's approved synthetic parent origin with local API interception; do not inject a guest adapter. Load the exact preview, allow initial synthetic generation-1 data, call controllerHarness.revoke(), then click snapshot refresh. Observe three new API requests carrying the generation-1 bearer token and the UI still reporting connected. Click a permit metric and observe zero GuestBridge effects."
    },
    {
      "fingerprint": "simplyvibe:diagnostics:api-error-body-console-disclosure:v1",
      "severity": "low",
      "confidence": "high",
      "taskIds": ["T-203", "T-204"],
      "evidence": "On the exact preview, a synthetic MilgamDashboardByMonth HTTP 500 response containing personName=SYNTHETIC PRIVATE PERSON and internalRecord=SYNTHETIC-991 was emitted in full by console.error. Deployed api-client.js matches reviewed source and logs the sanitized parsed body; sanitization removes token material but retains unrelated personal/internal fields.",
      "reproduction": "In the faithful synthetic host harness, fulfill the analytical route with HTTP 500 JSON containing a distinctive non-secret personal/internal marker. Capture browser console arguments and observe the complete response object under [milgam-dashboard.api] HTTP error."
    }
  ]
}
