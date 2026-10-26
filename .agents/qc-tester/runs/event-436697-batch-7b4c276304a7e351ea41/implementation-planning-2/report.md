# QC implementation-planning report

```json
{
  "verdict": "approve_with_findings",
  "batchKey": "event-436697-batch-7b4c276304a7e351ea41",
  "appName": "milgam-dashboard",
  "stage": "implementation-planning",
  "cycle": 2,
  "processAttempt": 1,
  "planRevision": 6,
  "taskIds": ["T-201", "T-202", "T-203", "T-204", "T-205"],
  "handledActionIds": [536946, 536949, 537034, 537037, 537040, 547704, 547710, 547713, 569787, 569843],
  "summary": "QC-221 through QC-232 trace all 26 acceptance criteria and define deterministic, corrected-fixture, exact-preview, functional, lifecycle, diagnostics, performance, responsive, bidirectional, accessibility, and visual gates. Planning is adequate, but three accepted source defects remain mandatory implementation requirements; no fix or test pass is claimed.",
  "evidence": [
    ".agents/qc-tester/runs/event-436697-batch-7b4c276304a7e351ea41/implementation-planning-2/cases.md",
    ".agents/qc-tester/runs/event-436697-batch-7b4c276304a7e351ea41/implementation-planning-2/report.md",
    ".agents/qc-tester/memory.md"
  ],
  "stableFindings": [
    {
      "fingerprint": "verified-guest-sdk-command-path-missing-v1",
      "severity": "high",
      "confidence": "high",
      "taskIds": ["T-203", "T-204", "T-205"],
      "status": "open-implementation-requirement",
      "summary": "The preserved app does not package/initialize the verified SimplyVibeClient and still expects a public injected adapter, so the real GuestBridge Navigate path must be implemented and proven without test injection."
    },
    {
      "fingerprint": "host-session-revocation-must-invalidate-legacy-context-v1",
      "severity": "medium",
      "confidence": "high",
      "taskIds": ["T-203", "T-204", "T-205"],
      "status": "open-implementation-requirement",
      "summary": "SDK disconnect/session rotation must revoke the matching legacy context, abort old work, deny old-token effects, and require fresh verified re-entry."
    },
    {
      "fingerprint": "api-diagnostics-response-body-disclosure-v1",
      "severity": "low",
      "confidence": "high",
      "taskIds": ["T-203", "T-204"],
      "status": "open-implementation-requirement",
      "summary": "API errors currently retain/log parsed or raw response bodies; diagnostics must be limited to bounded metadata and proven free of synthetic personal/internal markers."
    }
  ],
  "superseded": [{
    "fingerprint": "qc-controller-harness-frame-ancestor-missing-v1",
    "status": "controller-fixture-error-not-app-defect",
    "summary": "Use only https://milgam.ylm.co.il/controller-host-fixture/ locally; do not widen trusted origins or CSP for the obsolete ylm.ylm.co.il example."
  }],
  "execution": "not-run-planning-only"
}
```
