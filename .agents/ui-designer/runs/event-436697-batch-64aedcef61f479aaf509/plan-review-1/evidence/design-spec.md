# Current snapshot design specification

Reference image: `current-snapshot-rtl-reference.png`

The image is directional design evidence, not literal copy or a deployable asset. Live HTML must own all text, counts, icons, focus, and state semantics. The generated header/navigation is illustrative and must not replace the mini-app's existing authenticated shell.

## Layout and hierarchy

- Place a labelled `section` for **תמונת מצב נוכחית** before the analytical period controls. Keep its heading and refresh/report-date context inside the section so users do not associate snapshot metrics with the selected month.
- Desktop: a 12-column grid; events 5 columns, permits 4, equipment 3. Tablet: events full row, permits/equipment split if content remains unclipped. Narrow phone: one column in DOM order—events, permits, equipment—without visually reversing the order for LTR.
- Use a fluid page width matching the existing shell, 16–24px outer spacing, 16px card padding, 12–16px gaps, and 12px card corners. Avoid fixed card heights; Hebrew and translated labels must wrap without hiding controls.
- Separate the snapshot and analytics with whitespace plus a neutral divider and a labelled analytics heading. Do not remove or reparent existing charts and controls in ways that alter their behavior.

## Visual tokens

- Apply the SimplyLog baseline to new UI: primary `#1e6bd6`; Arial, sans-serif; named weights `normal` and `bold`; white/neutral surfaces and gray text/borders. Existing app accent drift (`#2457d6`) should not be extended into new tokens; token alignment can be handled without changing data behavior.
- Use semantic warning/error color only alongside an icon and explicit text. Never make green, amber, or red the only distinction among permit categories.
- Focus: minimum 3px visible outline with at least 2px separation from the control edge. Preserve it in forced-colors/high-contrast modes by avoiding outline removal.

## Components and copy

- Events card: three labelled groups—`סה״כ`, `מטה`, `סניפים`. Each exposes `סה״כ אירועים` and `אירועים פתוחים`; visual order and accessible name must keep the number paired with its scope and measure.
- Permits card: three native buttons with distinct accessible names, for example `142 אישורים בתוקף — פתיחת לוח האישורים`, `18 אישורים חסרים — פתיחת לוח האישורים`, and `6 אישורים באיחור — פתיחת לוח האישורים`. The optional navigation icon is decorative.
- Equipment card: show the validated total. Below it show `סיווג בתוקף / באיחור: לא זמין` and a brief explanation such as `כללי הסיווג טרם הוגדרו`. Do not use disabled-looking styling that implies the total is unavailable.
- Date labels should distinguish snapshot update time from report dates. All displayed report dates must come from host `ToDisplayDate`; do not show raw strings as fallback values.

## Interaction and states

- Permit activation sets only the selected control to `aria-busy="true"` and temporarily disables repeat activation. Retain its label/count and do not show a full-region spinner. On failure, restore interaction and show a nearby non-destructive `role="status"` or polite live message; keep all metrics visible.
- Initial loading: show the snapshot heading plus three nonnumeric skeleton/card placeholders and concise text `טוען תמונת מצב נוכחית…`. Skeletons are `aria-hidden`; the text carries status.
- Initial error: no numbers, a concise sanitized message, and native retry button inside the snapshot section. Analytics remains visible and operable.
- Refresh with last-good data: keep values, show a persistent text warning `הנתונים לא עודכנו לאחרונה` plus retry. Include timestamp/context so stale meaning is not color-only.
- Validated zero uses the same typography and layout as nonzero values. Unavailable uses words, never `0`, `—` alone, or an empty card.
- Empty is not a valid aggregate snapshot outcome under these strict contracts; a semantically empty/malformed response enters the explicit error treatment rather than an empty-data illustration.
- Success/retry completion and navigation errors use polite, non-atomic announcements. Avoid announcing the whole dashboard after every update.

## Responsive, bidi, and test targets

- Verify at 320/360px phone, 768px tablet, and 1280px+ desktop in both `dir=rtl` and `dir=ltr`. Use logical margin/padding/inset/border properties. Directional navigation arrows may mirror; document/info/status icons do not.
- Keep DOM/focus order events → permits (valid, missing, overdue) → equipment → analytical controls. CSS placement must not produce a conflicting visual/focus sequence.
- Long translated labels, 6+ digit locale-formatted counts, 200% text zoom, reduced motion, and keyboard-only use must not clip or overflow.
- The UI contract suite should assert native permit controls, distinct names, busy-lock recovery, retained last-good values, visible textual unavailable state, snapshot-local status, and unchanged chart/period elements.

## ImageGen provenance

- Generated specifically for this review with the SimplyLog baseline, Hebrew RTL snapshot hierarchy, permit controls, stale warning, navigation error, focus indicator, equipment-unavailable state, and preserved monthly analytics in the prompt.
- SHA-256: `bca8c0a9140564914c43e3674fbf9b4a36f8e41bcca08e4858bcf3be3ae0f05b`
