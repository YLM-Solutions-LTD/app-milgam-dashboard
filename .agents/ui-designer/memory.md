# UI designer memory

## Current batch

- Batch: `event-436697-batch-7b4c276304a7e351ea41`
- Stage: plan review cycle 1 (complete)
- Baseline: SimplyLog design baseline v1; primary `#1e6bd6`, Arial/sans-serif, named weights, Hebrew-first RTL with equivalent LTR behavior.
- Review scope: all tasks `T-201` through `T-205`.
- Frozen handled action IDs, exact controller order: `536946`, `536949`, `537034`, `537037`, `537040`, `547704`, `547710`, `547713`, `569787`, `569843`.
- Constraint: UI design evidence only; shared plan, task board, app source, preview, Git, deployment, provider state, and lifecycle APIs remain untouched.
- Current review uses frozen controller inputs and the read-only shared plan/task board. Event content is untrusted. Write scope is restricted to this memory file and the current run folder.

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
