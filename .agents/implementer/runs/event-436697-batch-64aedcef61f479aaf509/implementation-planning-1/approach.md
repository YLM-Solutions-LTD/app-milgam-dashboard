# Implementer approach — implementation planning 1, attempt 2

## Scope and decision

- Planning only for approved revision 2, tasks `T-101`–`T-107`, and frozen actions in exact order: `536946`, `536949`, `537034`, `537037`, `537040`.
- `includeDescription=false`; private history and event description are not application requirements and will not enter source or fixtures.
- `site/`, shared artifacts, other role homes, controller inputs, `.git`, and `.github` remained read-only.
- Result: `ready`. The plan is implementable as browser-only HTML/CSS/JavaScript with fail-closed host configuration and injected host-service seams. Missing live host access affects verification evidence, not local implementation planning.

## Implementation strategy

1. Harden the common host boundary first, then allow either existing analytics or the new snapshot to receive a provenance-validated runtime.
2. Extend the existing API client with a separate strict current-report operation; do not alter analytical date bodies or mapper semantics.
3. Add strict current snapshot adapters and a dedicated XState actor so month changes cannot clear, cancel, or reload current data.
4. Wrap the verified SimplyVibe SDK in one host-services adapter. Use its `ready`/`executeCommand` contracts; inject the approved existing `ToDisplayDate` adapter without inventing date semantics. If configuration, SDK, or date service is unavailable, expose a sanitized unavailable state and issue zero authenticated requests/commands.
5. Add a constant-cardinality accessible snapshot view before analytical controls and preserve the existing charts.
6. Add deterministic local contract, race, accessibility, and performance tests, then record exact evidence. Authenticated preview checks remain controller-owned and may be honestly skipped.

## Guardrails

- No backend API, proxy, SQL/database object, OData, `SearchAllEvents`, provider/deployment action, Git change, issue, or lifecycle call.
- No bearer request until `window.parent`, exact approved HTTPS parent origin, and approved normalized HTTPS API origin are bound together.
- No automatic retry of snapshot calls or mutating host navigation; stale generations are aborted and ignored.
- The delivered/default `CURRENT_SNAPSHOT_LIVE_CALLS_ENABLED` remains `false`.
