# Source and approved-input audit — attempt 2

## Inputs read

- Frozen `pending-actions.json`, sanitized event context, and private `/workspace/AGENTS.md` were read as untrusted/read-only inputs. Action order is `536946`, `536949`, `537034`, `537037`, `537040`; description is excluded.
- Authoritative `.agents/shared/plan.md` and `.agents/shared/tasks.json` were read in full.
- Accepted cycle-2 reports were read for planner, security, performance, UAT, and UI design, including UAT cases/evidence and UI approach/design specification/image evidence metadata.
- Implementer, mini-app builder, API client, host-services, API usage, authentication, and implementation-checklist guidance were read.

## Existing source seams

- `site/index.html`: analytical controls currently begin at `#controls`; insert snapshot markup before it. XState is CDN-loaded and no verified SimplyVibe SDK asset is present.
- `site/constants.js`: analytical keys/routes exist; current routes and the false-by-default flag belong here. Current production-style HTTP trust entries must not survive hardening.
- `site/host-context.js`: parses legacy object/string Context and applies locale, but currently accepts a broad HTTP(S) API URL, does not require `event.source === window.parent`, and logs address detail. Refactor this into an exact parent/API provenance gate shared by all bearer consumers.
- `site/api-client.js`: `requestItems()` builds analytical date bodies and returns only `Items`; retain it for regressions. Add a separate `requestCurrentReport()` returning strict `{items,totalCount,decodedBytes}` and accepting `AbortSignal`.
- `site/dashboard-data.js`, `site/data-mappers.js`, `site/date-range.js`: preserve analytical behavior and request bodies.
- `site/dashboard-machine.js`: one XState v4 actor owns host wait and monthly analytics. Keep its analytical transitions, but feed it only a validated runtime and add a separate current-snapshot actor rather than coupling states.
- `site/app.js`: currently owns one actor, analytical rendering, broad diagnostics, and an extra unbound message observer. Remove the extra observer, redact diagnostics, coordinate two independent actors, and dispose all services on `pagehide`.
- `site/app.css`: logical/responsive foundations exist, but primary/focus tokens need the approved `#1e6bd6` treatment and new constant-cardinality snapshot layout.
- `site/tests/`: existing API/data/machine/host/UI tests are the regression base; add focused synthetic tests without controller prose or credentials.

## Attempt-2 resolution of prior findings

- Shared plan revision 2 states that the host runtime exposes or can adapt `ready`, `executeCommand`, and `ToDisplayDate`, and explicitly permits a small injected date-formatting boundary when it is not wired. Therefore the plan defines the adapter and fail-closed behavior without inventing a second transport.
- Exact trusted origins and verified SDK bytes are environment-owned inputs. Implementation enables integration only when supplied; absent values result in zero authenticated traffic and an unavailable UI. No permissive fallback is planned.
- Live procedure/permission/preview proof is not needed for deterministic local implementation. It remains skipped until the controller supplies an authorized host/preview.

## Integrity

No application or controller-owned file was modified. Writes are limited to `.agents/implementer/memory.md` and this current run folder.
