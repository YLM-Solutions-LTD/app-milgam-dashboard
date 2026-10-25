# QC cases

All fixtures are synthetic. No real tenant token or network endpoint is used.

| Area | Task trace | Deterministic coverage |
|---|---|---|
| Trust/bootstrap | T-101, T-103, T-104, T-106 | Approved parent/source/origin, rejected origins/sources/protocols, immutable capability, late valid context, replacement generations, revocation and fresh re-entry. |
| Transport/contracts | T-101, T-102, T-103, T-106 | Exactly three concurrent POSTs with `{}`, strict envelopes, event reconciliation, separate permit units, equipment dedupe/conflict rejection, nullable facts, no fabricated zero. |
| Authorization lifecycle | T-101, T-103, T-104, T-106 | Revoke during an in-flight API response and host `ready`; both late completions are denied. Snapshot supersession, abort, stale retention, and ten-refresh burst are exercised. |
| Failure recovery | T-101, T-103, T-105, T-106 | HTTP 400/401/403/500, offline, abort, malformed JSON, valid zero, sanitized errors, retry/stale contracts. |
| Navigation/focus | T-104, T-105, T-106 | Exact ready/Navigate order, no query parameters, pending lock, sanitized rejection message, stable pre-await activating control, connected/enabled/focus guards. |
| Responsive/a11y/bidi | T-105, T-106 | Semantic region/status/button structure, accessible permit names, focus-visible outline, 44px/88px targets, 900/760px stacks, RTL/LTR locale behavior, 320px floor and bounded aggregate rendering. |
| Executable/delivery | T-101, T-106, T-107 | Same-origin XState asset, no remote script URL, self-only script CSP, approved connect sources, and restored `CURRENT_SNAPSHOT_LIVE_CALLS_ENABLED=false`. |

Legacy fingerprints retained as regressions: `QC-HOST-BOUNDARY-001`, `QC-EQUIPMENT-DEDUPE-001`, and `QC-PERMIT-FOCUS-001`.
