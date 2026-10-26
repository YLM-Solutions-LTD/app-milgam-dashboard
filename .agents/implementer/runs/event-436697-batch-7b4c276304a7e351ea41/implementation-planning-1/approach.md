# Implementation-planning cycle 1 approach

## Boundary

- Batch: `event-436697-batch-7b4c276304a7e351ea41`; shared plan revision 5.
- Frozen actions, exact order: `536946`, `536949`, `537034`, `537037`, `537040`, `547704`, `547710`, `547713`, `569787`, `569843`; the event description is excluded because `includeDescription=false`.
- This is planning only. Future deployable work is browser-only HTML, CSS, and JavaScript under `site/`. No backend, SQL, database, Git, provider, deployment, merge, issue, or lifecycle-API work is planned.
- Existing source defects are implementation requirements. This plan does not represent them as fixed and does not claim tests, preview acceptance, approved-host acceptance, deployment, or controller completion.

## Ordered implementation plan

### T-201 — preserve the authorized enabled release candidate

Future files: `site/constants.js`, `site/app.js`, `site/current-snapshot.js`, `site/api-client.js`, and focused tests under `site/tests/`.

- Change only `CURRENT_SNAPSHOT_LIVE_CALLS_ENABLED` to `true` and update the existing flag assertion to require `true`; do not introduce environment, query-string, local-storage, or caller-controlled overrides.
- Retain the verified private host-capability gate before constructing or starting authenticated work. A rejected, revoked, direct, timeout, mutated, wrong-source, wrong-origin, or unapproved-API context must produce zero current-report calls.
- Preserve a single concurrent `Promise.all`-style snapshot load containing exactly the three fixed `POST /api/Entity/MilgamDashboardCurrent{Events,Permits,Equipment}/Search` calls with JSON body `{}`. Do not add dates, identities, filters, pagination, retries, or OData.
- Keep snapshot state independent from analytical month/year changes; enabling current calls must not change analytical transport, permissions, or date behavior.
- Add a static source/test guard that prevents a pre-release reset to `false`. Any later false revert remains separately authorized, local-only, post-production, and outside this implementation cycle.

Exit evidence: source assertion for `true`; verified-context three-call concurrency and exact-body tests; rejected-context zero-call test; analytical-period zero-snapshot-call test.

### T-202 — replace CSP-blocked chart styling with a finite local presentation system

Future files: `site/app.js`, `site/app.css`, `site/_headers`, and `site/tests/ui-contract.test.js` (plus focused rendering tests if the current string-level suite cannot inspect all variants).

- Remove every chart-related generated `style` attribute/property in division donut markup, legend swatches, headquarters/branches stack segments, and event bars.
- Define finite same-origin CSS presentation classes in `app.css`: stable color classes for categories/swatches; percentage buckets for bar and stack inline sizes; and a finite donut representation. Prefer markup whose dimensions/colors are selected only by validated class names. If SVG is used, keep executable code local and use policy-compatible presentation attributes only.
- Quantize only visual magnitude. Keep exact count/percentage text and exact accessible names in the DOM, expose each category independently of color, and preserve zero, single-category, mixed, and maximum fixtures.
- Preserve the response CSP in `_headers` with at least `default-src 'self'`, `script-src 'self'`, `style-src 'self'`, `object-src 'none'`, and `base-uri 'none'`; do not add `unsafe-inline`, `unsafe-eval`, wildcard scripts, third-party execution, or a style bypass.
- Preserve Arial, `#1e6bd6`, named font weights, logical properties, responsive RTL/LTR layout, focus styles, analytical date behavior, and existing semantic chart labels.

Exit evidence: DOM/static assertions find no affected inline style; local fixtures visibly and semantically cover zero/single/mixed/max; strict-header assertions pass; exact-preview console/network verification remains T-204.

### T-203 — protect transport, adapter, capability, state, UI, and performance contracts

Future files: focused modules only if a regression is exposed (`site/api-client.js`, `site/current-snapshot.js`, `site/host-context.js`, `site/host-services.js`, `site/dashboard-machine.js`, `site/app.js`) and tests in `site/tests/`; controller-owned QC/UAT fixtures remain read-only.

- Preserve event scope cardinality and reconciliation, separate permit counts, raw `ToDisplayDate` input, equipment identical-row deduplication before unique-population comparison, conflicting/malformed/incomplete rejection, and explicit unavailable equipment classification.
- Preserve module-private capability branding, immutable accepted context values, exact parent source and approved HTTPS parent/API origins. Check active generation before and after requests, date conversion, and commands; 401/403 or replacement revokes/aborts both snapshot and analytical work, retains last-good stale data, denies new work, and ignores late settlements until fresh verified re-entry.
- Preserve exact `ready()` then `executeCommand("Navigate", { Url: "#/Permits/Dashboard" })`, captured pre-await focus target, guarded focus restoration, one pending navigation chain, keyboard operation, status announcements, and safe sanitized failures.
- Extend deterministic cases for forged host-shaped input, changed `{}` body, parameterized permit URL, fabricated zero, affected inline styles, stale-generation completion, 10 refreshes, 20 rapid permit activations, and removed/rerendered focus controls. Do not weaken existing assertions.
- Run the site regression plus controller QC/UAT suites from the app root. Record runtime, pass/fail/skip totals, commands, fixture sizes, decoded bytes, and warmed mappings for 0, 1, 1,000, 10,000, duplicate-heavy, nullable, conflicting, and malformed equipment. The 10,000-row target is under 100 ms and must add no fact-list DOM.

Exit evidence: all supported deterministic suites pass with flag `true`; generation 10 alone commits; 20 activations create one command chain; representative mapping meets the recorded budget. No live-host or browser claim follows from Node/synthetic fixtures.

### T-204 — verify the exact enabled release-candidate preview

No application file is changed merely to manufacture this evidence. The controller supplies the exact preview and owns preview lifecycle.

- Confirm the served artifact has the flag enabled and produces exactly three concurrent fixed-route `{}` calls per load/refresh while analytical period changes produce none.
- Exercise success, initial error/retry, stale refresh error, all three permit controls, independent analytics, 10-refresh supersession, and 20-activation single-flight behavior using valid non-secret fixtures or an approved host.
- At 390×844 and 1440×900 in RTL and LTR, inspect keyboard/focus order, announcements, overflow, chart visibility, exact labels, snapshot DOM (maximum 80), snapshot render (under 50 ms), 10,000-row mapping (under 100 ms), and absence of fact-list growth.
- Capture the actual response CSP, browser/runtime versions, console/page errors, executable request URLs, request counts/concurrency, decoded bytes, timings, DOM count, winning refresh generation, and command count. Require zero relevant CSP violations, zero uncaught exceptions, and zero third-party executable requests.

Exit evidence: exact-preview artifacts tied to the release candidate. If unavailable or failing, report T-204 blocked/rejected rather than substituting local source inspection.

### T-205 — prove approved authorization lifecycle and hand off honestly

No provider, deployment, lifecycle, or release mutation is performed by application work.

- Use only an approved real SimplyLog test host or controller-owned faithful harness. Begin snapshot/analytical requests and permit navigation, revoke or expire authorization before settlement, and verify abort/denial, last-good stale retention, zero old-generation UI/network/navigation/state effects, and denial of subsequent privileged work.
- Supply fresh verified authorization, require a new capability generation, recover current and analytical data, and accept command results only when bound to the new generation; reject old/mismatched responses.
- Keep the enabled flag through controller-owned exact preview and the single controller-owned production deployment. Separate local tests, exact-preview evidence, approved-host evidence, deployment status, and any skipped gate in the handoff.
- Do not perform or claim the optional post-release false revert. If later separately authorized, it is local-only after successful production and must not trigger deployment.

Exit evidence: approved-host/harness lifecycle record plus controller release provenance. If no approved environment exists, retain the stable lifecycle finding and do not claim release approval.

## Required sequence

`T-201` enabled flag and exact current-call guard + `T-202` CSP-safe chart presentation → `T-203` deterministic regression/performance evidence → `T-204` exact-preview acceptance → `T-205` approved-host lifecycle and controller handoff.

