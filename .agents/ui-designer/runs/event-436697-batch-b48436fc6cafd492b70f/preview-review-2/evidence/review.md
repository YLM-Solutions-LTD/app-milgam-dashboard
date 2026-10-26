# UI preview-review cycle 2 evidence

## Candidate and method

- Exact preview: `https://f9d0c736.app-milgam-dashboard.pages.dev`; visible trusted footer version `2f47f48ed056` matches requested head prefix `2f47f48ed056df72c5d8b861778dad5cc4069703`.
- Chromium `140.0.7339.16`; actual preview-packaged SimplyVibeClient through the controller GuestBridge at fully intercepted `https://milgam.ylm.co.il/controller-host-fixture/`. API routes were synthetic; unexpected origins were aborted; no tenant token or lifecycle API was used.
- Machine-readable current-cycle results: `playwright-results.json` for state/viewport evidence and `observations.json` for the three remediation fingerprints.

## Task and remediation evidence

- `T-301`: labeled From/To/Apply controls are 44px, keyboard focused with a 3px visible outline, and overflow-free in desktop RTL, phone RTL, desktop LTR, and supplemental 320px RTL. Draft editing caused zero API calls; cross-year Apply caused exactly four analytical calls with identical `2025-12-31T00:00:00` / `2026-01-02T23:59:59.997` bounds. Reversed input focused and marked the To control invalid while retaining prior facts.
- `T-302`: `perf-preview-analytical-1000-row-unbounded-dom-long-tasks-v1` is resolved in fresh exact-preview evidence. Valid 1,000-row division/category/closure fixtures produced 297 dashboard descendants at 1440x900 RTL and 390x844 LTR, no recorded long task, and localized range text `11–20 מתוך 1,000`. Paging made zero API calls; stable ten-item windows replace the former unbounded wall.
- `T-303`: `uat-snapshot-terminal-401-retry-enabled-v1` is resolved. After last-good data, a synthetic current-report 401 retained stale facts, disabled `#snapshot-refresh`, rendered zero retry controls, announced re-entry-only guidance, and ten further activations caused zero API calls.
- `T-304`: ready UI had no page errors or unexpected origins. Executables were limited to the intercepted controller fixture and exact-preview same-origin assets. Current inventory is 12 site JS, five QC (one JS/four MJS), four UAT MJS, and one harness MJS; no CJS/spec files. Exact configured commands passed: site 72/72, QC 49/49, UAT 33/33, harness 2/2. The first inventory command was accidentally run from `site/`, so repository-relative `site`/`tests` paths reported missing; the configured site suite still passed and a corrected repository-root inventory immediately listed all 22 files before the remaining suites.
- `T-305`: `qc-footer-320-rtl-edge-clipping-v1` is resolved. At requested 320x844 (304px content viewport in this shell), footer bounds were left 16/right 288, width 272, while document scroll width equaled inner width 304. Exactly one visible footer remained after `main` in ready, loading, error, terminal stale, and direct no-context states. It displays Version, Last update, Release date with `2f47f48ed056 (Preview)` / localized equivalent and `Not released`; no timestamp was invented and no footer request occurred.

## UI baseline and ImageGen comparison

- RTL/LTR retain the same information architecture; mobile stacks without horizontal overflow. Focus is visible, normal text remains high-contrast, semantic status includes text, and the release footer stays visually distinct from dashboard refresh time.
- Fresh non-normative ImageGen reference: `imagegen-remediation-reference.png`, SHA-256 `879d0abc90958009126767e3d4b8ccc384f312ee1a541261b8695f6f89171086`. Built-in mode, `ui-mockup`; its generated values are illustrative only. Observable preview evidence, not generated pixels, controls the verdict.

## Limitations

- Synthetic permissions and API fixtures do not prove deployed-tenant permissions or live server contracts.
- This role does not authorize release, deployment, merge, or controller completion. Production remains unreleased.
