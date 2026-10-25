{
  "schemaVersion": 1,
  "batchKey": "event-436697-batch-7b4c276304a7e351ea41",
  "appName": "milgam-dashboard",
  "stage": "preview-review",
  "cycle": 2,
  "outcome": "rejected",
  "summary": "Security review rejects exact preview https://ea51f277.app-milgam-dashboard.pages.dev. The packaged verified SDK, real Navigate transport, disconnect denial, command-response invalidation, generation-2 re-entry, body-free diagnostics, direct-context denial, bearer origin confinement, and strict CSP held in the corrected local-only controller fixture. However, after a synthetic API 401 revoked generation 2, clicking snapshot refresh reconnected to the unchanged bridge session and resent four authenticated requests with the same rejected generation-2 bearer without controller re-entry. All T-201 through T-205 were reviewed; fixture decisions are not evidence of tenant permissions.",
  "handledActionIds": [536946, 536949, 537034, 537037, 537040, 547704, 547710, 547713, 569787, 569843],
  "roles": [{
    "role": "security-reviewer",
    "verdict": "reject",
    "taskIds": ["T-201", "T-202", "T-203", "T-204", "T-205"],
    "evidence": [
      ".agents/security-reviewer/runs/event-436697-batch-7b4c276304a7e351ea41/preview-review-2/evidence.md",
      ".agents/security-reviewer/runs/event-436697-batch-7b4c276304a7e351ea41/preview-review-2/browser-results.json",
      ".agents/security-reviewer/runs/event-436697-batch-7b4c276304a7e351ea41/preview-review-2/headers.txt",
      ".agents/security-reviewer/runs/event-436697-batch-7b4c276304a7e351ea41/preview-review-2/digests.txt",
      "Faithful corrected-origin GuestBridge: exact Navigate, held-command revocation, zero post-disconnect requests, generation-2 recovery, and post-401 same-generation bearer replay"
    ]
  }],
  "closedFingerprints": [
    "simplyvibe:auth-lifecycle:legacy-context-survives-host-disconnect:v1",
    "simplyvibe:diagnostics:api-error-body-console-disclosure:v1"
  ],
  "findings": [{
    "fingerprint": "simplyvibe:auth-lifecycle:401-refresh-reuses-rejected-generation:v1",
    "severity": "medium",
    "confidence": "high",
    "taskIds": ["T-203", "T-204", "T-205"],
    "evidence": "In the exact preview under the corrected faithful controller fixture, a generation-2 current-events response was fulfilled with HTTP 401. The app revoked to its secure-waiting state, but without controllerHarness.reenter() or any bridge generation rotation, clicking snapshot refresh caused hostBootstrap.reconnect() to accept the unchanged generation-2 context and send all three current-report POST {} calls plus the analytical request again with Bearer controller-synthetic-generation-2. Source maps the refresh control to unconditional SDK reconnect and does not require changed host session/credential generation after HTTP authorization failure. See browser-results.json and evidence.md.",
    "reproduction": "Serve the supplied unmodified controller-host-harness entirely locally at https://milgam.ylm.co.il/controller-host-fixture/ and load the exact preview. Complete generation-1 startup, call controllerHarness.reenter() for generation 2, then fulfill a current-events request with HTTP 401. Do not call reenter again. Click snapshot refresh and observe four new API requests carrying Bearer controller-synthetic-generation-2, the same credential generation rejected by the 401."
  }]
}
