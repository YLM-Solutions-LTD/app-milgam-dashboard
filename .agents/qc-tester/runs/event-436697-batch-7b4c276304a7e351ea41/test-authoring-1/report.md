# QC test-authoring result

```json
{
  "verdict": "approve_with_limitations",
  "taskIds": ["T-201", "T-202", "T-203", "T-204", "T-205"],
  "counts": {
    "qc": {"pass": 25, "fail": 0, "skip": 0},
    "siteRegression": {"pass": 56, "fail": 0, "skip": 0},
    "uat": {"pass": 13, "fail": 0, "skip": 0}
  },
  "stableFindings": [],
  "limitations": [
    "Exact-preview browser, responsive, visual, console, network, delivered-header, render-time, and DOM-count checks were not available during test authoring.",
    "Synthetic host fixtures cannot prove the approved real-host authorization lifecycle gate."
  ]
}
```

## Reproduction

From `/workspace/src/apps/milgam-dashboard`:

```sh
node --test tests/qc/*.test.js
(cd site && npm test)
node --test tests/uat/*.test.mjs
sha256sum tests/qc/snapshot-qc.test.js
```

Evidence: `evidence/qc-test-output.txt`, `evidence/site-test-output.txt`, `evidence/uat-test-output.txt`, and `evidence/summary.md`.
