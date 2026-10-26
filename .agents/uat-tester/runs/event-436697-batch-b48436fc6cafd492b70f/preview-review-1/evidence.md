# UAT evidence — preview review cycle 1

## Identity and inventory

- Exact preview: `https://8248a782.app-milgam-dashboard.pages.dev`; exact head: `1c5ebdae74cb6a1fae0f818b9f44997e43b8245c`; Chromium `140.0.7339.16`; Node `v20.20.2`.
- Actual deployed `assets/simplyvibe-client.js` initialized through the controller-owned unmodified GuestBridge at fully intercepted `https://milgam.ylm.co.il/controller-host-fixture/`. No fake adapter/readiness promise, tenant token, real tenant request, provider write, or prohibited-origin access occurred.
- Inventory: 11 site `*.test.js`; QC one JS plus three MJS; UAT three MJS; harness one MJS; no applicable CJS/spec files.

## Exact commands and results

- `(cd site && npm test)` → exit 0, 67/67 pass, 0 fail/skip/cancel/todo. Output: `evidence/site-tests.tap`.
- `node --test tests/qc/*.test.js tests/qc/*.test.mjs` → exit 0, 43/43 pass. Output: `evidence/qc-tests.tap`.
- `node --test tests/uat/*.test.mjs` → exit 0, 29/29 pass. Output: `evidence/uat-tests.tap`.
- `(cd /workspace/.simplyvibe/input/controller-host-harness && node --test host-fixture.test.mjs)` → exit 0, 2/2 pass. Output: `evidence/harness-tests.tap`.
- `node run-preview.mjs > evidence/browser-run.log 2>&1` → exit 0. Structured observations: `evidence/observations.json`; screenshots: `desktop-rtl.png`, `desktop-ltr.png`, `phone-rtl.png`, `phone-ltr.png`.
- The first browser command failed before launch because the role-local Playwright package was absent; exact error is preserved in the earlier overwritten run log only indirectly through tool output. Installed `playwright-core@1.55.0` under role-owned `tmp/`, corrected the role-owned import, and reran successfully. No passing claim relies on the failed invocation.

## Browser observations

- All 1440×900 and 390×844 RTL/LTR runs: draft calls 0; accepted Apply analytical calls 4; snapshot calls 0; four identical inclusive bodies ending `.997`, with no `Z`; no overflow (`scrollWidth===clientWidth`); no page errors.
- Decimal strings rendered as 12/5 events and 7/2/1 permits with 10,000 equipment rows. Snapshot DOM had 41 descendants; dashboard had 87.
- Reversed range: zero calls; Hebrew alert; focus and `aria-invalid=true` on `#to-date`.
- Navigate revocation: generation 1 effects empty; fresh generation 2 recorded exactly one supported Navigate and parent hash `#/Permits/Dashboard`.
- Footer: exactly one visible marker in ready and direct no-context states; desktop/phone RTL localized Hebrew and LTR localized English; version `1c5ebdae74cb (Preview)`; release `Not released`/`טרם פורסם`; no API request on direct no-context.
- HTTP 401 reproduction: stale facts retained, private marker absent, old-generation retry issued zero API calls, but `#snapshot-refresh` remained enabled and `[data-snapshot-retry]` existed with status `הנתונים המוצגים הם העדכון התקין האחרון. הרענון נכשל. נסו שוב`. This contradicts the terminal-denial UX requiring retry disabled until fresh re-entry.

## Limitations

- Fixture permissions are synthetic and do not prove real tenant permission configuration.
- Performance-role-specific warmed mapping/render and long-task budgets are not claimed by this UAT report.
- Footer loading/empty/error/stale variants are supported by the passing deterministic tests; exact-preview ready/no-context and terminal-stale states were browser-observed.
