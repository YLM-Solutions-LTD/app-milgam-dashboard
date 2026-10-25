# Preview review cycle 2 approach

- Verify the exact controller-authorized preview and record browser, viewport, direction, console, and network observations.
- Use a local synthetic parent harness plus Playwright route fixtures to exercise visible happy, failure, recovery, independence, trust, navigation, and responsive workflows without real credentials or production writes.
- Re-run deterministic local UAT only as supporting evidence; do not treat it or the synthetic host as proof of real SimplyLog integration.
- Trace every result to `UAT-001` through `UAT-012` and `T-101` through `T-107`; reject on a critical/high-confidence defect or missing required evidence.
