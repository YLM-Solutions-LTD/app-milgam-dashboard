# Performance preview evidence — cycle 3

- Exact preview: `https://5ab11833.app-milgam-dashboard.pages.dev/`
- Exact PR head supplied by controller: `c9686ba1ad6d4f7b0896ba32c29ad38dcf607022`
- Runtime: Chromium `140.0.7339.16`, Node.js `v20.20.2`
- Fixture: controller-owned real GuestBridge at `https://milgam.ylm.co.il/controller-host-fixture/`; deployed packaged SimplyVibeClient; no injected guest adapter/readiness/command; all API traffic fulfilled locally with synthetic fixtures; no tenant token or tenant request.
- Viewports: `390x844` and `1440x900`.
- Artifact identity: deployed `host-bootstrap.js` SHA-256 `95cf5d712e033039a104f9cc0b9e698bc06596c6e36444fa9448b35c4683a7f9`, equal to reviewed source. Packaged SDK SHA-256 `ee67f5ae15c70fee8443701b4391946a2275d922acdf9d1797c69dad3c414bf1`, equal to the supplied verified SDK.

## Passing measurements

At both viewports the initial snapshot, ordinary refresh, and ten-click synchronous refresh burst each emitted one generation of exactly three concurrent current-report POSTs with `{}` bodies; peak current concurrency was 3. A representative generation decoded 4,070,881 bytes including 10,000 equipment rows. Six mapper samples had maxima of 15.7 ms (phone) and 13.6 ms (desktop), below the 100 ms budget. Response-to-snapshot mutation was 21 ms and 19 ms, below 50 ms. The snapshot had 41 descendants (budget 80), equipment total 10,000, and no horizontal overflow. The two observed 72–73 ms long tasks occurred while the measurement deliberately executed six 10,000-row maps synchronously and are therefore measurement-induced, not an app request/render loop.

Twenty permit activations against a held real bridge command produced zero effects while held and exactly one Navigate effect after release. A populated snapshot survived both 500 and 401 refresh failures byte-for-byte, visibly stale. After 401, an ordinary refresh emitted zero requests against the rejected generation. Distinct re-entry automatically emitted exactly three generation-2 current calls plus the supported analytical load. Overlapping generation-3/generation-4 re-entry emitted only the newest generation-4 work. No page error, unhandled disposed-client error, or synthetic error-body marker was observed. These measurements resolve all six fingerprints in `remediation-cycle-3.json` on the exact preview.

The exact response CSP remained strict and no third-party executable request or relevant CSP console error was observed. `CURRENT_SNAPSHOT_LIVE_CALLS_ENABLED` was operationally true.

## Reproducible remaining defect

The separate bridge-disconnect path still remints work from the unchanged generation. At both viewports, after a successful generation-1 load, `controllerHarness.revoke()` followed by ordinary forced refresh emitted four requests carrying `Bearer controller-synthetic-generation-1`: the three current reports and `MilgamDashboardByMonth`. Only afterward did distinct re-entry correctly use generation 2. This violates T-203/T-205's zero old-token requests after harness disconnect and adds an avoidable four-request burst per revoked refresh.

Source supports the observation: `site/host-bootstrap.js` only sets `deniedSessionSource` for `http-401`/`http-403`; the `SimplyVibe.AuthorizationRevoked` callback uses `revoke("host-event")`, leaving unchanged-session `connect()` eligible. Separately, `site/host-context.js:119-190` still allows legacy `contextFromMessage` / `installHostContextListener` to create a bound API-capable context without a verified client. That is primarily a security boundary defect, but it corroborates that the shared T-203/T-205 legacy-context requirement is not fully implemented. The runtime-address diagnostic issue is resolved: `summarizeContext` no longer includes `ApiAddress`, and distinctive response markers did not reach console output.

Raw evidence: `browser-measurements.json`, `lifecycle-measurements.json`. Reproducers: `measure-preview.cjs`, `measure-lifecycle.cjs`.
