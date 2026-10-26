# Current revision-11 UI review evidence

## Input and remediation reconciliation

- Frozen request: `/workspace/.simplyvibe/input/pending-actions.json` has `includeDescription=false` and one ordered action, `570021`; the Description is background only.
- Current board: `.agents/shared/plan.md` identifies revision 11 and the same frozen contract at lines 5–9; `.agents/shared/tasks.json` identifies revision 11 and `source.actionIds=[570021]` at lines 5–7.
- `/workspace/.simplyvibe/input/remediation-cycle-3.json` does not exist. This is a verified controller-packaging fact, not an inferred finding. There are therefore no supplied cycle-3 fingerprints to invent or claim closed. Plan lines 27–32 disclose this limitation and instead reconcile the requested defects directly against current source.
- Accepted cycle-1 fingerprint `perf:plan:range-and-count-release-missing-measurable-budgets:v1` remains resolved in current revision 11: plan lines 67–68 and 86–87 provide analytical/snapshot volume, bytes, timing, DOM, long-task, request-total, concurrency, cancellation, burst, and nonlinear-work ceilings; lines 91–104 make those measurements part of complete-suite and intercepted-preview evidence. The matching board requirements and acceptance criteria are in T-301 through T-304.
- Current source confirms this is an implementation plan rather than a stale fix claim: `site/date-range.js:8-14` still exposes month-only `23:59:59` bounds; `site/app.js:218-257` still renders year/month selects; `site/app.js:152-176` still couples analytical retry with snapshot refresh; and `site/current-snapshot.js:26-56,111-116` still rejects decimal strings through the number-only count guard. Revision 11 targets each current defect explicitly at plan lines 29–42 and 70–87.

## Task-by-task design review

- `T-301`: plan lines 34–49 and board requirements define native From/To/Apply controls, real-date validation, `.997` inclusivity, zero-effect invalid states, an announced Hebrew inline error, `aria-invalid`, focus transfer, 44px targets, RTL/LTR logical layout, and 390×844/1440×900 fit. Draft and applied states are explicitly separate. This is implementation-ready.
- `T-302`: plan lines 51–68 define a stable applied-range display model, independent analytical refresh, loading/empty/error preservation, stale-generation suppression, and snapshot independence. The UI can keep the last successful analytics visible until a new Apply succeeds and show progress/status without clearing the snapshot.
- `T-303`: plan lines 70–87 define numeric rendering after narrow normalization, distinct permit categories, bounded report-specific Hebrew guidance, stale last-good facts, and disabled ineffective retry on terminal authorization. These requirements prevent fabricated zeros and destructive emptying while preserving three permit actions.
- `T-304`: plan lines 89–104 requires real-SDK intercepted validation of RTL/LTR keyboard and focus behavior, announcements, overflow, CSP charts, page errors, responsive/performance limits, exact `Navigate`, and complete multi-extension test inventory. Current inventory is nine site JS, three QC (one JS/two MJS), two UAT MJS, and one harness MJS; no CJS/spec files were found. The disclosed site 49/50 missing-`xstate` failure is preserved as a later implementation gate, not recast as a pass.

## Normative UI specification

- Desktop: one controls card in logical order—From, inclusive To, primary Apply, secondary analytical Refresh, last-updated text. At narrow phone width, stack each control full-width in that same DOM/focus order; do not horizontally scroll or reorder content differently between RTL and LTR.
- Native date inputs need an associated visible label, at least 44px block size, and the existing strong visible `:focus-visible` treatment. Apply is the sole control that commits draft dates. While applying, disable duplicate Apply submissions, announce progress, preserve prior successful dashboard and independent snapshot, and re-enable controls on terminal success/error.
- Validation: place one live inline message after the range group; apply `aria-invalid=true` and `aria-describedby` to the first relevant field; focus it. Missing/impossible/out-of-range From focuses From; reversed range focuses To. Do not rely on red alone.
- Loading/empty/unavailable/error/success: discovery loading may seed controls but must not disable arbitrary valid dates after load. Empty discovery keeps From/To/Apply usable. Analytical empty/error stays local to analytics. Snapshot loading/error/stale stays local to snapshot. Terminal authorization retains last-good facts as stale, clearly labels recency, and disables retry until secure re-entry. Ordinary bounded failures remain retryable.
- Snapshot facts remain compact: three event scopes, three distinct permit buttons, and aggregate-only equipment. Dates/counts remain live DOM text. Charts need text/legend equivalents and must remain visible under strict CSP.
- Use Arial/sans-serif, named font weights, `#1e6bd6` as the only brand accent, neutral surfaces/text, and semantic status colors only with text/icon cues. Confirm WCAG AA contrast in implementation.

## ImageGen evidence

- Fresh built-in ImageGen mockup: `date-range-revision11-responsive-reference.png`, SHA-256 `30e25fdf46c2fcd86142e1751683beb27bdc2ee2c237671de7b9f2fb67f4c3c3`.
- The image is illustrative evidence only. It demonstrates desktop/phone shared hierarchy, date fields, Apply versus Refresh, visible focus/invalid state, stale retained facts, and restrained brand/status colors. Exact generated microcopy or chart data is not normative; this document and the shared board are normative.

## Verdict

Approve revision 11 through the UI-design lens for `T-301`–`T-304`. No reproducible plan-level UI defect remains. This does not claim implementation, a passing site suite, exact-preview behavior, deployed tenant permissions, release authorization, or controller completion.
