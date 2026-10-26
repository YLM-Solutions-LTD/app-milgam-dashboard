# File/function implementation plan — T-101 through T-107

## T-101 — strict current transport and trust gate

- `site/constants.js`: add immutable `CURRENT_DATASETS`/`CURRENT_ENDPOINTS` for the three exact `/api/Entity/MilgamDashboardCurrent{Events,Permits,Equipment}/Search` paths and `CURRENT_SNAPSHOT_LIVE_CALLS_ENABLED = false`. Replace broad origin lists with exact controller-provided HTTPS parent→API origin rules; keep localhost only in an explicit synthetic test configuration.
- `site/host-context.js`: change `contextFromMessage`/`installHostContextListener` to require `event.source === window.parent`, exact trusted parent origin, absolute HTTPS `ApiAddress`, and approved normalized API origin. Return a frozen provenance-bearing runtime rather than the raw context. Remove address/token diagnostics. Preserve string/object legacy Context only as late context input, not SDK readiness.
- `site/api-client.js`: require the validated runtime marker in `createApiClient`; confine every bearer URL to its approved API origin. Add `requestCurrentReport(dataset,{signal})` using one POST, `Content-Type: application/json`, exact body `JSON.stringify({})`, and strict `Items` array plus non-negative integer `TotalCount`. Return them distinctly with decoded byte count. Preserve typed abort/network/HTTP/invalid-JSON/invalid-envelope errors and sanitized diagnostics. Leave `requestItems()` and analytical `buildSearchBody()` behavior unchanged.
- Tests: update `host-context.test.js` and `api-client.test.js`; add negative parent/API-origin matrix, exact three-route/body/header/signal assertions, 400/401/403/500/network/abort/invalid JSON/envelope cases, and zero fetches for rejected contexts.

## T-102 — domain adapters

- Add `site/current-snapshot-mappers.js` exporting `mapCurrentEvents`, `mapCurrentPermits`, `mapCurrentEquipment`, and `mapCurrentSnapshot`.
- Events: require outer row count 3, unique `ScopeKey` values `overall`, `headquarters`, `branches`, safe non-negative integer totals/opens, `open <= total`, nonempty raw `AsOf`, and total/open reconciliation `HQ + branches = overall`.
- Permits: require one row and outer count 1; validate independent `ValidCount`, `MissingCount`, `OverdueCount`, raw `AsOf`, and raw `ValueDate`; expose no combined invalid field.
- Equipment: validate documented fields, allow defined nullable treatment/configuration fields and inactive facts, deduplicate in one `Map` keyed by type-stable `EquipmentId`, accept byte/domain-equivalent duplicates, reject conflicts, and require envelope `TotalCount === unique map size`. Return normalized facts, `total`, and `{state:'unavailable'}` classification; never infer pass/fail from status/date/interval.
- Preserve report dates as opaque strings for the date adapter. Add mapper tests for malformed fields, scope reconciliation, zeros, identical/conflicting duplicates, nullable/inactive/never-treated facts, count mismatch, and 0/1/1,000/10,000/duplicate-heavy performance (<100 ms warmed at 10,000 on recorded Node runtime).

## T-103 — independent stale-safe lifecycle

- Add `site/current-snapshot-data.js` with `loadCurrentSnapshot(client,{signal})`: synchronously create the three request promises, await one `Promise.all`, then map atomically. No pagination/retry.
- Add `site/current-snapshot-machine.js` as a separate XState v4 machine. Context: validated runtime/client, generation, data, one `lastGoodData`, status/error, `refreshedAt`, active navigation key. States cover disabled/unavailable, loading, ready, initialError, stale, and navigation as an orthogonal/nested concern.
- Each `LOAD`/`REFRESH` increments generation and invokes an AbortController-backed service; cleanup aborts the previous generation. Success/failure events carry generation and guards ignore stale completions. Initial failure commits no counts; refresh failure retains one coherent last-good snapshot and marks stale. `RETRY` affects only snapshot.
- `site/app.js`: start analytics and snapshot after the same validated runtime. Year/month events go only to analytics. Global refresh intentionally sends analytics `REFRESH` and snapshot `REFRESH`; snapshot retry never touches analytics. False flag causes zero current calls.
- Tests: reverse-order overlap, period independence, initial failure/retry, stale retention, atomic three-report failure, and ten-refresh burst with only generation 10 committed and max three current-generation calls.

## T-104 — host services, dates, and permit navigation

- Package the controller-supplied verified SDK as `site/assets/simplyvibe-client.js` (no handwritten replacement) and load it before `app.js` in `site/index.html`.
- Add `site/host-services.js` with `createHostServices({hostOrigin,dateAdapter})`. Construct SDK with exact trusted origin, register handlers before `ready()`, validate ready Context through the same provenance/API policy, expose `ready()`, `formatDisplayDate(raw)`, `navigateToPermits(metricKey)`, `reconnect()`, and `dispose()`.
- `formatDisplayDate` delegates raw `AsOf`/`ValueDate` unchanged to the approved injected existing `ToDisplayDate` adapter and validates its response. If unavailable/mismatched, snapshot is unavailable/error; no local timezone reinterpretation or appended `Z`.
- `navigateToPermits` uses a shared promise lock: `await ready()` then `executeCommand('Navigate',{Url:'#/Permits/Dashboard'})`, without event context or query parameters. A timeout is surfaced as unknown/non-destructive and never auto-retried. Twenty activations while pending reuse/reject behind one chain; unlock on settle.
- On handshake timeout/reconnect, dispose and recreate SDK/subscriptions. `pagehide` disposes SDK and legacy listeners. Tests use an injected fake SDK/date adapter to verify registration order, exact calls, negative source/origin/session binding, raw dates, burst lock, recovery, and zero commands in direct/fallback/rejected modes.

## T-105 — snapshot markup/view/styles

- `site/index.html`: insert `<section id="current-snapshot" aria-labelledby="current-snapshot-title">` before `#controls`, with persistent Hebrew heading/description and a non-atomic polite status mount. Keep analytical mounts unchanged.
- Add `site/current-snapshot-view.js` with pure `renderCurrentSnapshot(state,{locale})` plus `bindSnapshotActions`. Build a bounded DOM in fixed events→permits→equipment order. Events use labelled descriptions for overall/HQ/branches total/open. Permits use three native buttons with distinct destination-inclusive names. Equipment renders only total and `סיווג בתוקף / באיחור: לא זמין`.
- Render loading text without zeros; validated zero as `0`; initial error with snapshot-only retry; stale warning retaining all last-good values; activated permit `aria-busy`; local navigation error without removing data. Format counts with `Intl.NumberFormat`; show only host-formatted report context.
- `site/app.css`: set primary/focus to `#1e6bd6`, Arial/sans-serif and named weights; add logical-property fluid grid, neutral/status treatments with icon+text, 44 px permit targets, 3 px focus ring/light offset, responsive stacking and 200% zoom/long-copy resilience. Do not add equipment-list styles.
- Tests assert native controls/names/order, RTL/LTR logical behavior, state copy, analytics persistence, ≤80 snapshot elements, constant equipment nodes for 1 vs 10,000 facts, and <50 ms representative render at 390×844 and 1440×900 on the recorded browser/runtime.

## T-106 — deterministic verification

- Extend existing `site/tests/` with current API, mapper, data, machine, host-service, and UI-contract suites using only synthetic fixtures and injected fetch/clock/SDK/date adapter.
- Add a local browser harness under the implementer run/test evidence area if needed; never ship controller input or credentials under `site/`.
- Run `npm ci`, targeted tests, full `npm test`, and browser checks. Record Node/npm/browser versions, decoded fixture bytes, row counts, warmed mapper durations, render durations, snapshot element/equipment-node counts, request start spread/concurrency, winning refresh generation, and navigation command count. Scan fixtures/output for tokens, raw event prose, and signed URLs.

## T-107 — flag-safe handoff

- Verify source ends with `CURRENT_SNAPSHOT_LIVE_CALLS_ENABLED=false`; tests may inject true. The flag gates only current snapshot calls.
- Evidence must separate deterministic local results from authenticated live host/report/navigation checks. Mark live checks skipped when no exact authorized preview/harness exists; do not infer procedure availability from documentation.
- Do not deploy, modify SQL/`SearchAllEvents`, call provider/SimplyLog lifecycle APIs, create issues, merge, or claim controller completion.

## Dependency order and stop conditions

Implement `T-101 → T-102 → T-103/T-104 → T-105 → T-106 → T-107`. If exact trusted configuration, verified SDK bytes, or approved date adapter is absent at implementation time, keep the flag false/fail closed, show unavailable state, complete all deterministic work possible, and report the host-dependent check as blocked/skipped. Do not substitute broad origins, handwritten transport, local date parsing, hardcoded API address, or fabricated metrics.
