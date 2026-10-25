# UI preview-review cycle 3 evidence

## Target and method

- Controller-supplied exact preview: `https://c9756759.app-milgam-dashboard.pages.dev`
- Controller-supplied PR head: `50972d0b555115d3b1c9da90f7df0dc4790c6e8e` (binding not independently verified; no provider API was called).
- Chromium 140 with an allowed-origin synthetic `https://milgam.ylm.co.il` parent, synthetic bearer value, and intercepted `https://api.ylm.co.il/**` fixture responses. No real tenant token or live API was requested.
- Viewports: 1440×900 RTL, 390×844 RTL, and 1440×900 LTR.

## Task trace

- `T-101`: Synthetic parent context was accepted; analytical data loaded in RTL and LTR. Desktop and phone had `scrollWidth === clientWidth`, so no horizontal overflow was observed.
- `T-102`, `T-103`, `T-104`, `T-105`, `T-106`: The exact preview rendered only `תמונת המצב הנוכחית אינה מופעלת בסביבה זו.`. It made zero current-event, current-permit, or current-equipment requests and rendered zero permit controls. Event scope values, distinct permit semantics/navigation/focus, raw snapshot dates, total equipment, unavailable classification, snapshot-local failure/retry, and stale-generation behavior therefore had no exact-preview UI evidence.
- `T-107`: The snapshot is visually independent and precedes analytics, but it is disabled. The enabled-state responsive/focus/navigation contract cannot be accepted from this target.
- Across all four browser scenarios the enforcing `style-src 'self'` CSP rejected nine runtime inline styles per render. The desktop capture visibly shows an empty division donut despite its total and legend being present; other data-driven width/color styles are also rejected. This regresses the preserved analytical visualization contract.
- The cycle-2 rejected navigation focus path could not be re-exercised because the exact preview exposes no permit controls.

## Visual comparison

- `preview-desktop-rtl.png`, `preview-mobile-rtl.png`, and `preview-desktop-ltr.png` are exact-preview captures.
- `imagegen-reference.png` is fresh ImageGen evidence for the approved enabled-state hierarchy and CSP-compatible complete charts; it is design evidence only, not deployable code.
- Screenshot SHA-256 values:
  - desktop RTL: `3ef146cb6d7e381adba07e36b9e3c33481eb8a3c1842a29b524fb1bb01752fff`
  - mobile RTL: `906e190e900c1cdfe82c517be363003f273c821dec9b24899e5cec835c81e072`
  - desktop LTR: `7ab07407864220ebcf2f7f35aa231338684180d5a4771fa5255263184cf5240f`
  - ImageGen reference: `47b16b35c4fd9d609d476f89125080dc108aafbacb1f890d36ace85822145c12`

## Baseline observations

- The preview uses Arial first and retains the pale neutral surface/white-card hierarchy.
- RTL/LTR direction switched correctly and no horizontal overflow was observed.
- The current-snapshot disabled state is readable, but the refresh button remains present even though the feature is unavailable, adding a misleading affordance.
- Header evidence confirms same-origin scripts and an enforcing CSP, while the policy conflicts with the app's generated inline chart styles.

