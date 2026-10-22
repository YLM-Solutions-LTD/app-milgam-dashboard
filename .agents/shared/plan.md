# Milgam dashboard — current snapshot plan

## Scope and source

- Batch: `event-436697-batch-64aedcef61f479aaf509`
- Plan revision: 3
- Frozen actions, in order: `536946`, `536949`, `537034`, `537037`, `537040`
- Event description is excluded (`includeDescription: false`). The event record is context only.
- This revision preserves the existing authenticated, browser-only dashboard, Hebrew-first RTL presentation, charts, and analytical month selection. It adds an independent current-state snapshot for events, permits, and equipment.
- No SQL, backend endpoint, database, `SearchAllEvents`, deployment, or Git work is in scope.

## Product structure

The existing analytical dashboard remains date-driven. Above its current charts, add a current-snapshot region whose lifecycle is independent of period discovery and selected-month dashboard loading.

```text
Header / authenticated-host connection
├─ Current snapshot (not affected by year/month controls)
│  ├─ Current events: overall / headquarters / branches
│  ├─ Permits: valid / missing / overdue (each navigates to permit board)
│  └─ Equipment: total + explicit "classification unavailable"
├─ Analytical period controls
└─ Existing monthly charts and summaries
```

Low-fidelity RTL sketch:

```text
┌─────────────────────────────────────────────────────────────┐
│ תמונת מצב נוכחית                         [עודכן: date/time] │
│ ┌────────── אירועים ──────────┐ ┌────── אישורים ─────────┐ │
│ │ כלל: total | פתוחים: open  │ │ בתוקף  missing  overdue│ │
│ │ מטה ...      סניפים ...     │ │ all three are buttons  │ │
│ └─────────────────────────────┘ └─────────────────────────┘ │
│ ┌────────────────────── ציוד ─────────────────────────────┐ │
│ │ סה״כ ציוד: total   סיווג בתוקף/חריגה: לא זמין          │ │
│ └──────────────────────────────────────────────────────────┘ │
├──────────────── monthly period controls ────────────────────┤
│ existing analytical dashboard and charts                    │
└─────────────────────────────────────────────────────────────┘
```

On narrow viewports the three snapshot panels stack in DOM order. Logical CSS properties and document `dir` must support both RTL and LTR without reversing data meaning.

## Existing API and host contracts

Use the existing authenticated entity-search transport and host-supplied `ApiAddress` and bearer token. Add exactly these datasets:

| Dataset | Request | Body | Successful envelope |
|---|---|---|---|
| current events | `POST /api/Entity/MilgamDashboardCurrentEvents/Search` | `{}` | `{ Items, TotalCount }` |
| current permits | `POST /api/Entity/MilgamDashboardCurrentPermits/Search` | `{}` | `{ Items, TotalCount }` |
| current equipment | `POST /api/Entity/MilgamDashboardCurrentEquipment/Search` | `{}` | `{ Items, TotalCount }` |

Make one request per dataset per snapshot refresh. Do not send dates, location filters, user identity, administrator identity, pagination fields, or invented parameters. Validate both `Items` and `TotalCount`; do not confuse envelope totals with domain metrics. Procedures, permissions, and contract documentation are external prerequisites, not proof that live calls succeed.

### Host and token trust boundary

Before any authenticated request, date-format bridge call, or navigation command, bind the accepted bootstrap to both `event.source === window.parent` and an explicitly approved HTTPS parent origin. Production-style HTTP origins are not trusted. Normalize `ApiAddress` to its origin and accept it only when it is HTTPS and belongs to the approved SimplyLog API-origin set corresponding to the trusted host environment; do not accept an arbitrary syntactically valid HTTP(S) destination. Any localhost exception must be explicit, test/development-only, and use synthetic credentials/data rather than a production bearer token.

Downstream code must accept authenticated host data only as a context created by that successful binding path. A plain object is not trusted merely because it contains an approved `__trustedHostOrigin` or otherwise resembles the context shape. Use a non-forgeable module-private brand/factory boundary (for example, membership in a private `WeakSet`) and, for compatibility if the current abstraction exposes it, require `__hostContextBound === true`; the public marker alone is never sufficient. Freeze or copy the accepted fields so callers cannot replace the token, API address, or origin after binding. Synthetic unit contexts must be created through an explicit test-only factory rather than bypassing production validation.

Bind command/date-service responses to the same parent window and accepted origin. Direct/top-level access, timeout, malformed or rejected context, unapproved API origin, mismatched source/origin, and fallback display mode must issue zero authenticated fetches and zero privileged host commands. These checks protect existing analytical calls as well as the new snapshot calls.

The client must continue to redact credentials and must never persist or render a token. HTTP, network, permission, absent-procedure, malformed-JSON, malformed-envelope, and semantic-validation failures are explicit failures—not zero values.

### Current-event adapter

Require exactly one row for each `ScopeKey`: `overall`, `headquarters`, `branches`. Each row requires non-negative integer `TotalCount` and `OpenCount`, plus a parseable/present `AsOf`; `OpenCount <= TotalCount`. Envelope `TotalCount` is the row count and must reconcile with `Items.length`, not the event population.

Validate:

- `headquarters.TotalCount + branches.TotalCount === overall.TotalCount`
- `headquarters.OpenCount + branches.OpenCount === overall.OpenCount`
- each row has unique, supported scope key

The UI reflects the supplied report meaning: all dates and active rows, open means event `Status=1`, handling state does not alter it, HQ is `SiteGeoGroupId=4`, and all other/unassigned locations are branches. These rules are not recomputed in the browser.

### Permit adapter

Require exactly one row with non-negative integer `ValidCount`, `MissingCount`, `OverdueCount`, and present report dates `AsOf`, `ValueDate`. Keep all three metrics separate. Never label `MissingCount + OverdueCount` as invalid certificates because the units differ. The browser does not recalculate expiry.

Each metric is a semantic button/link that runs the existing host navigation contract after readiness:

```text
await host.ready()
await host.executeCommand("Navigate", { Url: "#/Permits/Dashboard" })
```

Use the exact URL for all three indicators and add no query/filter parameters. Disable or busy-lock repeated activation while the command is pending, restore it on completion/failure, and expose navigation failure non-destructively without discarding loaded snapshot data.

### Equipment facts adapter

Require rows to expose `EquipmentId` and accept the documented fact fields: `LocationEntityId`, `LocationEntityType`, `LocationPath`, `EquipmentTypeId`, `IsActive`, `TreatmentDaysInterval`, `NextTreatmentDate`, `LastTreatmentEventId`, `LastTreatmentDate`, `LastTreatmentSeverityId`, `LastTreatmentStatus`, `TreatmentCategoryId`, `ValidTreatmentSeverityId`, `AsOf`. Treatment/configuration fields may be null. Deduplicate identical equipment by `EquipmentId`; conflicting duplicate facts are invalid. The envelope `TotalCount` is the equipment population and must equal the deduplicated count because the report is complete and unpaged. Unlike event and permit envelopes, equipment must not apply a generic `Items.length === TotalCount` check before deduplication: repeated identical rows may make raw `Items.length` larger than the population.

```text
validate envelope shape and integer TotalCount
for row in Items:
  validate and normalize facts
  if EquipmentId unseen: store normalized row
  else if normalized row differs: reject conflicting duplicate
  else: ignore identical duplicate
require uniqueEquipment.size === envelope.TotalCount
```

Events and permits retain their dataset-specific raw row-cardinality rules (three event rows and one permit row respectively); loosening equipment cardinality must not weaken those contracts.

Render total equipment. Render valid/overdue classification as unavailable; do not infer it from activity, interval, last-event status, dates, severity, or missing values. Keep inactive equipment in the population. Preserve facts in the adapter for future supported behavior, but do not expose invented validity totals.

### Dates

Report dates flow through the existing SimplyLog `ToDisplayDate()` adapter/service. Do not append `Z`, manually reinterpret timezone, or use report dates as analytical filter inputs. If that adapter is not currently wired in the mini-app host abstraction, expose a small injected date-formatting boundary with the same contract rather than implementing new date semantics.

## State and concurrency model

Snapshot state is orthogonal to the analytical machine state:

```text
snapshot.id += 1
snapshot.status = loading
parallel fetch(events {}, permits {}, equipment {})
if response.id != snapshot.id: ignore
if all validate: snapshot = ready(data, refreshedAt)
else: snapshot = error(sanitizedError), preserve lastGoodData if any
```

- Begin snapshot loading only after authenticated host context is accepted.
- Period/month changes affect only analytical data and never restart or clear snapshot data.
- A global refresh may intentionally start both lifecycles, but each has its own request ID, abort controller, loading indicator, error, and refreshed timestamp.
- Refresh supersedes and aborts the prior snapshot request. Late success/failure from older request IDs cannot mutate current state.
- First-load failure shows a snapshot-local retry/error panel while the analytical dashboard continues independently. Refresh failure with prior good data retains that data, marks it stale, and provides retry.
- Never display placeholder numeric zeros during loading or error.

The previously authorized one-deployment live-call flag is an operational verification instruction, not permanent UI behavior. Keep `CURRENT_SNAPSHOT_LIVE_CALLS_ENABLED` false by default/local state; implementation may provide the flag boundary. Deployment remains controller-owned. If live verification is unavailable, report it as skipped and restore false locally without requesting a deployment solely for that revert.

## Accessibility, localization, and performance

- Snapshot region has a heading and a polite, non-atomic status announcement; loading uses textual status, and errors provide a keyboard-operable retry.
- Permit indicators are native buttons or links with distinct accessible names (valid, missing, overdue), visible focus, and no color-only meaning.
- Counts use locale-aware formatting. Dates use the host adapter. Hebrew copy is the default; direction/layout follows runtime `dir` for RTL/LTR.
- Keep the existing charts, semantics, focusability, date selection, and permissions behavior unchanged.
- Exactly three snapshot calls run concurrently on initial authenticated load or snapshot refresh—no pagination loop and no request per card/metric.
- Rendering is linear in returned rows; equipment deduplication uses a map keyed by `EquipmentId`. Avoid retaining obsolete raw responses or logging fact payloads.
- Measurable local budgets: exactly three snapshot requests per initial load/refresh, zero on period changes, zero automatic retries, and at most three current-generation snapshot requests in flight. Under mocked transport, initiate all three within 50 ms.
- Exercise equipment envelopes of 0, 1, 1,000, and 10,000 rows, including duplicate-heavy and nullable-field variants. After one warm-up, 10,000 rows must map/deduplicate within 100 ms on the recorded CI/runtime; retain only normalized output plus one `lastGoodData` generation.
- A burst of 10 refreshes commits only generation 10 and causes no retry storm. Twenty rapid activations of a pending permit control issue exactly one ready/navigation chain.
- Equipment growth from 1 to 10,000 rows adds no fact-list DOM nodes; the complete snapshot stays at or below 80 elements. A ready render completes within 50 ms at 390×844 and 1440×900 in the recorded browser/runtime.
- Record decoded bytes for each mocked response at representative volume without imposing a client rejection cap unsupported by the complete-result API contract. Timing ceilings are local regression budgets, not live-latency promises.

## Verification strategy

Unit coverage must exercise exact endpoints/body/headers, envelope semantics, event reconciliation, permit separation, equipment dedupe/conflict handling/null fields, report-date adapter invocation, explicit failure rather than fabricated zeros, stale response suppression, independent analytical/snapshot transitions, navigation command arguments, RTL/LTR structure, keyboard behavior, unavailable equipment classification, host parent/source/origin/API confinement, direct-access denial, and the measurable performance cases above.

Local tests must not require a live SimplyLog instance. A live verification, if controller infrastructure makes it available, checks authenticated responses and the permit navigation command but must be reported as skipped when unavailable. No task depends on inventing equipment validity rules.

## Implementation sequence

1. `T-101` extends the existing transport without changing analytical request bodies.
2. `T-102` defines strict current-snapshot adapters and reconciliation.
3. `T-103` adds an independent, stale-safe snapshot lifecycle.
4. `T-104` introduces host date/navigation boundaries.
5. `T-105` renders the accessible responsive snapshot region.
6. `T-106` adds contract, state, UI, and regression tests.
7. `T-107` documents verification/flag handling and runs available checks during implementation without making deployment part of the code task.
