# Milgam dashboard UAT cases — date-range batch plan review 1

## Final-review execution contract

These cases are designed, not executed. Final review must use the exact authorized preview and fully local interception described in `approach.md`. Record `PASS`, `FAIL`, or `BLOCKED` per case; skipped or unauthorized steps are never passes. No case authorizes production writes, real tenant traffic, deployment, or lifecycle effects.

## UAT-301 — Authorized entry, range seeding, and arbitrary valid Apply

- Tasks: `T-301`, `T-302`, `T-304`
- Goal: an authorized user gets a usable default and can apply a valid range that period discovery does not constrain.
- Preconditions/mode: actual SDK/GuestBridge fixture; discovery variants of multiple periods and empty list; automated browser/network capture.
- Steps/expected: enter `/App/milgam-dashboard`; no app API call occurs before verified readiness. Discovery seeds the latest/current full month when available. Apply a single day, cross-month/year range, and a valid range absent from discovery (including empty discovery). Each accepted Apply produces four concurrent analytical calls—division, summary, category, closure—exactly once, with identical `FromDate=<from>T00:00:00` and `ToDate=<to>T23:59:59.997`, no `Z`. Draft edits alone cause no request or visible-data change. Refresh in ready and empty states repeats the applied bounds. Fresh authorized re-entry retains the applied range.

## UAT-302 — Date validation, focus, announcement, and zero effects

- Tasks: `T-301`, `T-304`
- Goal: bad calendar input is actionable and cannot trigger data effects.
- Preconditions/mode: request counter; keyboard and screen-reader-semantics inspection.
- Steps/expected: independently submit missing, impossible, non-leap `2025-02-29`, malformed, reversed, `1752-12-31`, and beyond-`9999-12-31` values; also accept leap day and both year boundaries. Every invalid submission announces concise Hebrew inline guidance, sets `aria-invalid`, focuses the relevant input, retains current displayed data, and issues zero requests. From/To/Apply remain labeled, keyboard operable, and have 44px targets.
- Direction/viewport: repeat keyboard/focus/overflow checks at 390×844 and 1440×900 in RTL and LTR.

## UAT-303 — Latest analytical generation wins without snapshot coupling

- Tasks: `T-302`, `T-304`
- Goal: rapid range work cannot render stale analytics or disturb current snapshot facts.
- Preconditions/mode: delayed/reverse-order analytical fixtures; ready and loading snapshot variants.
- Steps/expected: apply ten valid ranges rapidly, delay older results, and settle newest then old. Superseded work aborts where possible; only generation 10 commits. Each accepted generation has four identical-bounds calls with no duplicate report. Record snapshot values/state/timestamp and three-report call count before the burst: analytical Apply/refresh neither issues, cancels, clears, nor alters snapshot work. Snapshot refresh likewise leaves selected analytics bounds unchanged. Revocation during Apply causes old responses to have zero state effect; fresh verified re-entry uses only its new generation.

## UAT-304 — Decimal-string snapshot aggregates and strict invariants

- Tasks: `T-303`, `T-304`
- Goal: legitimate wire-format counts render numerically without weakening dataset integrity.
- Preconditions/mode: HTTP-200 fixtures with numeric envelope `TotalCount`, strict equipment rows, and event/permit aggregate variants.
- Steps/expected: trimmed digit-only strings including whitespace and leading zeros for event `TotalCount`/`OpenCount` and permit `ValidCount`/`MissingCount`/`OverdueCount` render as correct numbers, with permit categories separate. Safe numeric values remain valid. For each of empty, signed, fractional, exponent, negative, unsafe, missing, malformed, open-over-total, scope-unreconciled, and permit-unreconciled variants, reject the dataset atomically with no fabricated zero or partial commit. Numeric strings remain invalid for envelope `TotalCount`; equipment behavior remains unchanged.

## UAT-305 — Report-specific errors, stale authorization loss, and recovery

- Tasks: `T-303`, `T-304`
- Goal: users receive safe recovery guidance while last-good facts and authorization boundaries remain intact.
- Preconditions/mode: valid first load followed independently by equipment 500, report 400/404, network failure, invalid response, 401, 403, and revocation; controllable in-flight responses.
- Steps/expected: ordinary failures identify the affected report in concise Hebrew, retain bounded status/class and fixed known endpoint only, keep Retry enabled, and never expose body markers, arbitrary exception text, API address, token, credential, or private event content in DOM/console/serialized diagnostics. After last-good data, 401/403/revocation preserves it visibly stale, disables ineffective Retry, denies further old-generation effects, and recovers only after fresh verified re-entry. Initial failure fabricates no facts. Burst refresh/retry while pending coalesces to one bounded chain of exactly three concurrent snapshot calls.

## UAT-306 — Exact Navigate lifecycle and authorization rotation

- Tasks: `T-303`, `T-304`
- Goal: preserved permit controls use the supported privileged command and nothing survives revoked authority.
- Preconditions/mode: actual SDK/GuestBridge fixture with hold/revoke/reenter support; no injected adapter or readiness promise.
- Steps/expected: both certificate links, by keyboard and pointer, emit exactly `Navigate {Url:"#/Permits/Dashboard"}` and change the synthetic parent hash; no command occurs before SDK readiness. Hold a command, revoke, then release: zero old-generation navigation/state effects. Fresh re-entry rotates the session and a new command succeeds. A concurrent in-flight snapshot 401 retains stale facts and suppresses further old-generation work.

## UAT-307 — Responsive, bidi, accessible complete dashboard

- Tasks: `T-301`, `T-302`, `T-303`, `T-304`
- Goal: calendar, analytics, snapshot, status, and recovery controls remain usable together.
- Preconditions/mode: loading, ready, empty, validation-error, ordinary-error, and stale-auth fixtures; Chromium at required viewports.
- Steps/expected: at 390×844 and 1440×900 in RTL and LTR, verify logical control order, visible focus, Hebrew labels/status announcements, non-color-only chart meaning, no horizontal overflow/overlap, strict CSP, functional charts, and zero relevant page/console errors. Apply, Refresh, Retry, and certificate navigation stay distinguishable and state-appropriate.

## UAT-308 — Complete inventory and honest controller release gate

- Tasks: `T-304` (and release evidence for `T-301`–`T-303`)
- Goal: evidence represents the exact candidate and never converts partial/synthetic proof into release readiness.
- Preconditions/mode: final candidate, exact preview identity/digest, source flag check, fresh role reports.
- Steps/expected: immediately rediscover every `*.test.{js,mjs,cjs}` and `*.spec.{js,mjs,cjs}` under app test roots and the controller harness; reconcile the inventory to commands and totals. Run `cd site && npm test`, then complete explicit QC JS+MJS, UAT MJS, and harness lists without a partial glob. Preserve exact commands, totals, skips, and failures. Confirm the reviewed/deployed SDK artifact identity and `CURRENT_SNAPSHOT_LIVE_CALLS_ENABLED=true`. Any failure, omitted discovered file, missing fresh reviewer, critical high-confidence finding, candidate mismatch, or absent new authorized approval blocks readiness. Old approval, attachment claims, PR metadata, and synthetic permissions never authorize release; live-tenant reconciliation remains a stated controller-owned limitation.

## Cross-task workflows

- `X-301 Range journey`: UAT-301 → UAT-302 → UAT-303 → UAT-307.
- `X-302 Snapshot integrity/recovery`: UAT-304 → UAT-305 → UAT-307.
- `X-303 Authorization lifecycle`: accepted entry in UAT-301 → snapshot expiry in UAT-305 → command revocation/re-entry in UAT-306.
- `X-304 Release evidence`: UAT-301–UAT-307 → complete inventory and exact-candidate gate in UAT-308.

Plan-review execution status: designed, not executed.

