# Security preview review 3 approach

Exact head: `c9686ba1ad6d4f7b0896ba32c29ad38dcf607022`

Exact preview: `https://5ab11833.app-milgam-dashboard.pages.dev`

## Task matrix

- T-201: verify the live snapshot flag is enabled yet remains capability-gated; exact three fixed POST `{}` routes; no authenticated direct/rejected-context traffic.
- T-202: verify delivered CSP/trusted framing remains strict, executable requests are same-origin, and no inline-style/script relaxation creates a browser attack surface.
- T-203: inspect private SDK binding, API-origin confinement, response-body redaction, terminal 401/403 taint, transactional stale retention, distinct-session recovery, command single-flight, and handled disposal/reset rejection paths.
- T-204: exercise the exact preview through the unmodified controller GuestBridge with locally intercepted synthetic API fixtures, recording network/console/page errors and authorization lifecycle behavior.
- T-205: prove old-generation denial and fresh-session-only recovery through the faithful local fixture; explicitly do not infer real-tenant permission configuration or controller release state.

## Current fingerprint matrix

- `simplyvibe-auth-lifecycle-401-refresh-reuses-rejected-generation-v1`
- `perf-preview-fresh-reentry-does-not-restart-snapshot-generation-v1`
- `uat-snapshot-refresh-failure-last-good-cleared-v1`
- `uat-authorization-expiry-old-generation-refresh-allowed-v1`
- `uat-permit-command-singleflight-race-v1`
- `qc-sdk-reentry-client-disposed-unhandled-v1`
- Implementation-planning safeguards: unchanged-session remint, legacy context as independent authority, and raw API address/body diagnostics.

Only reproducible or source-supported security findings will remain open. Functional defects without a plausible confidentiality, integrity, or authorization impact will be documented as closed/remediated evidence rather than relabeled as vulnerabilities.
