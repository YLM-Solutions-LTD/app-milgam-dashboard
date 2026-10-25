# UI evidence — exact preview cycle 3

## Candidate and method

- Controller-supplied exact PR head: `c9686ba1ad6d4f7b0896ba32c29ad38dcf607022`.
- Preview: `https://5ab11833.app-milgam-dashboard.pages.dev`.
- Chromium 140, actual packaged SimplyVibeClient (`ee67f5ae…14bf1`, identical to the controller vendor file) and actual GuestBridge.
- Host fixture served only at intercepted `https://milgam.ylm.co.il/controller-host-fixture/`; every API response was synthetic, no tenant token was inspected, and no unexpected request was observed.

## Task evidence

- `T-201`: the enabled preview issued exactly the three Current* calls on initial verified connection, each as `POST {}`. `site/constants.js:21` remains `true`. Current facts remained independent of the analytical reports.
- `T-202`: at 1440×900 RTL, 390×844 RTL, and 1440×900 LTR the charts remained visible (`chartCount: 3` in the targeted selector), rendered with zero inline style attributes and zero horizontal overflow. The preview returned enforcing `style-src 'self'`; executable URLs were limited to the intercepted fixture and same-origin preview assets.
- `T-203`: ready UI exposed reconciled 128/14 = 50/6 + 78/8 event facts, separate permit accessible names, 10,000 equipment total, and explicit classification-unavailable copy. Focus was a visible 3px outline. Source evidence: `site/app.js:76-115,152-162,274-299`, `site/current-snapshot.js:76-108`, `site/host-bootstrap.js:28-104`.
- `T-204`: exact-preview screenshots cover all required viewport/direction combinations plus stale and recovered states. Snapshot region remained 41 descendants and never overflowed. No page error was observed in desktop, mobile, LTR, or double-reentry race runs.
- `T-205`: real fixture lifecycle evidence shows stale last-good UI, terminal denial of the unchanged session, automatic fresh-generation recovery, exact Navigate, and zero old command effect in the revoke/re-enter race.

## Cycle-3 fingerprint closure

1. `simplyvibe-auth-lifecycle-401-refresh-reuses-rejected-generation-v1` and `uat-authorization-expiry-old-generation-refresh-allowed-v1`: after generation-1 HTTP 401, a repeated refresh emitted **0** API calls. Source denial is at `site/host-bootstrap.js:28-43,77-85`.
2. `perf-preview-fresh-reentry-does-not-restart-snapshot-generation-v1`: fixture re-entry emitted 3 current calls and 5 supported analytical calls using generation 2, automatically restored ready content, and showed the updated status. Source restart/preservation is at `site/app.js:76-101`.
3. `uat-snapshot-refresh-failure-last-good-cleared-v1`: after both 500 and 401, the full prior snapshot text remained unchanged and status read `הנתונים המוצגים הם העדכון התקין האחרון. הרענון נכשל. נסו שוב`. Source retention is at `site/current-snapshot.js:76-108`.
4. `uat-permit-command-singleflight-race-v1`: while the first bridge command was held, 20 activations left all permit controls disabled and `aria-busy=true`; release produced exactly one generation-2 `Navigate` to `#/Permits/Dashboard`. Source guard is at `site/app.js:274-299`.
5. `qc-sdk-reentry-client-disposed-unhandled-v1`: with a command held, revoke/release plus immediate and microtask re-entry reached generation 3, made exactly one new current triplet, restored the snapshot, produced no old Navigate effect, and recorded 0 page errors/unhandled-disposal messages. Source handled transition is at `site/host-bootstrap.js:45-69`.
6. Legacy context/diagnostics requirement: production boot used the same-origin SDK and real bridge. The distinctive synthetic body markers `PRIVATE-BODY-MARKER` and `internal address hidden` were absent from captured console output; source binds private SDK instances at `site/host-context.js:78-105` and emits bounded response metadata at `site/api-client.js:100-131,152-163`.

## Visual reference comparison

Fresh ImageGen evidence `imagegen-stale-reference.png` establishes the desired principle: preserved facts, a calm but unmistakable stale notice, and a focused retry action. The exact preview uses a more compact in-section status rather than a banner, but preserves the same information hierarchy and accessible recovery affordance. This is a non-blocking implementation difference, not a defect.

## Artifacts

- `playwright-results.json`: browser calls, states, accessibility/UI metrics, headers, errors, and race evidence.
- `preview-desktop-rtl.png`, `preview-mobile-rtl.png`, `preview-desktop-ltr.png`.
- `preview-stale-500-rtl.png`, `preview-reentry-recovered-rtl.png`.
- `imagegen-stale-reference.png` (SHA-256 `bfc53fb77af5bff61ff60ba90e57eaac49c73bd3777019dbc9736e11c331df4a`).

Real tenant permissions and controller publication/release status were not contacted or inferred.
