# Current snapshot UI specification — plan review 2

Image evidence: `current-snapshot-responsive-reference.png` (SHA-256 `8146dcab269dd9a6f3d05efd5f632425aa1d5254432bc8c63edbbd12e8171ed8`). The generated copy and values are illustrative; this specification and validated runtime data are canonical.

## Structure and tokens

- Use the existing dashboard header. Insert a separately labelled `section` for **תמונת מצב נוכחית** before analytical year/month controls. Add concise text that these metrics are current and not affected by the selected month.
- DOM and keyboard order remains events → permits → equipment → analytical controls in both `dir=rtl` and `dir=ltr`. Mirror layout with logical properties; never reverse DOM order.
- Use Arial, sans-serif; `normal` and `bold`; 16 px body target; 8 px spacing rhythm; 16–24 px card padding; 8–12 px radii; neutral borders; primary `#1e6bd6`. Status color always has an icon and text. Focus ring: 3 px `#1e6bd6` plus a light offset that remains visible against white and status surfaces.
- Numbers use locale-aware formatting. Raw `AsOf`/`ValueDate` goes unchanged to host `ToDisplayDate`; visual date text never implies a manually interpreted timezone.

## Components

- Events card: three scope groups labelled **כללי**, **מטה**, **סניפים**. Each exposes **סה״כ** and **פתוחים** as paired descriptions, not actions. Do not imply month filtering.
- Permits card: three native buttons labelled with metric and destination, e.g. **בתוקף — פתיחת לוח אישורים**, **חסרים — פתיחת לוח אישורים**, **באיחור — פתיחת לוח אישורים**. Keep Missing and Overdue separate. During navigation, only the activated control receives `aria-busy=true`; all three are protected by the shared pending lock. Do not remove focus.
- Equipment card: show **סה״כ ציוד** and textual **סיווג בתוקף / באיחור: לא זמין** with an information icon. Never display plausible classification numbers or one node per equipment fact.
- Context/status: show a visible refreshed/report date and one polite, non-atomic status region. Navigation errors may use a separate polite message adjacent to the permit card so loaded values stay intact.

## Responsive behavior

- Narrow phone (~390 px): cards stack events → permits → equipment; permit controls may use a three-column row only if every control retains a 44 px target and readable label, otherwise stack. No horizontal scrolling. Analytics follows below.
- Tablet: events can span the row; permits and equipment share or stack according to content width. Preserve at least 16 px gutters.
- Desktop (~1440 px): use a fluid grid with events visually prominent and permits/equipment balanced; snapshot remains clearly bounded above analytics. Do not use fixed card heights that clip translated copy or 200% zoom.
- Test long labels, 200% zoom, RTL and LTR, 390×844 and 1440×900. The complete ready snapshot remains at most 80 DOM elements and has constant node count for 1 versus 10,000 equipment facts.

## State matrix

| State | Required presentation |
|---|---|
| Loading | Heading and explanatory text remain; use textual **טוען תמונת מצב…** and optional neutral skeletons with no numeric zero. Analytics remains present. |
| Valid zero / empty population | Render `0` only after adapter validation, with the normal metric label. A required report with absent rows is validation failure, not an empty success. |
| Ready / success | Show all coherent values together, report/refreshed context, and no intrusive success toast. |
| Equipment unavailable | Keep total visible; show the canonical textual unavailable classification, never disabled-looking fake metrics. |
| Initial validation/permission/network error | Replace only the snapshot body with sanitized **לא ניתן לטעון את תמונת המצב** and native **ניסיון חוזר** button. Show no counts. |
| Refresh error / stale | Retain the complete last-good values; add icon + **הנתונים עשויים להיות לא עדכניים** and retry. Do not mix partial new values. |
| Permit navigation pending | Keep metrics visible, announce progress, lock duplicate activation, and preserve focus on the activated button. |
| Permit navigation error | Keep snapshot intact; announce sanitized **לא ניתן לפתוח את לוח האישורים. נסו שוב.** and unlock controls. |
| Unavailable host context | Render no snapshot numbers and no privileged actions; present the same sanitized unavailable treatment without suggesting authentication succeeded. |

## Task traceability

- `T-101`–`T-102`: typed failures and strict adapters map to zero/error/unavailable distinctions and canonical labels.
- `T-103`: independent status region, retry, stale retention, and analytics continuity visualize the separate lifecycle.
- `T-104`: distinct native permit controls, busy lock, exact shared destination, host-formatted date context, and recoverable navigation error.
- `T-105`: full component, responsive, bidi, focus, contrast, and state contract above.
- `T-106`: assert DOM/focus order, native semantics, 44 px targets, visible focus, 200% zoom, long-copy reflow, state matrix, no clipping, constant equipment-node count, ≤80 snapshot elements, and both render-budget viewports.
- `T-107`: UI must not claim live procedure or deployment verification; evidence distinguishes designed states from authenticated preview results.
