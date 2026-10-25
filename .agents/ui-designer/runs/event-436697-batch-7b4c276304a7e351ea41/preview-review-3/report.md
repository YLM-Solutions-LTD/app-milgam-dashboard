{
  "schemaVersion": 1,
  "batchKey": "event-436697-batch-7b4c276304a7e351ea41",
  "appName": "milgam-dashboard",
  "stage": "preview-review",
  "cycle": 3,
  "processAttempt": 1,
  "role": "ui-designer",
  "verdict": "approve",
  "summary": "The exact preview conforms to the SimplyLog baseline for T-201 through T-205. At required RTL/LTR desktop and phone layouts, current facts, strict-CSP charts, accessible permit controls, visible focus, stale last-good retention, terminal 401 denial, automatic fresh re-entry, single-flight Navigate, and the overlapping re-entry race all passed through the actual packaged SDK/GuestBridge with synthetic local fixtures. No stable UI finding remains.",
  "handledActionIds": [536946, 536949, 537034, 537037, 537040, 547704, 547710, 547713, 569787, 569843],
  "taskIds": ["T-201", "T-202", "T-203", "T-204", "T-205"],
  "evidence": [
    ".agents/ui-designer/runs/event-436697-batch-7b4c276304a7e351ea41/preview-review-3/evidence/review.md",
    ".agents/ui-designer/runs/event-436697-batch-7b4c276304a7e351ea41/preview-review-3/evidence/playwright-results.json",
    ".agents/ui-designer/runs/event-436697-batch-7b4c276304a7e351ea41/preview-review-3/evidence/preview-desktop-rtl.png",
    ".agents/ui-designer/runs/event-436697-batch-7b4c276304a7e351ea41/preview-review-3/evidence/preview-mobile-rtl.png",
    ".agents/ui-designer/runs/event-436697-batch-7b4c276304a7e351ea41/preview-review-3/evidence/preview-desktop-ltr.png",
    ".agents/ui-designer/runs/event-436697-batch-7b4c276304a7e351ea41/preview-review-3/evidence/imagegen-stale-reference.png"
  ],
  "findings": [],
  "limitations": [
    "The controller supplied the commit-to-preview association; provider APIs and Git were intentionally not used to re-prove it.",
    "The faithful fixture proves client lifecycle behavior with synthetic permissions; it does not prove real tenant permission configuration or controller release completion."
  ]
}
