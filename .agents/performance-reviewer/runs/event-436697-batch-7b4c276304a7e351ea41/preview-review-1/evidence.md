# Preview-review cycle 1 performance evidence

- Exact preview: `https://02ea3f16.app-milgam-dashboard.pages.dev/`
- Exact controller-supplied head: `3b3f8d4373ff90c2073fb4e884e1fe622a8595a0`
- Measured: `2026-10-25T15:00:22.115Z`
- Runtime: Chromium `140.0.7339.16`, Node `v20.20.2`
- Harness: controller-owned `GuestBridge` and host fixture, served locally by Playwright under the preview CSP-allowed `https://simplylog.ylm.co.il` parent origin. No guest adapter, readiness method, command method, tenant token, or external API response was injected. API traffic was intercepted locally.

## Observations

At both 390x844 and 1440x900, the exact preview loaded with the controller-owned bridge and received an authenticated synthetic context. It immediately started exactly three current-report POSTs, each with body `{}`, plus one analytical-period POST. The three current requests demonstrate the intended fixed request fan-out in `T-201`/`T-204`; source also uses `Promise.all` and aborts the preceding generation.

The deployed guest did not expose or instantiate `SimplyVibeClient` and did not expose an injected `SimplyVibeHostAdapter`. `site/index.html` loads only XState and `app.js`; `site/host-services.js` nevertheless defaults to `globalThis.SimplyVibeHostAdapter`. Therefore `createHostServices` returns its unavailable adapter. The controller harness recorded zero effects. The permit `ready()`/`Navigate` path, 20-activation single-flight measurement, command-response generation binding, and the `T-205` revoke/re-entry command lifecycle cannot execute through the actual guest SDK.

This invalidates the previous draft evidence, which injected a fake global adapter and thereby measured one synthetic command chain. Under the required harness, no such guest command chain exists. The same missing bootstrap prevents honest completion of every command-related acceptance item in `T-203` through `T-205` and leaves the core permit drill-down unusable.

The fixture README specifies `https://ylm.ylm.co.il` for its host origin, while the exact preview CSP omits that origin from `frame-ancestors`; a strict run there was blocked before guest startup. To isolate the guest behavior, the unchanged controller fixture was served under already-approved `https://simplylog.ylm.co.il`. This does not prove tenant permissions and no such claim is made.

Because the exact required host path has a release-blocking command bootstrap defect, this cycle does not recycle the prior injected-adapter 10,000-row mapper/render, refresh-burst, or command-burst pass. Source inspection supports bounded current fan-out, linear equipment mapping, constant equipment presentation, and abort/stale-generation suppression, but those are not substituted for a complete exact-preview acceptance run.

Raw repeatable evidence: `browser-measurements.json`, `measure-preview.cjs`.
