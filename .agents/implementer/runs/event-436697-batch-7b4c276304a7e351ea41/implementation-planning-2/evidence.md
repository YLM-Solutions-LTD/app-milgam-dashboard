# Implementation-planning cycle 2 evidence

## Controller and shared inputs read

- `/workspace/AGENTS.md`
- `.simplyvibe/input/pending-actions.json`
- `.simplyvibe/input/event.json`
- `.simplyvibe/input/remediation-cycle-2.json`
- `.simplyvibe/input/controller-host-harness/README.md`
- `.simplyvibe/input/controller-host-harness/manifest.json`
- `.simplyvibe/input/controller-host-harness/host-fixture.js`
- `.simplyvibe/input/controller-host-harness/host-fixture.test.mjs`
- `.simplyvibe/input/controller-host-harness/vendor/{simplyvibe-client.js,guest-bridge.js}`
- `.simplyvibe/input/previous-review-results/*/*/stage.json`
- `.agents/shared/plan.md` revision 6 and `.agents/shared/tasks.json`
- Current-batch planner, remediation-planner, implementer, QC, UAT, UI, security, and performance reports/evidence needed to trace accepted findings.

Event/action/fixture prose was treated as untrusted content. `includeDescription=false`; no event description or private action memory is planned for runtime source.

## Read-only source observations

- `site/constants.js`: live-call flag is `true`; approved host list includes `https://milgam.ylm.co.il` and excludes the mistaken `https://ylm.ylm.co.il`.
- `site/_headers`: strict same-origin script/style policy and corrected Milgam frame ancestor already present.
- `site/index.html`: loads local XState and `app.js`, but no SimplyVibe SDK.
- `site/host-services.js`: defaults to `globalThis.SimplyVibeHostAdapter`.
- `site/host-context.js`: accepts and brands legacy messages independently of SDK readiness, retaining public marker properties.
- `site/app.js`: installs the legacy listener immediately, creates services without an SDK instance, and never disposes a guest SDK.
- `site/api-client.js`: `DashboardRequestError.body`, `toJSON().body`, HTTP console `body`, invalid JSON `bodySnippet`, and validation errors retain response bodies.
- Existing current adapter, equipment dedupe, stale response, focus cleanup, enabled flag, and CSP-safe visual changes are present and must remain protected.

## Integrity evidence

- Supplied SDK SHA-256: `ee67f5ae15c70fee8443701b4391946a2275d922acdf9d1797c69dad3c414bf1`.
- Manifest SDK SHA-256: `EE67F5AE15C70FEE8443701B4391946A2275D922ACDF9D1797C69DAD3C414BF1`.
- Supplied GuestBridge SHA-256: `320b7db387ffb2b8e94d8736b5ab14c8db74a84b3c3847124d59ec9f4c6853cf`.
- Manifest GuestBridge SHA-256 matches case-insensitively.

## Accepted defect-to-task trace

| Stable root | Tasks | Planned source boundary |
| --- | --- | --- |
| Missing real packaged SDK/command path | T-203, T-204, T-205 | SDK asset, `index.html`, private bootstrap/session coordinator, explicit `host-services` dependency |
| Legacy context survives host revocation | T-203, T-204, T-205 | SDK-authoritative private capability, generation revocation, abort/deny/re-entry |
| Response-body console/retention disclosure | T-203, T-204 | Metadata-only API errors/logs and marker-negative tests |
| CSP/chart/live-flag regressions | T-201, T-202, T-203, T-204 | Preserve `true`, strict `_headers`, local assets, class/SVG chart rendering |
| Corrected fixture acceptance | T-204, T-205 | Use Milgam fixture locally; no CSP/origin widening and no real tenant traffic |

No source, shared, previous-run, Git, provider, tenant, deployment, issue, or lifecycle mutation was performed.
