# Performance preview-review plan

- Review exact supplied head `b138df3040ab4468220a29f595d0caa62920f679` at `https://42ad1c5f.app-milgam-dashboard.pages.dev` through the corrected controller fixture and real packaged SDK/GuestBridge.
- Fulfill all host/API traffic locally; never request a tenant token.
- Measure both required viewports, request count/concurrency/body/bytes, 10,000-row mapping, DOM/render limits, refresh and permit bursts, CSP/executable inventory, and lifecycle recovery.
- Reproduce every cycle-3 fingerprint plus silent disconnect, fresh/overlapping re-entry, stale retention, and detached rejection behavior.

