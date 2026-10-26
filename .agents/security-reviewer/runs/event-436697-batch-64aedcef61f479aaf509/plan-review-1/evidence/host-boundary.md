# Host-boundary evidence

## Review scope

- Stage: plan review 1 (design/source inspection only; no preview supplied).
- Reviewed every shared task `T-101`–`T-107`, the authoritative plan and board, frozen actions/event context, accepted planning report, and the existing browser host/API boundary.
- No app, shared artifact, other role home, Git/provider state, or SimplyLog state was changed.

## Concrete source observations

1. `site/host-context.js:75-93` accepts a host context based on `event.origin` and payload shape but never requires `event.source === window.parent`.
2. `site/host-context.js:59-68` accepts any syntactically valid `http:` or `https:` `ApiAddress`; it does not constrain the token destination to an approved SimplyLog API origin.
3. `site/constants.js:5-15` includes cleartext HTTP origins for the three production-style host names, not only localhost development origins.
4. `.agents/shared/plan.md:47-57,107` and task `T-104` require a host-supplied API address and say not to weaken existing origin validation, but do not require source binding, HTTPS-only production origins, API-origin confinement, or direct/fallback denial assertions.
5. Task `T-106` tests exact host date/navigation calls and general regression but does not contain negative cases for a same-origin non-parent sender, cleartext production host/API URLs, an unapproved API origin, or direct top-level access attempting authenticated requests/commands.

## Required negative acceptance

- Reject a correctly shaped context from an allowlisted origin when `event.source !== window.parent`.
- Reject production host contexts unless the parent origin is HTTPS.
- Reject an `ApiAddress` that is HTTP (except an explicitly test-only localhost mode) or whose normalized origin is outside approved SimplyLog API origins.
- On direct/top-level access, timeout, malformed context, or rejected context, issue no authenticated fetch and no privileged host command.
- Ensure the same checks govern the new `ready`, `executeCommand`, and `ToDisplayDate` bridge; accept no command response from an unbound sender/origin.

