# UI designer memory

## Current batch

- Batch: `event-436697-batch-64aedcef61f479aaf509`
- Stage: preview review cycle 3
- Baseline: SimplyLog design baseline v1; primary `#1e6bd6`, Arial/sans-serif, named weights, Hebrew-first RTL with equivalent LTR behavior.
- Review scope: all tasks `T-101` through `T-107`.
- Frozen handled action IDs: `536946`, `536949`, `537034`, `537037`, `537040`.
- Constraint: UI design evidence only; shared plan, task board, app source, preview, Git, deployment, provider state, and lifecycle APIs remain untouched.
- Exact preview review target: PR head `50972d0b555115d3b1c9da90f7df0dc4790c6e8e` at `https://c9756759.app-milgam-dashboard.pages.dev`; inspect read-only with synthetic host context and API fixtures only, never a tenant token.

## Review outcome

- Plan review 1 verdict: ready; no release-blocking UI findings.
- Plan review 2 verdict: approved; no release-blocking UI findings. Revision 2 preserves the six stable UI decisions and adds testable host-unavailable and aggregate-only performance behavior.
- Cycle-2 ImageGen evidence: `runs/event-436697-batch-64aedcef61f479aaf509/plan-review-2/evidence/current-snapshot-responsive-reference.png`, SHA-256 `8146dcab269dd9a6f3d05efd5f632425aa1d5254432bc8c63edbbd12e8171ed8`; canonical behavior is in the adjacent `design-spec.md`.
- Stable decisions: independent snapshot hierarchy, three distinct permit controls, explicit equipment-classification unavailable copy, snapshot-local/stale error treatment, consistent bidi DOM/focus order, and SimplyLog baseline tokens.
- Evidence: `runs/event-436697-batch-64aedcef61f479aaf509/plan-review-1/evidence/current-snapshot-rtl-reference.png` plus `design-spec.md`.
- Preview review 2 verdict: approved for `T-101`–`T-107`; no release-blocking UI findings. Synthetic Playwright evidence covered 1440×900 RTL, 390×844 RTL, and 1440×900 LTR with exact empty snapshot bodies, raw date delegation, exact permit navigation, 41 snapshot descendants, and no horizontal overflow. Deployment-to-commit binding remains controller-supplied because provider APIs were intentionally not called.
- Preview review 3 verdict: reject. Exact preview disables the current snapshot (zero Current* calls and permit controls), leaving T-102–T-106 and enabled-state T-107 without UI evidence; enforcing `style-src 'self'` also blocks nine generated chart styles per render and visibly empties the division donut. Stable findings: `ui:current-snapshot-disabled:exact-preview:v1` (high/high) and `ui:csp-blocks-generated-chart-styles:v1` (medium/high).
