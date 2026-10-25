# Implementer plan — cycle 2

Batch: `event-436697-batch-7b4c276304a7e351ea41`

- T-201: preserve `CURRENT_SNAPSHOT_LIVE_CALLS_ENABLED=true` and the exact three current-report requests.
- T-202: preserve the accepted CSP-safe chart implementation and existing trusted-origin/header policy.
- T-203: package the controller-supplied verified `SimplyVibeClient`; bootstrap it for the exact referrer/approved host origin; accept API context only after SDK `ready()` returns it; bind host services and revocation to that private client generation; dispose/revoke on lifecycle failure; remove response bodies/snippets from API errors and logs; add deterministic regression coverage.
- T-204: run site, QC, UAT, SDK integrity, diagnostics, and local corrected-harness checks where locally supported; record exact limitations without claiming preview approval.
- T-205: verify disposal/session failure suppresses old-generation API and command effects and fresh SDK bootstrap is required for recovery; retain controller-owned deployment/release boundaries.

Edits are limited to `site/` and this implementer home. No real tenant, provider, deployment, lifecycle, Git, backend, database, or controller-owned artifact changes are authorized.
