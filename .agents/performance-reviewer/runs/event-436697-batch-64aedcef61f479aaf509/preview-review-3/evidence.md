# Preview-review cycle 3 performance evidence

- Exact controller preview: `https://c9756759.app-milgam-dashboard.pages.dev/`
- Controller-supplied head: `50972d0b555115d3b1c9da90f7df0dc4790c6e8e`
- Measured: 2026-10-25T09:44:55.871Z
- Runtime: Chromium 140.0.7339.16, Node v20.20.2
- Synthetic trusted-parent origin: `https://simplylog.ylm.co.il`; API routes intercepted with fixtures; no real tenant token or request was used.

## Observations

At both 390x844 and 1440x900, authenticated bootstrap succeeds but the deployed snapshot feature is explicitly disabled. The Hebrew status is `תמונת המצב הנוכחית אינה מופעלת בסביבה זו.`, the snapshot refresh control is disabled, no equipment total is rendered, and none of the three current-report endpoints is requested. The served `constants.js` sets `CURRENT_SNAPSHOT_LIVE_CALLS_ENABLED = false`, matching the local supplied source.

The disabled shell itself is light: 7 snapshot descendants, 48 total document elements, no horizontal overflow, no console errors, and no >=50 ms long task at either viewport. Initial shell observation took 214 ms at 390x844 and 298 ms at 1440x900. All observed scripts and styles were same-origin and the preview supplied an enforcing self-only executable CSP.

Because the workflow is disabled, the review could not measure the required current-head budgets: exactly three concurrent `{}` calls, representative decoded bytes, 10,000-equipment mapping/render behavior, <=80 snapshot elements, refresh burst locking, or permit-navigation burst locking. Cycle-2 results belong to a different head and cannot substitute for exact-head evidence.

Raw evidence and repeatable harness:

- `browser-measurements.json`
- `measure-preview.cjs`

## Source support

- `site/constants.js` defaults `CURRENT_SNAPSHOT_LIVE_CALLS_ENABLED` to false.
- `site/app.js` only constructs and refreshes the snapshot controller when that flag is true; otherwise it renders the disabled state.
- `site/current-snapshot.js` retains the intended three-way `Promise.all` and map-based equipment deduplication, but those paths are not executed in this preview.
