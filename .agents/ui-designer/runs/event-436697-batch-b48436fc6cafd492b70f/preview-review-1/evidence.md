# UI preview-review evidence

## Candidate and method

- Reviewed exact preview `https://8248a782.app-milgam-dashboard.pages.dev`; stamped version `1c5ebdae74cb` equals the requested head prefix.
- Chromium `140.0.7339.16`; controller fixture at fully intercepted `https://milgam.ylm.co.il/controller-host-fixture/`; actual preview-packaged `assets/simplyvibe-client.js`; no fake guest adapter/readiness and no real tenant token or traffic.
- Browser output: `evidence/playwright-results.json`; screenshots cover desktop RTL/LTR, mobile RTL ready/loading/error/no-context. No page errors and no aborted unexpected traffic were observed in the ready viewport runs.

## Task evidence

- `T-301`: two labeled native dates and Apply render with 44px controls. Desktop and mobile show a 3px visible focus outline and zero horizontal overflow. Draft edits produced zero requests. Apply produced exactly four analytical POSTs and zero snapshot calls, all with identical `FromDate=2025-12-31T00:00:00` and `ToDate=2026-01-01T23:59:59.997`. A reversed range retained data, announced Hebrew guidance, marked/focused `#to-date`, and produced no further requests.
- `T-302`: ready analytics and independent snapshot coexist; applying a cross-year range did not replace snapshot facts. Desktop/mobile rendered 92 analytical descendants with no viewport overflow. UI state hierarchy remains understandable during loading and failure.
- `T-303`: legitimate decimal-string aggregate fixtures rendered numeric event and permit facts without fabricated values. A synthetic current-events 500 displayed fixed Hebrew recovery copy and did not disclose `MUST_NOT_RENDER`; snapshot and analytics stayed visually separated.
- `T-304`: 1440x900 RTL, 390x844 RTL, and 1440x900 LTR all had `scrollWidth===clientWidth`; 44px minimum range targets and visible focus were observed. Executable requests were limited to the fully intercepted controller fixture and exact preview same-origin modules. Complete inventory: 11 site JS tests, QC 1 JS + 3 MJS, UAT 3 MJS, harness 1 MJS; no matching CJS/spec files.
- `T-305`: exactly one visible semantic footer follows `main` in normal flow in ready, loading, synthetic snapshot-error, and direct no-context states. At both widths it has zero overflow. Preview metadata is `data-release-environment=preview`, version `1c5ebdae74cb`, updated stamp `2026-10-26T17:18:44.000Z`, empty release time; UI says Preview/Not released (localized Hebrew or English). It remains visually distinct from the data-refresh timestamp.

## Test commands and outcomes

- `(cd site && npm test)` -> exit 0; 67/67 pass.
- `node --test tests/qc/*.test.js tests/qc/*.test.mjs` in the initial concurrent diagnostic -> exit 1; 42/43 pass. The preserved failure was a 10,000-row timing sample (`206.135, 98.236, 40.555, 71.553, 27.502 ms`) under simultaneous suite contention.
- `node --test tests/uat/*.test.mjs` in the same concurrent diagnostic -> exit 1; 28/29 pass. The preserved failure measured `100.028 ms` against `<100 ms`.
- Sequential full rerun `node --test tests/qc/*.test.js tests/qc/*.test.mjs` -> exit 0; 43/43 pass.
- Sequential full rerun `node --test tests/uat/*.test.mjs` -> exit 0; 29/29 pass.
- `(cd /workspace/.simplyvibe/input/controller-host-harness && node --test host-fixture.test.mjs)` -> exit 0; 2/2 pass.

No inventory was omitted. The concurrent timing failures are retained in `qc-tests.tap` and `uat-tests.tap`; passing sequential reruns are retained separately and show that the configured complete inventories pass without competing load.

## ImageGen comparison

- `evidence/imagegen-responsive-reference.png`, SHA-256 `eb22e82b568e4ee991b20eba42d2d2b0afd88c61551b5029c10f6f003034e23e`.
- Built-in ImageGen mode, `ui-mockup`. It illustrates the reviewed desktop/mobile hierarchy, focus, range controls, and in-flow preview footer. Generated dashboard content is non-normative and not tenant evidence.

## Limitations

- Synthetic fixture permissions do not prove deployed-tenant permissions or server contracts.
- This UI role did not execute the plan's full high-volume browser performance matrix or every lifecycle race; other configured review roles own independent evidence.
- Production remains unreleased; preview timestamps are controller-stamped metadata, not tenant data or proof of production publication.

