# Implementation-planning cycle 2 approach

> Attempt 2 revalidation complete. This folder was the only run folder written in this pass; all application, shared, controller, prior-run, and other-role artifacts remained read-only.

## Scope and decision

- Planning only for shared plan revision 3 and every structural task `T-101` through `T-107`; all seven entries in `tasks.json` were read in full and mapped below.
- Frozen actions are acknowledged in exact order: `536946`, `536949`, `537034`, `537037`, `537040`; `includeDescription=false`.
- `site/`, shared/controller artifacts, prior run folders, other role homes, Git/provider/deployment state, and lifecycle APIs remained read-only.
- Verdict: `ready` for a focused browser-only remediation implementation. This does not claim that the current source is ready: deterministic QC presently reproduces two high-severity findings that the implementation stage must close before completion.

## Ordered implementation plan

### 1. T-101 — enforce capability-bound context and generic envelope shape

Files: `site/host-context.js`, `site/api-client.js`, `site/tests/host-context.test.js`, `site/tests/api-client.test.js`.

- Split host-context work into an internal shape/origin validator and a public authorization boundary. Keep the private brand and predicate in `host-context.js`; `api-client.js` and `host-services.js` import the predicate but receive no brand-mutating API.
- Maintain accepted contexts in a module-private `WeakSet`; only `contextFromMessage` after `event.source === window.parent`, exact approved HTTPS origin, approved HTTPS API-origin correspondence, and token validation may brand a runtime context.
- Copy the accepted scalar fields and nested `Token`, freeze nested and outer objects, retain `__hostContextBound === true` only as compatibility metadata, and require both the private brand and compatibility marker downstream. A forged public marker or approved-origin-shaped object must fail before URL construction/fetch/host service use.
- If tests need synthetic contexts, expose a narrowly named test-only factory that still applies an explicitly supplied synthetic parent/API pair; keep it out of the browser bootstrap path and do not add a production bypass.
- Change `validateCompleteEnvelope` to validate only object shape, `Items` array, and non-negative safe-integer `TotalCount`; keep `{Items, TotalCount}` distinct. Do not impose generic `Items.length === TotalCount` in transport.
- Preserve exact current endpoints, `POST`, literal `{}`, authorization redaction, `AbortSignal`, and unchanged monthly analytical body construction.

Exit gate: forged, mutated, mismatched, HTTP, direct, fallback, and unapproved contexts produce zero analytical or snapshot authenticated calls and zero privileged host-service calls; a valid bound context still supports exactly three current searches.

### 2. T-102 — perform dataset-specific reconciliation after equipment dedupe

Files: `site/current-snapshot.js`, `site/tests/current-snapshot.test.js`.

- In `api-client.js`, replace the common raw-cardinality assertion with shape-only validation. In `current-snapshot.js`, add explicit event and permit cardinality checks (`3` event rows and envelope total `3`; `1` permit row and envelope total `1`).
- For equipment, validate and normalize each row, deduplicate in one `Map` pass by normalized `EquipmentId`, ignore field-equivalent duplicates, reject conflicting duplicates, then require unique-map size to equal envelope `TotalCount`.
- Preserve inactive and nullable facts and the aggregate-only `{total, facts, classification: "unavailable"}` result. Do not infer treatment validity or combine missing and overdue permit units.
- Add the revision-3 observable cases: two identical rows plus `TotalCount:1` succeeds; conflicting duplicates and unique-count mismatch fail.

Exit gate: both `QC-EQUIPMENT-DEDUPE-001` failing cases pass without weakening event/permit validation, and warmed representative-volume mapping remains below the 100 ms local budget.

### 3. T-103 — protect the independent snapshot lifecycle during remediation

Files: `site/current-snapshot.js`, `site/app.js`, associated tests only if a regression is found.

- Retain concurrent three-call loading, snapshot-local generation/abort state, atomic all-valid commit, stale-response suppression, one last-good generation, and no automatic retry.
- Confirm month/year changes issue zero snapshot calls and current failures never fabricate zeros or replace analytics.
- Exercise reverse-order overlap and a ten-refresh burst after transport/adapter changes to prove only the newest generation commits.

### 4. T-104 — route host services through the same bound capability

Files: `site/host-services.js`, `site/host-context.js`, host/service tests.

- Require the private bound-context predicate before exposing `ready`, `ToDisplayDate`, or `executeCommand`; bind responses to the accepted parent source and exact origin. Preserve the existing injected host adapter seam rather than introducing handwritten `postMessage` command transport.
- Pass report date values unchanged to `ToDisplayDate`; never append `Z` or locally reinterpret them.
- Preserve exact permit sequencing and payload: `ready()` then `executeCommand("Navigate", {Url:"#/Permits/Dashboard"})` for all three controls, with one shared pending lock and no automatic retry/query parameters.
- Verify failure unlocks controls, leaves data intact, and exposes only sanitized accessible feedback.

### 5. T-105 — preserve the accepted aggregate-only HTML/CSS/JS surface

Files: `site/index.html`, `site/app.css`, `site/app.js` only if remediation or browser evidence reveals a defect.

- Preserve snapshot-before-analytics DOM/focus order, three native permit buttons, textual equipment-classification-unavailable state, one polite non-atomic status, Hebrew-first copy, logical RTL/LTR layout, Arial, `#1e6bd6`, visible focus, and truthful loading/error/stale states.
- Do not add equipment-row DOM. Confirm ready snapshot stays at or below 80 elements and 1-row/10,000-row normalized inputs have identical equipment UI node counts.

### 6. T-106 — convert both accepted findings into deterministic regressions

Files: existing `site/tests/*.test.js`; consume controller-owned `tests/qc/snapshot-qc.test.js` and `tests/uat/current-snapshot.uat.test.mjs` read-only.

- Add local tests for private-brand rejection, forged marker rejection, post-creation mutation resistance, exact approved parent/API pairs, and zero-effect negative cases.
- Add transport and mapper tests that accept identical duplicate equipment rows before population reconciliation and reject conflicts/mismatches.
- Run targeted host/API/adapter/state/UI tests, `npm test` from `site/`, QC, and UAT suites. Record commands, runtime, counts, failures, and secret scans. Controller QC/UAT files remain read-only; production regressions belong in `site/tests/`.
- Record 0/1/1,000/10,000 and duplicate-heavy bytes/timings, ten-refresh winner/concurrency, twenty-activation command count, DOM count, and browser render timings where an authorized browser harness exists.

Exit gate: no high-confidence finding remains; existing 47-test regression and expanded QC/UAT pass. Missing exact-preview/host/browser capabilities are labeled skipped or blocked, never passed.

### 7. T-107 — preserve flag-safe and controller-owned delivery

Files: configuration/constants and current-run evidence only.

- Leave `CURRENT_SNAPSHOT_LIVE_CALLS_ENABLED=false` in delivered local source and confirm it gates only the current snapshot.
- Separate deterministic local results, authorized-preview browser results, and authenticated live results. Do not infer procedure availability from documentation.
- Do not deploy, push, merge, call lifecycle APIs, alter SQL/backend/database objects, or claim controller completion.

## Required completion order

`T-101` capability/envelope remediation → `T-102` equipment reconciliation → regression protection for `T-103`/`T-104` → UI preservation check for `T-105` → full deterministic and browser evidence for `T-106` → flag/evidence audit for `T-107`.
