# Recovered release UI specification

This specification is canonical; the ImageGen mockup is compositional evidence, not deployable artwork or a source of literal copy.

## Task coverage

- `T-201`: the enabled current snapshot appears as a first-class section independent from analytical date controls. A rejected or unavailable host must show an honest unavailable state, never numeric zeroes.
- `T-202`: preserve the existing analytical hierarchy while replacing CSP-blocked visual styling. Donut segments, legend swatches, stacked segments, and bars remain visible; exact values remain readable in text and accessible names even when visual magnitude is quantized.
- `T-203`: preserve explicit snapshot loading, valid zero, empty, initial error, retry, stale last-good, refreshed success, authorization unavailable, and permit-navigation failure states. Preserve analytical loading/error independently.
- `T-204`: verify the same information architecture at 390×844 and 1440×900 in RTL and LTR, including chart visibility, keyboard order, focus visibility, announcements, and no horizontal overflow.
- `T-205`: authorization loss retains last-good snapshot values with a textual stale/unavailable cue, denies new controls, and does not visually imply recovery until a fresh verified generation succeeds.

## Layout and tokens

- Use Arial with generic `sans-serif`; use named `normal` and `bold` weights only.
- Use `#1e6bd6` as the only brand accent. White, black, and neutral gray establish hierarchy. Semantic green/amber/red is permitted only with accompanying text or iconography.
- Desktop: page padding 24 px; 24 px between the snapshot and analytical regions; 16 px between cards; 12–16 px card padding. Keep snapshot before analytics in DOM order.
- Tablet: allow event, permit, and equipment groups to wrap into two columns without changing DOM order.
- Phone: one-column section stack; controls and date fields wrap; minimum 44×44 px interactive targets; no horizontally scrolling chart or clipped label.
- Mirror directional placement and directional icons under runtime `dir`; keep data/chart meaning and nondirectional status icons unchanged. DOM and keyboard focus order remain logical in both directions.

## Components and interaction

- Snapshot header: title, last-updated or stale text, polite live status region, and retry/refresh control. Analytical dates remain visually and behaviorally separate.
- Events: three semantic groups for overall, headquarters, and branches, each exposing total and open. Example evidence uses overall 128/14, headquarters 50/6, branches 78/8 so both total and open reconcile.
- Certificates: three separate native controls—valid, missing, overdue—with distinct accessible names. Every control navigates to the exact permit board contract; never fuse missing and overdue into “invalid.” Disable the activation set while a command is pending and announce success/failure.
- Equipment: show only total plus the explicit text “classification unavailable” (localized in the host language). Do not show invented valid/overdue zeroes.
- Focus: a 2 px `#1e6bd6` outline with at least 2 px offset remains visible against every card/status background. Restored focus targets must still be connected and focusable.

## CSP-safe charts

- Build visuals from finite reviewed classes or policy-compatible SVG presentation; do not use runtime inline style attributes/properties.
- The donut must retain visible segments plus a textual legend. Stacks and bars must retain visible magnitude plus exact adjacent/accessible numeric values. Swatches use predefined local classes.
- Cover zero, single-category, mixed, and maximum fixtures. For zero, use a neutral empty ring/track and explicit zero copy rather than a blank chart. Quantization must never alter textual values.
- Loading placeholders must reserve approximate chart height to prevent layout jump; chart failure presents concise text and retry without suppressing a ready snapshot.

## State matrix

- Loading: skeleton/text status, no fabricated counts; refresh control disabled only while its generation is active.
- Valid zero/empty: explicit localized zero/empty copy, visually different from loading and failure.
- Initial error or unavailable host: no numeric placeholders; concise reason category and allowed retry/re-entry guidance.
- Refresh error or authorization loss after success: retain last-good values, add icon plus textual stale cue and timestamp, deny invalid actions, and keep analytics independent.
- Success: remove stale/error cue, announce completion politely, keep timestamp produced through the host date adapter.
- Validation/malformed response: error state, never partial/fabricated counts.
- Permit navigation error: keep the originating control available after single-flight settlement, show a concise non-color-only error, and restore focus safely.

## ImageGen evidence

- Selected reference: `enabled-snapshot-csp-charts-responsive-reference-v2.png`
- SHA-256: `b06f9d0509670962b9095ca3245a5287f6598c6d255695425cbb6552aee185d8`
- The corrected reference intentionally reconciles current-event examples and shows an enabled snapshot, separate certificate controls, unavailable equipment classification, visible focus, stale treatment, responsive RTL/LTR composition, and visible analytical charts.
- The earlier unselected draft is retained for auditability but must not be used because its illustrative event counts did not reconcile.
