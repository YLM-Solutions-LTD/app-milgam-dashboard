# Exact-preview performance measurements

- Preview: `https://1de11912.app-milgam-dashboard.pages.dev`
- Controller-supplied PR head: `d9ef28ddc6be1d9b6b9fb2f066bcde19c53c193b`
- Runtime: Node.js v20.20.2; Chromium Headless Shell 140.0.7339.16.
- Harness: trusted parent at an approved HTTPS origin, synthetic non-tenant bearer value, Playwright route interception for every API request, and synthetic host date/navigation adapter. No real tenant API request or token was used.
- Fixture: 3 event rows, 1 permit row, and 10,000 unique equipment rows. Decoded current-response JSON was 4,070,881 bytes per generation (equipment: 4,070,459; events: 281; permits: 141).

## Results

| Measurement | 390×844 | 1440×900 | Budget/result |
|---|---:|---:|---|
| Initial current requests | 3 | 3 | exactly 3, pass |
| Request method/body | POST / `{}` for all 3 | POST / `{}` for all 3 | pass |
| Peak current-request concurrency | 3 | 3 | at most 3, pass |
| One refresh requests | 3 | 3 | exactly 3, pass |
| 10-click refresh burst | 3 | 3 | one generation, pass |
| Snapshot DOM elements | 41 | 41 | at most 80, pass |
| Snapshot horizontal overflow | none | none | pass |
| Refresh wall time (40 ms fixture latency included) | 224 ms | 220 ms | diagnostic |
| Observed browser long tasks ≥50 ms | 0 | 0 | 50 ms ready-render guard, pass |
| Permit activation burst | 1 ready + 1 Navigate | 1 ready + 1 Navigate | one chain, pass |
| Console errors | 0 | 0 | pass |

The route-to-ready delta after the last response was observed as 70–74 ms, but the harness polls readiness on animation frames and this value includes response delivery, JSON consumption, mapping, scheduling, and polling delay; it is not treated as the plan's isolated render duration. The browser long-task observer recorded no task at or above 50 ms. Snapshot node count was constant and heap did not show generation accumulation after refresh/burst (phone 12.59→12.67 MB; desktop 12.86→12.61 MB; GC timing makes these diagnostic only).

## Task coverage

- `T-101`: exact bounded requests, `{}` bodies, concurrent start, and decoded bytes measured.
- `T-102`: 10,000-row equipment envelope mapped to total `10,000` with aggregate-only rendering.
- `T-103`: one refresh and 10-click burst stayed at one three-request generation; retained UI remained bounded.
- `T-104`: 20+ rapid permit activations produced one pending `ready`/`Navigate` chain with exact payload.
- `T-105`: 41 snapshot elements, no horizontal overflow, both required viewports, no ≥50 ms long task.
- `T-106`: browser measurements supplement the accepted deterministic site/QC/UAT results from implementation cycle 2.
- `T-107`: preview identity, browser/runtime, rows, bytes, timings, DOM, concurrency, burst, and command count recorded.

Raw repeatable evidence: `browser-measurements.json`; harness: `measure-preview.cjs`.
