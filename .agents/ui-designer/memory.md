# UI designer memory

## Current batch

- Batch: `event-436697-batch-7b4c276304a7e351ea41`
- Stage: preview review cycle 1 (complete)
- Baseline: SimplyLog design baseline v1; primary `#1e6bd6`, Arial/sans-serif, named weights, Hebrew-first RTL with equivalent LTR behavior.
- Review scope: all tasks `T-201` through `T-205`.
- Frozen handled action IDs, exact controller order: `536946`, `536949`, `537034`, `537037`, `537040`, `547704`, `547710`, `547713`, `569787`, `569843`.
- Constraint: UI design evidence only; shared plan, task board, app source, preview, Git, deployment, provider state, and lifecycle APIs remain untouched.
- Exact candidate: commit `ea974089c5cfa402a44b99606514721807b49dd8`, preview `https://275c4e6f.app-milgam-dashboard.pages.dev`.
- Current review uses frozen controller inputs and the read-only shared plan/task board. Event, preview, API, and message data are untrusted. Write scope is restricted to this memory file and the current run folder.

## Preview-review cycle 1 — process attempt 1 outcome

- Exact candidate under review: commit `3b3f8d4373ff90c2073fb4e884e1fe622a8595a0`, preview `https://02ea3f16.app-milgam-dashboard.pages.dev`.
- The earlier cycle-1 artifacts for commit `ea974089c5cfa402a44b99606514721807b49dd8` are retained as immutable history. New evidence is isolated under `preview-review-1/attempt-1/`.
- Required method: real packaged guest SDK bootstrap through the controller-owned harness, local interception for host/API fixtures, no fake adapter/readiness, no real token, and no external effects.
- Review remains UI-design-only across `T-201` through `T-205`; shared/app/preview/Git/provider/lifecycle state is read-only.
- Verdict: `reject`. `T-201`/`T-202` observable UI passed; responsive enabled snapshot and CSP-safe charts also passed their reviewed portions of `T-203`/`T-204`.
- Stable finding `ui:permit-navigation-real-bridge-unavailable:v1` (high severity, high confidence): all three permit controls render, but real GuestBridge activation produces zero effects and no `#/Permits/Dashboard` route while the UI reports navigation unavailable. This blocks the permit portion of `T-203`/`T-204` and command lifecycle acceptance in `T-205`.
- Evidence: `preview-review-1/attempt-1/report.md`, adjacent `evidence/review.md`, `playwright-results.json`, three viewport screenshots, and ImageGen reference SHA-256 `8ec4e25f33862cc962281937b43e32b46e48d6f3510e428dbe84cb1dfbb9460b`.

## Earlier preview-review cycle 1 outcome

- Verdict: blocked only on `T-205`; observable UI acceptance for `T-201` through `T-204` passed on the exact preview.
- Enabled snapshot rendered reconciled event data, three distinct permit controls, and aggregate-only 10,000 equipment state at desktop/mobile RTL and desktop LTR with zero horizontal overflow and 41 snapshot descendants.
- Strict CSP produced visible donut, swatches, stacks, and bars with no inline styles, relevant CSP console violations, page errors, or third-party executable requests.
- Exact synthetic permit activation emitted `Navigate` with `#/Permits/Dashboard`; rejection restored focus. Approved-host revocation/re-entry and generation binding remain unverified because no approved environment/evidence was supplied.
- Fresh ImageGen review reference: `runs/event-436697-batch-7b4c276304a7e351ea41/preview-review-1/evidence/imagegen-review-reference.png`, SHA-256 `b9de0a7675abc14491274b3543be0d4d8bf14e68849272084cf48a5d468ff3cf`.

## Current batch outcome

- Verdict: approved for plan review; no release-blocking UI findings for `T-201` through `T-205`.
- Plan revision 5 preserves all stable snapshot UI decisions and makes strict-CSP chart visibility, exact text values, responsive behavior, and state independence testable.
- Selected ImageGen evidence: `runs/event-436697-batch-7b4c276304a7e351ea41/plan-review-1/evidence/enabled-snapshot-csp-charts-responsive-reference-v2.png`, SHA-256 `b06f9d0509670962b9095ca3245a5287f6598c6d255695425cbb6552aee185d8`.
- Canonical implementation guidance: adjacent `evidence/design-spec.md`. The first draft remains audit-only because its event examples did not reconcile; v2 corrects overall 128/14 = headquarters 50/6 + branches 78/8.
- Approval is plan-only. Exact-preview UI/CSP/performance behavior, approved-host lifecycle behavior, deployment, and controller completion remain unclaimed.

## Review outcome

- Plan review 1 verdict: ready; no release-blocking UI findings.
- Plan review 2 verdict: approved; no release-blocking UI findings. Revision 2 preserves the six stable UI decisions and adds testable host-unavailable and aggregate-only performance behavior.
- Cycle-2 ImageGen evidence: `runs/event-436697-batch-64aedcef61f479aaf509/plan-review-2/evidence/current-snapshot-responsive-reference.png`, SHA-256 `8146dcab269dd9a6f3d05efd5f632425aa1d5254432bc8c63edbbd12e8171ed8`; canonical behavior is in the adjacent `design-spec.md`.
- Stable decisions: independent snapshot hierarchy, three distinct permit controls, explicit equipment-classification unavailable copy, snapshot-local/stale error treatment, consistent bidi DOM/focus order, and SimplyLog baseline tokens.
- Evidence: `runs/event-436697-batch-64aedcef61f479aaf509/plan-review-1/evidence/current-snapshot-rtl-reference.png` plus `design-spec.md`.
- Preview review 2 verdict: approved for `T-101`–`T-107`; no release-blocking UI findings. Synthetic Playwright evidence covered 1440×900 RTL, 390×844 RTL, and 1440×900 LTR with exact empty snapshot bodies, raw date delegation, exact permit navigation, 41 snapshot descendants, and no horizontal overflow. Deployment-to-commit binding remains controller-supplied because provider APIs were intentionally not called.
- Preview review 3 verdict: reject. Exact preview disables the current snapshot (zero Current* calls and permit controls), leaving T-102–T-106 and enabled-state T-107 without UI evidence; enforcing `style-src 'self'` also blocks nine generated chart styles per render and visibly empties the division donut. Stable findings: `ui:current-snapshot-disabled:exact-preview:v1` (high/high) and `ui:csp-blocks-generated-chart-styles:v1` (medium/high).
