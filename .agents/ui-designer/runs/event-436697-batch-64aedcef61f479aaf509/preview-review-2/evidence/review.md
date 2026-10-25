# Preview review evidence — cycle 2

Target supplied by the controller: PR head `d9ef28ddc6be1d9b6b9fb2f066bcde19c53c193b`, preview `https://1de11912.app-milgam-dashboard.pages.dev`. The URL returned HTTP 200. No provider/lifecycle API was called, so commit-to-deployment binding is controller-supplied rather than independently attested. Captured deployed asset fingerprints: `index.html` `cd7a191c…`, `app.js` `f4106999…`, `app.css` `6580da3c…`, and `constants.js` `898e9a22…`. The deployed flag was observed as `CURRENT_SNAPSHOT_LIVE_CALLS_ENABLED = true`, consistent with the immutable authorized release-override report.

## Harness and trust boundary

Playwright Chromium headless shell 1187 loaded the preview in an iframe under synthetic approved parent origin `https://milgam.ylm.co.il`. A synthetic, non-tenant bearer string and deterministic route fixtures were used; no real token or tenant API request was made. `SimplyVibeHostAdapter.ToDisplayDate`, `ready`, and `executeCommand` were synthetic browser services. Full telemetry is in `playwright-results.json`.

- Each viewport issued exactly three snapshot `POST`s, to CurrentEvents, CurrentPermits, and CurrentEquipment, each with body `{}`. Monthly requests retained their separate analytical date bodies.
- The rendered raw report dates flowed through the synthetic date adapter unchanged: `מוצג:2026-09-23T08:00:00` and `מוצג:2026-09-23`; no `Z` was appended.
- The three distinct permit buttons exposed distinct accessible names. Activation produced exactly `Navigate` with `{ "Url": "#/Permits/Dashboard" }`.
- Snapshot copy preserved separate valid (`132`), missing (`27`), and overdue (`18`) metrics. Equipment showed total `2` and textual classification `לא זמין`; no inferred validity count appeared.

## Responsive and bidi evidence

- `preview-desktop-rtl.png` at 1440×900: snapshot precedes analytics, cards form a coherent three-column region, focused permit control remains plainly visible, and all six analytical panels remain present.
- `preview-mobile-rtl.png` at 390×844: cards stack in events → permits → equipment order; `scrollWidth` equals `clientWidth` (390), so no horizontal clipping occurred. The same 41 snapshot descendants were used as desktop and remain below the 80-element ceiling.
- `preview-desktop-ltr.png` at 1440×900: runtime `dir=ltr` applied while DOM/focus order and the same information architecture remained intact; `scrollWidth` equals `clientWidth` (1440).
- Captures use the SimplyLog baseline: Arial/sans-serif, white/neutral surfaces, restrained blue accent, clear hierarchy, bordered native buttons, and visibly focused keyboard state. ImageGen comparison reference: `imagegen-reference.png` (`cfa98840…`).

## Task traceability

- `T-101`–`T-102`: exact empty snapshot bodies, coherent validated fixtures, separate permit semantics, raw-date boundary, equipment total and unavailable classification observed.
- `T-103`: current snapshot and analytical panels rendered together as separate regions; snapshot-local refresh remained separate from month controls.
- `T-104`: host-formatted dates, three keyboard-focusable permit controls, and exact unfiltered navigation command observed.
- `T-105`: desktop/mobile RTL plus desktop LTR captures, no horizontal overflow, 41 snapshot descendants, current-before-analytics hierarchy, distinct zero/unavailable semantics, and retained analytics observed.
- `T-106`: deterministic synthetic browser evidence supplements the accepted 49/49 app, 20/20 QC, and 13/13 UAT local results recorded in prior immutable reports.
- `T-107`: the preview flag is enabled for the authorized release; evidence does not claim authenticated live tenant verification, procedure availability, deployment completion, or controller completion.

No reproducible release-blocking UI defect was observed. Loading, initial-error, stale-refresh, and navigation-error semantics remain supported by the accepted implementation/test evidence; this run directly captured the representative ready state and navigation success path.
