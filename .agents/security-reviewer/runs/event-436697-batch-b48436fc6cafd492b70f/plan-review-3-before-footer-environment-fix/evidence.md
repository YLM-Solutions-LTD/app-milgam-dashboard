# Security evidence — revision 12

## Shared plan and task board

- `.agents/shared/plan.md`: revision 12, SHA-256 `fb9eba8b7be48e6682922cbdae680a488103f39c10d2729a2c41e5bd7aad8366`.
- `.agents/shared/tasks.json`: revision 12, SHA-256 `090aa53ae94bd996e3489492421ee62b8242274001ca33fd2d81eb79954d3e1f`.
- T-301/T-302 preserve strict pre-request date validation, fixed report topology, abort/stale-generation suppression, snapshot isolation, and zero effects for invalid input (`plan.md:38-72`).
- T-303 preserves field-limited safe-integer normalization, reconciliation/no-partial-fabrication constraints, bounded diagnostics, stale-data handling, and terminal 401/403/revocation denial until fresh re-entry (`plan.md:74-91`).
- T-304 requires the actual packaged SDK and intercepted GuestBridge, blocks real tenant traffic, forbids fake readiness, retains strict CSP/no disclosure checks, and keeps release authorization controller-owned (`plan.md:93-109`).

## Reconciled archived fingerprints

- `perf:plan:range-and-count-release-missing-measurable-budgets:v1` remains resolved by the explicit volume, decoded-byte, timing, DOM, concurrency, cancellation, burst, and request-accounting budgets at `plan.md:71-72,90-91,104` and matching task requirements.
- `perf:plan-review:configured-site-suite-fails-missing-xstate:v1` is resolved in the current environment: `plan.md:34` records restored locked xstate 4.38.3 and fresh unchanged configured site results of 61/61. T-304 still requires a complete candidate rerun, so archived evidence is not reused as release evidence.
- `/workspace/.simplyvibe/input/remediation-cycle-3.json` was directly checked and is absent. No current manifest fingerprints can be enumerated or reconstructed. This controller-packaging limitation is not recast as an app defect.

## Open footer provenance defect

- The builder contract restricts `data-release-environment` to `preview` or `production` and says missing/invalid metadata must render unavailable (`references/release-footer.md:7-16`).
- Revision 12 requires copying `release-footer.js` unchanged while also requiring missing/malformed attributes to render unavailable and only trusted valid production stamps to render release facts (`plan.md:111-127`; tasks T-304/T-305).
- The mandated packaged renderer validates version/timestamps but tests only whether environment equals `preview`; every other environment, including missing or `staging`, follows the production branch (`assets/release-footer.js:12-18`).
- Local synthetic reproduction command:

  `node --input-type=module -e "import {releaseFields} from '/home/codex/.codex/skills/simplylog-mini-app-builder/assets/release-footer.js'; const stamp={releaseVersion:'0123456789ab',releaseUpdatedAt:'2026-10-26T10:00:00Z',releaseReleasedAt:'2026-10-26T11:00:00Z'}; console.log(JSON.stringify({absent:releaseFields(stamp,'en','UTC'),malformed:releaseFields({...stamp,releaseEnvironment:'staging'},'en','UTC'),preview:releaseFields({...stamp,releaseEnvironment:'preview'},'en','UTC')}))"`

- Observed: both absent and `staging` environments render version `0123456789ab`, last update `10/26/26, 10:00 AM`, and release date `10/26/26, 11:00 AM`; only `preview` renders an explicit Preview label and Not released.
- Impact: malformed or incompletely stamped publication metadata can be presented as production release provenance, contradicting the truthful-metadata trust boundary. This does not expose credentials or grant authorization, so severity is low.

## Limitations

- Plan review does not prove implementation or exact-preview behavior.
- The denied deployed origin was not accessed. Local synthetic evidence cannot prove deployed tenant permissions or publication metadata.
- Release authorization and controller completion remain unclaimed.

