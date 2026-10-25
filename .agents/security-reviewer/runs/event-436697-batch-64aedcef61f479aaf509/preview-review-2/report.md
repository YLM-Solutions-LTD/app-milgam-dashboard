{
  "schemaVersion": 1,
  "batchKey": "event-436697-batch-64aedcef61f479aaf509",
  "appName": "milgam-dashboard",
  "stage": "preview-review",
  "cycle": 2,
  "outcome": "rejected",
  "summary": "Security review rejects exact preview https://1de11912.app-milgam-dashboard.pages.dev for one medium-severity, high-confidence credential-boundary defect. The accepted parent/source/origin and private-capability controls worked in exercised synthetic browser checks: an approved parent produced exact fixture-backed requests and commands, while direct forged context produced zero authenticated requests or commands. However, the deployed page executes XState from jsDelivr without Subresource Integrity and the preview sends no Content-Security-Policy. That third-party code executes before the approved parent supplies the bearer token and can observe the host message or wrap fetch in the same realm. All T-101 through T-107 were reviewed; the earlier host-boundary fingerprint is closed for exercised paths, but the new stable dependency-integrity finding requires remediation before approval.",
  "handledActionIds": [536946, 536949, 537034, 537037, 537040],
  "roles": [{
    "role": "security-reviewer",
    "verdict": "reject",
    "taskIds": ["T-101", "T-102", "T-103", "T-104", "T-105", "T-106", "T-107"],
    "evidence": [
      ".agents/security-reviewer/runs/event-436697-batch-64aedcef61f479aaf509/preview-review-2/evidence/preview-security.md",
      ".agents/security-reviewer/runs/event-436697-batch-64aedcef61f479aaf509/preview-review-2/report.md",
      "Exact-preview/local index.html SHA-256 cd7a191ca6071bf21ea0be1457ca9e2af93653213fb02b59077e87710434e769",
      "Synthetic Playwright host/API fixture run: approved context 4 authenticated fixture requests and exact Navigate chain; direct forged context 0 requests and 0 commands"
    ]
  }],
  "closedFingerprints": ["simplyvibe:host-boundary:parent-source-https-api-confinement:v1"],
  "findings": [{
    "fingerprint": "simplyvibe:dependency-integrity:cdn-script-token-realm:v1",
    "severity": "medium",
    "confidence": "high",
    "taskIds": ["T-101", "T-103", "T-104", "T-106", "T-107"],
    "evidence": "Exact preview index.html loads https://cdn.jsdelivr.net/npm/xstate@4.38.3/dist/xstate.js without integrity; preview response has no Content-Security-Policy; browser trace confirms the third-party script executes before synthetic host-context acceptance and subsequent authorization-bearing requests. See evidence/preview-security.md.",
    "reproduction": "Fetch the preview headers and HTML to confirm absent CSP and absent script integrity, then load it under an approved-origin synthetic parent with API route fixtures and observe the jsDelivr request precede host context and authenticated fixture calls. In a controlled synthetic-token run, intercepting that script can harmlessly register a message listener or wrap fetch and observe the synthetic bearer value."
  }]
}
