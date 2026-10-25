# Milgam dashboard — recovered release plan

## Scope and source

- Batch: `event-436697-batch-7b4c276304a7e351ea41`
- Plan revision: 6
- Frozen actions, in order: `536946`, `536949`, `537034`, `537037`, `537040`, `547704`, `547710`, `547713`, `569787`, `569843`
- `includeDescription` is false; the event description is context only.
- Preserve the browser-only Hebrew-first dashboard, authenticated host context, permissions, analytical date behavior, charts, and all accepted current-snapshot contracts.
- Recovery preserves prior application changes but grants no release approval. No SQL, backend, `SearchAllEvents`, Git, provider, issue-tracker, or lifecycle-API work is in scope. Deployment remains controller-owned.

## Target structure

```text
Packaged verified SimplyVibeClient (exact trusted parent origin; private instance)
└─ Authenticated host capability (SDK handshake + source/origin + approved API origin + private brand)
├─ Current snapshot lifecycle (independent of analytical dates)
│  ├─ events: overall / headquarters / branches
│  ├─ permits: valid / missing / overdue → exact permit-board command
│  └─ equipment: deduplicated total + classification unavailable
├─ Analytical lifecycle and existing charts
└─ Revocation boundary: abort, deny, retain stale, require fresh generation
```

Cycle-2 remediation additionally replaces the invented `globalThis.SimplyVibeHostAdapter` runtime dependency with the supplied verified SDK, binds the resulting private client/session lifecycle to application authorization, and removes response-body data from browser diagnostics. Existing snapshot loading, empty, error, retry, stale, RTL/LTR, accessibility, analytical, flag, and CSP-safe chart states remain mandatory.

## Verified guest transport and corrected fixture

- Package the controller-supplied, hash-recorded `SimplyVibeClient` as a same-origin static dependency and instantiate it in the guest with the exact trusted parent origin. Do not inject, synthesize, or expose a public adapter global.
- Bootstrap application context from `await client.ready()` and bind `ready()`, `executeCommand()`, `ToDisplayDate()` (where supported by the established host context/date boundary), disposal, session replacement, and authorization generations to the private client instance. The legacy JSON context may be tolerated only as protocol compatibility input; it must not remain independently authoritative after SDK disconnect/session reset.
- A guest SDK session reset, disposal, timeout, rejected command, replacement handshake, or API 401/403 revokes the matching application capability, aborts its requests, invalidates pending commands, and prevents old-generation effects. Fresh re-entry must construct/bind a fresh verified SDK generation.
- The controller correction is authoritative: exercise the fixture at `https://milgam.ylm.co.il/controller-host-fixture/`, fulfill all host/API traffic locally, and make no real tenant request. The earlier `https://ylm.ylm.co.il` example and its frame-ancestor failure are not app defects. Preserve the existing trusted origins and CSP; do not add the mistaken origin.

## Existing browser contracts

After a verified host capability is accepted, issue one concurrent `POST` with body `{}` to each endpoint per snapshot load/refresh:

- `/api/Entity/MilgamDashboardCurrentEvents/Search`
- `/api/Entity/MilgamDashboardCurrentPermits/Search`
- `/api/Entity/MilgamDashboardCurrentEquipment/Search`

Do not send dates, locations, pagination, username, or administrator identity. Validate the complete `{ Items, TotalCount }` envelope once. Missing procedures, 401/403, transport errors, malformed responses, and permission failures are errors, never fabricated zeroes.

Events require the unique scopes `overall`, `headquarters`, and `branches`; non-negative integer totals/open counts; `open <= total`; present `AsOf`; and headquarters plus branches reconciliation to overall. Permits require one row with separate non-negative `ValidCount`, `MissingCount`, and `OverdueCount`, plus `AsOf` and `ValueDate`; never combine missing and overdue as “invalid.” Equipment is normalized then deduplicated by `EquipmentId` before comparing the unique population with envelope `TotalCount`; identical duplicates are ignored, while conflicting duplicates, malformed rows, and incomplete populations are rejected. Render equipment total but keep validity classification explicitly unavailable.

Pass report dates unchanged through `ToDisplayDate()` and never append `Z`. Each permit metric performs exactly:

```text
await host.ready()
await host.executeCommand("Navigate", { Url: "#/Permits/Dashboard" })
```

No filter parameters are invented. A pending command is single-flight, generation-bound, and restores focus only to a captured, still-connected and focusable control.

## Capability and state model

Only a capability created by verified `event.source === window.parent`, an approved HTTPS parent origin, an approved corresponding HTTPS `ApiAddress`, and a module-private/non-forgeable binding may authorize requests or commands. Public flags such as `__trustedHostOrigin` or caller-supplied booleans are insufficient. Direct access, fallback, timeout, mutation, mismatched response source/origin, and unapproved origins result in zero authenticated effects.

```text
accept verified host → generation += 1 → enable analytical/snapshot work
refresh snapshot → requestId += 1 → abort prior → fetch three reports concurrently
late result with stale requestId or generation → ignore
authorization loss/replacement → revoke generation → abort requests/commands
                               → retain last-good data as stale → deny new work
fresh verified host → new generation → explicit reload may recover
```

Snapshot loading/error/timestamp/last-good state remains separate from analytical month/year state. Period changes produce zero snapshot requests. Initial failure shows no numeric placeholders; refresh failure retains prior values marked stale with retry. A snapshot-ready UI may coexist with analytical loading/error and vice versa.

## Authorized flag behavior

For this recovered release candidate, `CURRENT_SNAPSHOT_LIVE_CALLS_ENABLED` must be `true` in source and must remain true through implementation, local tests, exact-preview review, and the single controller-owned production deployment. Tests assert the authorized true configuration. Do not reset it during remediation or preview review.

Only after a successful production release may the controller or a separately authorized local follow-up restore it to false when live verification remains unavailable. That local-only revert must not trigger another deployment. The application implementation must not deploy or call lifecycle APIs.

## CSP-safe chart presentation

Keep the response-header CSP strict and local: at minimum `default-src 'self'`, `script-src 'self'`, `style-src 'self'`, `object-src 'none'`, and `base-uri 'none'`, with only approved connection and framing origins. Do not add `unsafe-inline`, `unsafe-eval`, wildcard executable sources, remote runtime dependencies, or a global CSP bypass.

Remove runtime inline style attributes/properties used for donut gradients, swatches, stacked widths, and bar widths. Use a finite, reviewed presentation mechanism compatible with `style-src 'self'` (for example predefined classes/quantized classes and SVG attributes where allowed by the enforced policy). Preserve accurate labels and accessible numeric text even when a visual is quantized. There must be no CSP style violation, blank donut, missing swatch, or zero-width bar caused by the policy.

Low-fidelity behavior:

```text
RTL/LTR dashboard
├─ snapshot cards: semantic counts/statuses; responsive stack; <=80 nodes
└─ analytical charts
   ├─ donut: visible segments + textual legend
   ├─ stacks/bars: visible CSP-safe magnitude + exact accessible values
   └─ swatches: predefined local classes
```

## Accessibility, direction, and performance

- Preserve native keyboard-operable permit controls, distinct accessible names, visible focus, polite status announcements, sufficient contrast, and non-color-only meaning.
- Use logical layout properties and runtime `dir`; verify 390×844 and 1440×900 in RTL and LTR without clipping or incoherent focus order.
- Exactly three snapshot calls start concurrently per load/refresh, none on period changes, no automatic retries, and at most three current-generation requests remain in flight.
- Map/deduplicate 10,000 equipment rows within 100 ms after warm-up on the recorded runtime. A ready snapshot renders within 50 ms at both recorded viewports and contains at most 80 snapshot DOM elements; equipment growth adds no fact-list nodes.
- A 10-refresh burst commits only generation 10. Twenty rapid permit activations while pending produce one command chain.
- Record runtime/browser versions, fixture sizes, decoded bytes, mapping/render timings, node count, request concurrency, and command count.

## Validation and release gates

Local deterministic suites cover exact request bodies, strict adapters, identical/conflicting equipment duplicates, private host binding, stale suppression, flag=true, chart presentation without inline styles, CSP header integrity, loading/empty/error/stale states, RTL/LTR and keyboard semantics, and existing analytical regressions. Assertions must not be weakened.

Exact-preview review must use the same artifact intended for release and prove: snapshot enabled; three current routes exercised; permit navigation; no relevant CSP console errors; all chart visuals visible on desktop/mobile RTL (plus LTR layout regression); 10,000-row mapping/render and DOM budgets; refresh and permit bursts; and no third-party executable request.

Authorization lifecycle release acceptance requires an approved real SimplyLog host or controller-owned faithful harness. Revoke/expire authorization during requests and a command; prove abort and zero old-generation effects, stale retention, denial of subsequent authenticated work, fresh verified re-entry, recovery under a new generation, and command-response generation binding. Synthetic unapproved messaging cannot close this gate. If no approved environment exists, report the gate blocked/skipped honestly and do not claim release approval.

Browser diagnostics must be metadata-only. For HTTP, invalid JSON/envelopes, mapper, and service failures, log bounded fields such as dataset, status, error kind, and byte/count information; never log or retain raw/parsed API response bodies, snippets, personal/internal fields, tokens, or full serialized error objects. User-visible failures remain generic and actionable, while in-memory validation may inspect a response only for the immediate adapter decision.

## Implementation sequence

1. `T-201` sets and protects the authorized release flag.
2. `T-202` replaces CSP-blocked runtime chart styling while preserving strict headers and visuals.
3. `T-203` packages and binds the verified guest SDK, removes response-body diagnostics, and reruns snapshot, equipment, host-boundary, state, accessibility, and analytical regressions.
4. `T-204` collects exact-preview functional, responsive, CSP, SDK-command, diagnostics, and performance evidence in the corrected local-only controller fixture.
5. `T-205` validates authorization revocation/re-entry through that faithful harness and defines the controller-owned release/revert handoff.
