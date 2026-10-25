# Implementation cycle 2 approach

Batch: `event-436697-batch-64aedcef61f479aaf509`  
Actions, exact order: `536946`, `536949`, `537034`, `537037`, `537040`  
`includeDescription=false`; tasks retained: `T-101` through `T-107`.

## Ordered task approach

1. **T-101** — Replace public-shape host trust with a module-private branded `WeakSet` capability created only by validated parent/source/exact HTTPS-origin messages; immutably copy and freeze token/context data. Require that capability in API and host-service boundaries. Relax generic current envelope validation to shape plus non-negative safe-integer `TotalCount`, retaining exact authenticated `POST` and `{}` behavior.
2. **T-102** — Keep event/permit cardinality strict in their adapters. Deduplicate normalized equipment facts in one `Map` pass, accept identical duplicates, reject conflicting duplicates, then reconcile unique population to outer `TotalCount`; retain inactive/null facts and classification `unavailable`.
3. **T-103** — Preserve and regression-test independent parallel snapshot loading, abort/generation suppression, atomic three-report commit, snapshot-only retry, and last-good stale retention without analytical-period coupling.
4. **T-104** — Gate `ready`, `executeCommand`, and `ToDisplayDate` on the same bound capability; preserve raw report-date arguments, exact unfiltered `#/Permits/Dashboard` navigation, pending lock, safe failure, and no automatic retry.
5. **T-105** — Preserve the approved Hebrew-first aggregate-only snapshot surface, truthful zero/loading/error/stale/unavailable states, native permit controls, logical bidi layout, visible focus, and existing analytical controls/charts.
6. **T-106** — Add deterministic production regressions for private branding/immutability and equipment duplicate semantics; run focused tests, full site suite, controller QC/UAT, secret scans, and available numeric mapping/request/navigation/DOM checks.
7. **T-107** — Leave `CURRENT_SNAPSHOT_LIVE_CALLS_ENABLED=false`, record exact local/runtime evidence and unavailable live/browser checks, and avoid Git, provider, deployment, lifecycle, backend, SQL, or database actions.

## Completion gate

Do not report `ready` unless both accepted high-confidence findings are closed and all available required local suites pass. Exact-preview, authenticated tenant, and real-host/browser checks may be reported only if actually available and executed.
