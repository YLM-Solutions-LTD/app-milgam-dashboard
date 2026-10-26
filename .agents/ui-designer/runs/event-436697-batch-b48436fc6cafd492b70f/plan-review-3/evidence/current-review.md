# UI design review evidence — revision 12

## Process-attempt-2 reassessment

- Re-read the unchanged revision-12 shared board (`plan.md` SHA-256 `fb9eba8b7be48e6682922cbdae680a488103f39c10d2729a2c41e5bd7aad8366`; `tasks.json` SHA-256 `090aa53ae94bd996e3489492421ee62b8242274001ca33fd2d81eb79954d3e1f`) and applied the UI role to every structure task `T-301`–`T-305`.
- Reconfirmed current-source seams: `site/index.html` ends after state-dependent main content with no release marker/assets; `site/date-range.js` still builds month bounds ending `T23:59:59`; `site/current-snapshot.js` still accepts only numeric safe integers for event/permit aggregates. These are concrete implementation targets, not claims of completed work.
- Inspected the complete applicable inventory: nine `site/tests/*.test.js`, three QC tests (one JS, two MJS), two UAT MJS tests, and one controller harness MJS test; no matching CJS/spec files. The accepted planning report records exact fresh totals 61/61 site, 34/34 QC, 23/23 UAT, and 2/2 harness after dependency repair. Plan review does not substitute those baseline passes for the candidate reruns required by T-304.
- Re-read the repaired packaged footer (`release-footer.js` SHA-256 `bd3aa96202a55cd9533d2d4dca2c2c49e62aafc6035fe81448fe809a0959c08a`). Its exact environment gate returns all three values Unavailable unless the environment is exactly `preview` or `production`. Revision 12 matches this behavior and never treats an unsupported value as production.
- Reconfirmed `/workspace/.simplyvibe/input/remediation-cycle-3.json` is absent. No unknown finding was invented, and this controller-input limitation does not make the otherwise decision-complete UI plan defective.
- The prohibited deployed origin was not accessed. The review remains plan/source/synthetic only.

## Evidence boundary

- Reviewed shared plan revision 12 and task board for `T-301`–`T-305`, frozen action `570021`, `includeDescription=false`.
- Reviewed current source seams at `site/index.html:24-43`, `site/date-range.js:8-24`, and `site/current-snapshot.js:26-73,111-116`. These reproduce the planned month-only range, number-only aggregate, and missing-footer work; they are not treated as implemented.
- Reviewed the builder release-footer reference and packaged HTML/CSS/JS. Current packaged renderer accepts only exact `preview` or `production`; unsupported or missing environments return Unavailable for every field before any timestamp/version presentation (`release-footer.js:8-10`).
- Verified `/workspace/.simplyvibe/input/remediation-cycle-3.json` is absent. No unknown fingerprint was reconstructed. This is controller packaging state, not a UI or structural-plan defect.
- Did not access the prohibited deployed origin. The generated mockup is synthetic design evidence only and contains no release facts or tenant data.

## Task review

### T-301 — approve

Revision 12 lines 38-53 and the task-board acceptance criteria define the full UI contract: two native dates, explicit inclusive To label, Apply and refresh separation, inline announced Hebrew validation, `aria-invalid`, useful focus, 44px targets, and overflow-free RTL/LTR layouts at both required viewports. Draft versus applied behavior is observable and testable. Implementation guidance: group each label/input as one field; keep DOM/focus order From → To → Apply → refresh in both directions and let CSS logical properties mirror presentation; reserve one live validation/status row so errors do not shift controls unpredictably.

### T-302 — approve

Revision 12 lines 55-72 separates the applied analytical range from discovery and the snapshot, defines visible ready/empty/loading/error transitions, and bounds render/DOM work. The plan prevents analytical activity from clearing or altering snapshot facts. Implementation guidance: keep the applied-range summary adjacent to analytical status; show a busy state without replacing the independent snapshot; retain the last successfully applied label while a newer Apply is pending and announce success/failure without moving keyboard focus except on validation failure.

### T-303 — approve

Revision 12 lines 74-91 preserves separate event/permit facts and requires concise report-specific Hebrew guidance, stale last-good facts, disabled retry after terminal authorization, and bounded diagnostics. This is sufficient to prevent ambiguous fabricated-zero or generic-error UI. Implementation guidance: pair stale copy with text/icon, not color alone; keep disabled retry visually and semantically disabled; do not render endpoint/classification diagnostics as the primary recovery instruction.

### T-304 — approve

Revision 12 lines 93-109 requires keyboard/focus/announcement, charts under CSP, zero overflow/page errors, both directions and both viewports, all states, explicit UI performance measurements, and complete test inventory. It requires the actual packaged SDK and fully intercepted controller fixture. Current planner evidence reports the repaired unchanged suites at site 61/61, QC 34/34, UAT 23/23, and harness 2/2; this review does not claim to have rerun them and the implementation candidate must rerun them exactly as planned.

### T-305 — approve

Revision 12 lines 111-127 matches the packaged release-footer contract: exactly one semantic footer after state-dependent main content; normal document flow; all three labels/values; Hebrew/English localization; `bdi`; responsive wrapping; no authentication/network activity; and truthful Unavailable, Preview/Not released, and production states. It explicitly forbids viewer current time, page-open time, event time, data-refresh time, and hand-maintained metadata. Source/browser checks cover host-waiting, loading, no-context, empty, error, stale, and ready states. Implementation guidance: copy the assets unchanged, keep generated markup initially unstamped, preserve at least 1rem inline padding at phone width, and maintain a visible border/background distinction from dashboard refresh copy.

## Fingerprint reconciliation

- `perf:plan:range-and-count-release-missing-measurable-budgets:v1`: resolved in current revision 12 by numeric row/byte, mapping/render, DOM, long-task, request-total, concurrency, cancellation, and burst ceilings at lines 71-72, 89-91, and 95-105.
- `perf:plan-review:configured-site-suite-fails-missing-xstate:v1`: resolved by current repaired-environment evidence reporting the unchanged configured site suite at 61/61 including `dashboard-machine.test.js`; T-304 still requires candidate rerun.
- `simplyvibe:release-footer:invalid-environment-treated-as-production:v1`: resolved in the actual current packaged renderer: exact environment gating at `release-footer.js:8-10` returns all-Unavailable for missing/unsupported values, matching T-305.
- Earlier cycle-2 role-specific missing-manifest fingerprints describe the same absent controller-owned artifact and do not identify a revision-12 UI defect. The absent cycle-3 manifest supplies no new fingerprint set; none is invented.

## ImageGen reference

- File: `evidence/revision-12-responsive-footer-reference.png`
- SHA-256: `c6a6449eada04e6870fc736c1e8475ec3a9e7d8199d684a9205b2e574ee7b4b4`
- Built-in ImageGen mode; 1536×1024 PNG; use case `ui-mockup`.
- The screen demonstrates desktop/mobile RTL hierarchy, a visible focus ring, 44px-style controls, footer separation, and mobile wrapping. Generated copy/data and pixel geometry are illustrative. The written requirements above are normative, especially exact app labels, actual dashboard content, semantic markup, WCAG contrast, and Unavailable metadata.

### Fresh process-attempt-2 reference

- File: `evidence/revision-12-responsive-footer-reference-attempt-2.png`
- SHA-256: `1e733a48e3d16759f28e89e758d48918ba53709a98c0d02cc7e8dd5bd35a369a`
- Built-in ImageGen mode; use case `ui-mockup`.
- It illustrates the required desktop/mobile RTL hierarchy, From/To/Apply controls, focus ring, independent snapshot state, and one wrapped in-flow Preview/Not-released footer. Generated labels, chart facts, dates, and layout details are non-normative; revision 12 and the packaged semantic footer remain authoritative.

## Verdict

`approve` through the UI-design lens for all `T-301`–`T-305` in process attempt 2. No stable UI finding. This is plan-only approval; implementation, exact-preview behavior, live tenant state, release authorization, and controller completion remain unclaimed.
