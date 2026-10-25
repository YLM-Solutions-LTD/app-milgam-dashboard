# Performance preview evidence — cycle 2

- Exact preview: `https://ea51f277.app-milgam-dashboard.pages.dev/`
- Exact PR head: `8f1e577bbcb4670878dec24ff570c1382a18d170`
- Runtime: Chromium `140.0.7339.16`, Node.js `v20.20.2`
- Fixture: controller-owned real GuestBridge at corrected `https://milgam.ylm.co.il/controller-host-fixture/`; deployed same-origin packaged SimplyVibeClient; no injected adapter/readiness/command; all API responses synthetic and local; tenant traffic blocked.
- Viewports: `390x844`, `1440x900`.

## Measurements

At each viewport, initial load and ordinary refresh issued exactly three current-report POSTs concurrently, one per documented route, each with body `{}`. Peak current concurrency was 3. The decoded representative generation was 4,070,881 bytes: 281 event bytes, 141 permit bytes, and 4,070,459 equipment bytes for 10,000 rows.

The snapshot rendered 41 descendants, showed equipment total 10,000, and had zero horizontal document overflow. Six in-browser mapper samples per viewport had maxima of 22.1 ms (phone) and 15.3 ms (desktop), under the 100 ms warmed budget. Response-to-snapshot mutation was 23 ms and 25 ms, under the 50 ms ready-render budget. The stress response produced one 83 ms long task on phone and one 77 ms long task on desktop; each was a single occurrence during the 4.07 MB/10,000-row path, not repeated work, and the specified mapping/render budgets passed.

Ten synchronous refresh activations produced one three-request generation at each viewport. Twenty rapid permit activations while the real GuestBridge command was held produced zero effects while held and exactly one `Navigate {Url:"#/Permits/Dashboard"}` effect after release. No third-party executable request or uncaught page error was observed.

After `controllerHarness.revoke()`, a forced refresh produced zero current-report calls. A held permit command revoked before release produced zero additional effect, so the old generation was suppressed correctly.

Fresh `controllerHarness.reenter()` advanced the fixture to generation 2 but produced zero fresh current-report calls at both viewports. The guest remained at “waiting for secure connection,” retained the prior 10,000 equipment value as stale, and did not restore authenticated snapshot work. Thus the required fresh-generation recovery path for T-203/T-205 is not accepted.

Raw evidence: `browser-measurements.json`. Reproducer: `measure-preview.cjs`.
