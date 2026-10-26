# QC preview evidence

- Exact candidate: `1c5ebdae74cb6a1fae0f818b9f44997e43b8245c`; exact preview: `https://8248a782.app-milgam-dashboard.pages.dev`.
- Browser: Chromium `140.0.7339.16`. Host: unmodified controller fixture at fully intercepted `https://milgam.ylm.co.il/controller-host-fixture/`; guest loaded the deployed packaged SDK. All `api.ylm.co.il` calls were locally fulfilled with synthetic fixtures. No tenant token or tenant request was used.
- Inventory command: `find site tests .agents/qc-tester .agents/uat-tester /workspace/.simplyvibe/input/controller-host-harness -type f \( -name '*.test.js' -o -name '*.test.mjs' -o -name '*.test.cjs' -o -name '*.spec.js' -o -name '*.spec.mjs' -o -name '*.spec.cjs' \) -print | sort`. Found 11 site JS, one QC JS plus three QC MJS, three UAT MJS, and one harness MJS; no CJS/spec files.
- `cd site && npm test`: 67 passed, 0 failed, 0 skipped.
- `node --test tests/qc/*.test.js tests/qc/*.test.mjs`: 43 passed, 0 failed, 0 skipped.
- `node --test tests/uat/*.test.mjs`: 29 passed, 0 failed, 0 skipped.
- `cd /workspace/.simplyvibe/input/controller-host-harness && node --test host-fixture.test.mjs`: 2 passed, 0 failed, 0 skipped.
- `node browser-qc.mjs`: passed its supported exact-preview scenarios. At 1440x900 and 390x844 in RTL and LTR, the cross-year Apply issued exactly four analytical requests with identical `2025-12-31T00:00:00` / `2026-01-01T23:59:59.997` bounds and zero snapshot requests; a reversed range issued zero requests and focused `#to-date`. Ten rapid valid Applies issued exactly 40 analytical and zero snapshot calls. Decimal-string snapshot aggregates rendered with 10,000 equipment rows. Exact Navigate produced one `Navigate {Url:"#/Permits/Dashboard"}` effect and parent hash change. There were no console errors or page errors.
- Footer evidence at 1440x900 and 390x844, RTL/LTR: exactly one visible static/in-flow footer, localized three labels/values, version `1c5ebdae74cb` matching the reviewed head prefix, frozen update `2026-10-26T17:18:44.000Z`, preview environment, empty release attribute, and `Not released`/`טרם פורסם`. No footer-originated request was observed. Deterministic suites cover host-waiting/loading/no-context/empty/error/stale/ready and malformed/unstamped/production synthetic variants.
- Delivered CSP remained strict and allowed only the expected trusted frame origin. Executable requests were limited to the locally intercepted controller fixture and exact preview same-origin assets.
- Supplemental checklist at 320x844 RTL found the footer bounding box outside the viewport (`qc-footer-320-rtl-edge-clipping-v1`); the document itself did not create horizontal scroll (`scrollWidth=320`), and required 390x844/1440x900 viewports passed without clipping.
- Full browser telemetry: `evidence/browser-results.json`; screenshots: `evidence/desktop-rtl.png`, `desktop-ltr.png`, `mobile-rtl.png`, `mobile-ltr.png`, `narrow-rtl.png`.

