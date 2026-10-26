# Revision 9 UI design specification

The fresh process-attempt-2 ImageGen board `date-range-revision9-responsive-reference-attempt2.png` is visual evidence only. Generated wording and numbers are non-normative; use the requirements below for implementation and test assertions.

## Shared hierarchy

- Use the SimplyLog baseline: `#1e6bd6` as the only brand accent, Arial with a `sans-serif` fallback, named font weights, neutral surfaces, and semantic color only with an icon and text.
- Keep one information architecture in RTL and LTR: page heading; analytical range controls; applied-range/status summary; analytical content; then an independently bordered current-snapshot section. Mirror directional layout and directional icons, not nondirectional status/chart symbols.
- Desktop (1440×900): place the two labeled date inputs and two actions in one logical wrapping row. Phone (390×844): stack inputs and actions at full available width. Tablet may use two columns. No control or message may require horizontal scrolling.

## T-301 — range controls

- Labels are `מתאריך` and `עד תאריך (כולל)`. Keep them persistently visible; do not rely on placeholder text. Native date inputs and both actions have at least a 44×44 CSS-pixel target.
- Primary action `החלת טווח` follows the two inputs in DOM/tab order; `רענון נתונים` is secondary. A 2px-or-stronger visible focus indicator must have at least 3:1 contrast against adjacent colors.
- Draft values stay in the inputs while the applied-summary strip continues to identify the currently displayed range. Applying enters a busy state that disables duplicate Apply without clearing the displayed content; success atomically updates summary, data, and last-updated metadata.
- Invalid input applies `aria-invalid=true` to the relevant field, associates one concise Hebrew message through `aria-describedby`, announces it in a live region, and focuses the first relevant invalid field. The message must state missing, impossible/out-of-bound, or reversed range without exposing transport details. Correcting the field clears only that field's invalid state.

## T-302 — analytical lifecycle

- Loading preserves the selected/applied range and section geometry; use a textual busy status or skeletons with an accessible name. Empty is a valid, non-error panel tied to the applied range and keeps Refresh available.
- Recoverable failure preserves range context and offers `RETRY`; ready/empty uses `REFRESH`. A later-generation result must not visually replace a newer range. Stale content, when intentionally retained, carries a text badge and timestamp rather than color alone.
- Analytical Apply/Refresh must not alter, dim, announce, or update the independent snapshot section. Snapshot refresh must not rewrite the applied-range summary.

## T-303 — snapshot states

- Render accepted numeric/decimal-string facts as ordinary localized numbers with separate event, valid/missing/overdue permit, and equipment labels; never communicate categories by color only.
- For a report-specific ordinary failure, name the affected report in concise Hebrew, retain unaffected cards, and present one retry action. Never render a response body, arbitrary exception, token, API host, or private marker.
- For 401/403/revocation after good data, retain last-good cards with a visible stale badge and timestamp, show `נדרש חיבור מחדש`, and disable/remove ineffective Retry until fresh verified re-entry. Initial authorization failure shows unavailable context without fabricated zeros.
- Pending snapshot refresh coalesces repeated activation: keep one busy announcement, disable the initiating control while pending, and restore focus/control availability when the terminal state settles.

## T-304 — visual acceptance matrix

- Verify desktop 1440×900 and phone 390×844 in RTL and LTR for loading, success, analytics empty, initial unavailable context, invalid dates, recoverable analytical failure, snapshot partial failure, stale authorization, re-entry success, and navigation rejection.
- At every state: zero horizontal page overflow; meaningful DOM/tab order; visible focus; labels/programmatic names; live announcements without duplication; chart alternatives/legends; no color-only meaning; no page errors; and strict-CSP-visible charts.
- The revision-9 performance ceilings are also UI constraints: at most 600 dashboard descendants, at most 80 snapshot descendants, post-response rendering under 50 ms, and no app-attributable task lasting 50 ms or more at each required viewport/direction.

## Current plan assessment

- Revision 9 is UI-implementable: range labels, validation/focus, draft-versus-applied state, 44px targets and responsive directions are explicit at `plan.md:27-42`; lifecycle/state isolation at `plan.md:44-61`; report-specific and stale snapshot recovery at `plan.md:63-80`; and bidirectional keyboard/focus/announcement/overflow/CSP checks at `plan.md:82-97`.
- Accepted cycle-1 fingerprint `perf:plan:range-and-count-release-missing-measurable-budgets:v1` is concretely resolved in the current revision by `plan.md:60-61,79-80,93` and `tasks.json:35,56-64,86-95,116-123`. This is a current-source verification, not reuse of the earlier approval.
- All four process-attempt-1 missing-manifest fingerprints point to the same absent controller artifact. They expose no UI, interaction, accessibility, responsive, or plan defect in revision 9 and require no UI-plan change; process-attempt-2 controller guidance explicitly prevents using that absence alone as a rejection reason.
