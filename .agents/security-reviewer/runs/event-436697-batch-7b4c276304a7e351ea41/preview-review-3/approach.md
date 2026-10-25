# Security preview review cycle 3 — process attempt 1

- Exact head: `3dc45f69655efd2a2c6b0ad016b1a8cf8f738066`
- Exact preview: `https://ef2f1185.app-milgam-dashboard.pages.dev`
- Review shared tasks `T-201` through `T-205` and every cycle-3 lifecycle fingerprint.
- Use the unmodified controller GuestBridge and deployed packaged SimplyVibeClient at the fully intercepted corrected Milgam fixture origin; abort non-fixture host/API traffic.
- Inspect matching source/digests, CSP and executable origins, bearer confinement, direct-context denial, terminal authorization taint, fresh-session recovery, stale retention, command generation/single-flight behavior, detached rejection handling, legacy-context denial, and bounded diagnostics.
- Reproduce the current refresh-burst guard across header/empty-state controls and retry/failure/re-entry paths, including request counts, concurrency, lock release, and zero revoked/old-generation effects.
- Never request a tenant credential or infer tenant permission configuration from synthetic fixture decisions.
