# Implementation-planning cycle 3 approach

## Boundary

- Batch: `event-436697-batch-64aedcef61f479aaf509`; shared plan revision 4.
- Frozen actions, exact order: `536946`, `536949`, `537034`, `537037`, `537040`; event description excluded (`includeDescription=false`).
- Planning only. `site/`, `.agents/shared/`, prior runs, other role homes, controller inputs/results, Git/provider/deployment state, and lifecycle APIs remain read-only.
- Browser-only HTML, CSS, and JavaScript under `site/` are the only future implementation surface. No backend, SQL, database, deployment, merge, or issue work is planned.

## Ordered implementation plan

### 1. T-101 — make executable and capability boundaries fail closed

Files for the implementation stage: `site/index.html`, new same-origin XState browser asset under `site/vendor/`, new `site/_headers`, `site/constants.js`, `site/host-context.js`, `site/api-client.js`, and focused tests.

- Copy the pinned `xstate@4.38.3` browser artifact into the deployable tree, reference it by a relative same-origin URL, remove every CDN/fallback executable reference, and record SHA-256 for the shipped file rather than relying on the package-cache path.
- Add static-host response headers with an enforcing CSP: at minimum `default-src 'self'; script-src 'self'; object-src 'none'; base-uri 'none'`, narrowly enumerated approved HTTPS API `connect-src`, and the minimum approved SimplyLog embedding policy. Do not add inline/eval/wildcard permissions or treat a meta tag as equivalent evidence.
- Preserve exact `{}` snapshot POSTs and monthly request bodies. Extend the bound-context abstraction into a revocable, immutable generation capability; client construction and every request start must confirm the generation remains active. A 401/403 invokes one authorization-loss transition before surfacing a sanitized typed failure.
- Reset the current snapshot live-call flag to false in delivered local source and prove it gates only snapshot calls.

Exit gate: local static tests reject remote executable references and unsafe CSP directives; unbound/revoked contexts construct or start zero authenticated work; exact current and analytical transport contracts remain intact.

### 2. T-102 — preserve strict dataset semantics

Files: `site/current-snapshot.js` and mapper tests only if capability/error propagation requires changes.

- Preserve the already-correct event reconciliation, separate permit metrics, equipment identical-deduplication/conflict rejection, nullable facts, and unavailable classification.
- Ensure authorization-loss errors are not converted to zeros or malformed-response states and obsolete raw generations are not retained.

Exit gate: existing mapper cases and 0/1/1,000/10,000-row budgets still pass without adding equipment DOM or inferred validity.

### 3. T-103 — key analytical and snapshot lifecycles to authorization generation

Files: `site/current-snapshot.js`, `site/dashboard-machine.js`, `site/app.js`, and lifecycle tests.

- Add a single app-level capability coordinator that owns the active generation, analytical and snapshot abort handles, and invalidation/re-entry transition. Do not duplicate token-bearing context outside the immutable capability.
- On approved replacement/invalidation or authenticated 401/403: revoke atomically, abort both lifecycles, prevent new privileged work, retain last-good snapshot/analytics as stale where available, render sanitized reauthorization status, and reject late generation completions.
- Permit a fresh approved bootstrap to create a new generation, rebuild API/host-service facades, and resume independent analytical and snapshot lifecycles without reusing the expired token.
- Preserve snapshot request IDs, exactly three concurrent current calls, zero retries, refresh supersession, period independence, and one last-good snapshot.

Exit gate: deterministic expiry-during-flight and re-entry tests prove zero post-revocation requests, no old-generation commit, retained stale data, and recovery on a new generation.

### 4. T-104 — generation-bind host services and make permit cleanup safe

Files: `site/host-context.js`, `site/host-services.js`, `site/app.js`, and host/navigation tests.

- Allow the context listener to process approved lifecycle replacement/invalidation events rather than permanently ignoring messages after the first accepted context; maintain exact parent source/origin and approved API-origin binding.
- Wrap `ready`, `ToDisplayDate`, and `executeCommand` with active-generation checks before dispatch and after settlement. Reject mismatched, revoked, or late responses; issue no further command until fresh bootstrap.
- In `navigateToPermits`, capture `const activatingControl = event.currentTarget` synchronously before the first await. In `finally`, clear the global lock, unlock only still-connected controls, and focus only if the captured element is still connected, enabled, and exposes `focus`; never access `event.currentTarget` after an async boundary.
- Preserve exact `ready()` then `executeCommand("Navigate", { Url: "#/Permits/Dashboard" })`, one pending chain, raw `ToDisplayDate` arguments, and sanitized accessible failure.

Exit gate: rejection, removal, rerender, revocation, and 20-click burst cases produce no page error/unhandled rejection and at most one valid command chain.

### 5. T-105 — render revocation and navigation outcomes accessibly

Files: `site/app.js`, `site/index.html`, and `site/app.css` only where state presentation requires it.

- Preserve the accepted snapshot-before-analytics structure, Hebrew-first bidi-safe layout, native permit controls, 41-element representative baseline (maximum 80), visible focus, aggregate equipment card, and analytical UI.
- Add explicit reauthorization/stale copy without clearing last-good data. Keep permit-navigation failure available in the polite status region; if the original control disappeared, leave focus on a safe extant target without synthetic focus churn.

Exit gate: RTL/LTR and 390×844/1440×900 checks preserve no overflow, DOM bound, keyboard order, truthful zero/loading/stale/unavailable semantics, and render timing.

### 6. T-106 — convert all three cycle-3 findings into regressions

Files: `site/tests/*.test.js` plus current-run evidence; controller-owned suites remain read-only.

- Add dependency/CSP assertions over the deployable files and browser network/header assertions against the exact preview when controller infrastructure supplies it.
- Add authorization-generation tests for in-flight request abort, 401/403 invalidation, command/date late-response rejection, stale retention, new-generation recovery, and negative source/origin/direct/fallback cases.
- Add browser coverage for rejected permit navigation when the activating element survives, is removed, and is rerendered; assert unlocked controls, accessible feedback, safe focus, and zero uncaught errors.
- Rerun site, controller QC, and UAT suites; record versions, counts, decoded bytes, mapper/render timings, request concurrency, DOM count, and navigation count. Use only synthetic non-secret fixtures.

Exit gate: deterministic suites pass and exact-preview evidence proves response CSP plus same-origin executable loading. A missing approved real host remains explicitly blocked/skipped, not passed.

### 7. T-107 — produce honest, flag-safe handoff evidence

Files: `site/constants.js` and implementer run artifacts.

- Confirm `CURRENT_SNAPSHOT_LIVE_CALLS_ENABLED=false` in delivered local source after any controller-authorized live check, and distinguish local, synthetic-preview, exact-preview, and authenticated real-host results.
- Record the shipped XState version/digest, CSP response evidence, secret scan, task/file/test traceability, and remaining external real-host prerequisite.
- Do not deploy, call provider or lifecycle APIs, merge, or claim controller completion.

## Required order

`T-101` local dependency/CSP + revocable capability foundation → `T-103` lifecycle orchestration → `T-104` generation-bound services/focus cleanup → `T-102` semantic regression → `T-105` presentation → `T-106` complete verification → `T-107` flag/evidence audit.

