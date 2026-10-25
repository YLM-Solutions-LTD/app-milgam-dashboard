# Preview-review cycle 1 performance evidence

- Exact controller preview: `https://275c4e6f.app-milgam-dashboard.pages.dev/`
- Controller-supplied head: `ea974089c5cfa402a44b99606514721807b49dd8`
- Measured: `2026-10-25T14:46:52.912Z`
- Runtime: Chromium `140.0.7339.16`, Node `v20.20.2`
- Harness: allowed synthetic parent at `https://simplylog.ylm.co.il`; all API routes intercepted with non-secret fixtures. No real tenant token or tenant request was used.

## Measurements

At both `390x844` and `1440x900`, the enabled snapshot issued exactly one POST with body `{}` to each of the three current-report routes. Starts were concurrent and peak current-report concurrency was three. A normal refresh issued exactly the same three calls. Ten synchronous refresh activations while pending issued only one three-request generation. Twenty-one rapid permit activations produced one `ready`/`Navigate` command chain with the exact `#/Permits/Dashboard` payload.

The representative equipment envelope contained 10,000 rows and 4,070,434 decoded JSON bytes. Five in-browser invocations of the exact deployed `mapCurrentEquipment` implementation took `14.1, 12.0, 10.4, 10.2, 10.9 ms` on mobile and `16.0, 12.6, 12.0, 10.3, 10.6 ms` on desktop; every warmed sample was below the 100 ms budget. The snapshot rendered 41 descendant elements at both viewports, below the 80-element budget, and equipment growth did not create a fact list. There was no horizontal overflow, no >=50 ms browser long task, no console/page error, and no inline style attribute.

The complete synthetic page-to-ready observations were 425 ms (mobile) and 395 ms (desktop), including iframe bootstrap, fixture transport delay, transfer and JSON parsing; these are not presented as isolated render durations. The absence of a >=50 ms main-thread task, 10-16 ms exact mapper timings, and constant 41-element snapshot DOM support the browser-work budget without overstating network-inclusive timing.

The response CSP retained self-only scripts and styles, `object-src 'none'`, and `base-uri 'none'`. All observed scripts and styles came from the exact preview origin; no third-party executable request occurred.

The approved-host authorization expiry/re-entry scenario in `T-205` was not attempted: the controller required synthetic fixtures and forbade a tenant token, while the shared plan states synthetic messaging cannot close that authorization gate. This preview review therefore makes no approved-host lifecycle or release claim.

Raw repeatable evidence:

- `browser-measurements.json`
- `measure-preview.cjs`

