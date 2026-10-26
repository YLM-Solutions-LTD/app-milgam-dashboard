# Security evidence — plan review cycle 3

## Input and remediation reconciliation

- Frozen request: `/workspace/.simplyvibe/input/pending-actions.json` contains exactly action `570021`, in that order, with `includeDescription=false`.
- Current board: `.agents/shared/tasks.json` declares revision 11 and only structure tasks `T-301` through `T-304` (`SHA-256 67e6bc68f33f48b15675e0d3df34f8d4d0568cd3506721fe73798c68746f0e0a`). The matching plan hash is `0f14eb8c7253949a7d9dd158e444e0fd114a867417839a0b95ad569d3c59b408`.
- `/workspace/.simplyvibe/input/remediation-cycle-3.json` is absent from the controller input inventory. Consequently there is no cycle-3 manifest from which to extract current finding fingerprints. Revision 11 records the same packaging fact at `.agents/shared/plan.md:32`; no fingerprint or manifest content was inferred.
- All eight accepted plan-review reports from cycles 1 and 2 were read. The sole accepted product-plan fingerprint was `perf:plan:range-and-count-release-missing-measurable-budgets:v1`; current revision 11 retains its plan-level resolution with explicit analytical budgets at lines 67-68, snapshot budgets at lines 86-87, and evidence requirements at lines 91-104. The cycle-2 missing-manifest references concerned `remediation-cycle-2.json`, not a current cycle-3 product defect.

## Task-by-task current evidence

### T-301 — validated inclusive range

- Current defects are reproducible as stated by the plan: `site/date-range.js:8-14` still emits month-only bounds ending at `23:59:59`, while revision 11 requires real calendar validation, year limits, ordered bounds, exact timezone-less `T00:00:00`/`T23:59:59.997`, and zero request effects for invalid input at `.agents/shared/plan.md:34-42`.
- The security-relevant acceptance is concrete: validation must precede requests, invalid values produce zero effects, and draft edits do not trigger authenticated traffic. This closes injection/amplification ambiguity without treating event or form data as instructions.

### T-302 — generation-bound analytical effects

- Current analytical topology is four fixed dataset requests in `site/dashboard-data.js:10-21`; `site/api-client.js:59-82` selects endpoints from fixed constants and serializes a fixed body rather than constructing an event-controlled route.
- Revision 11 requires current apply/request/authorization generation binding, abort/ignore of superseded work, snapshot isolation, bounded concurrency, and explicit request accounting at `.agents/shared/plan.md:51-68`. These are testable safeguards against old-generation bearer effects and request amplification.
- The existing capability boundary remains concrete current-source evidence: parent/source and allowlisted HTTPS host/API validation in `site/host-context.js:43-90,119-150`; active-capability checks and 401/403 revocation in `site/api-client.js:33-57,59-92,135-163`; verified SDK session/re-entry controls in `site/host-bootstrap.js:18-153`.

### T-303 — field-limited normalization and bounded errors

- Current number-only behavior is reproducible at `site/current-snapshot.js:26-56,111-119`. Revision 11 limits normalization to the five named event/permit aggregates, retains numeric envelopes/equipment and reconciliation, rejects unsafe/malformed values, and forbids partial/fabricated output at `.agents/shared/plan.md:70-87`.
- Diagnostics are explicitly limited to fixed endpoint plus bounded classification, excluding bodies, arbitrary exceptions, API addresses, tokens, credentials, and private markers (`.agents/shared/plan.md:82-84`). Current request code already logs only fixed metadata/body length and raises bounded errors (`site/api-client.js:100-131,153-163`), so the plan does not regress the prior disclosure fix.
- Terminal authorization behavior is testable: retain stale last-good data, disable retries after 401/403/revocation, issue zero old-generation effects, and require fresh verified re-entry (`.agents/shared/plan.md:84-87`). The enabled snapshot flag remains `true` at `site/constants.js:21` and current snapshot fan-out is exactly three fixed requests at `site/current-snapshot.js:9-15`.

### T-304 — exact-candidate trust-boundary verification

- Revision 11 requires the actual packaged SDK and fully intercepted controller GuestBridge, prohibits fake adapters/readiness and real tenant traffic, and requires direct/rejected-context, CSP, disclosure, navigation, terminal denial, and fresh re-entry coverage at `.agents/shared/plan.md:89-104`.
- The current packaged SDK matches the controller fixture exactly: both `site/assets/simplyvibe-client.js` and `controller-host-harness/vendor/simplyvibe-client.js` have SHA-256 `ee67f5ae15c70fee8443701b4391946a2275d922acdf9d1797c69dad3c414bf1`.
- Current CSP is self-only for scripts and confines connections/frame ancestors (`site/_headers:2`); current navigation is a fixed supported command, `Navigate {Url:"#/Permits/Dashboard"}`, after fresh verification (`site/app.js:298-310`). Release evidence expressly rejects attachment claims, prior approval, PR metadata, and synthetic permissions as authority (`.agents/shared/plan.md:102-104`).

## Conclusion

No concrete client-security defect is present in revision 11. The currently reproducible month-range and number-only parsing behaviors are the scoped functional defects the plan orders the implementer to fix, and the security boundaries for those fixes are explicit and testable. The absent cycle-3 remediation manifest is controller packaging state; it prevents fingerprint-by-fingerprint manifest reconciliation but supplies no evidence of an app-controlled vulnerability.
