# UAT approach — test-authoring cycle 2

- Execute the stable UAT-001 through UAT-012 workflows with synthetic postMessage and API fixtures only.
- Regress accepted fingerprints `uat:equipment-identical-dedup:envelope-cardinality:v1` and `QC-HOST-BOUNDARY-001` directly.
- Exercise visible-workflow contracts through public browser modules; source-text checks are limited to UI behavior that cannot run without a browser harness.
- Run the application regression suite after UAT. Do not access a live tenant, preview, network, token, provider, or lifecycle API.
- Approval requires all deterministic required checks to pass. Exact-preview/browser/live-host verification remains a final-review obligation and is not claimed here.
