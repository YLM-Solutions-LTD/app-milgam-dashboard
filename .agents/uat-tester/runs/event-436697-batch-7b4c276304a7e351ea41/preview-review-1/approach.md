# Preview-review approach

- Exact preview: `https://02ea3f16.app-milgam-dashboard.pages.dev`; head `3b3f8d4373ff90c2073fb4e884e1fe622a8595a0`.
- Chromium 140.0.7339.16, controller-owned GuestBridge host fixture served locally at the CSP-approved `https://milgam.ylm.co.il` origin, and intercepted non-secret API fixtures. No real tenant was contacted.
- Exercise enabled snapshot, analytical independence, CSP/DOM/geometry, stale refresh, direct denial, permit burst, and command revocation. Run deterministic UAT and regression suites as supporting evidence.
- The fixture uses its real GuestBridge transport. No guest adapter, `ready()`, command implementation, token, or readiness signal is injected.

