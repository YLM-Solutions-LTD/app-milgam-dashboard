# UAT approach — test authoring cycle 3

- Scope: `T-101` through `T-107`; handled action IDs exactly `[536946,536949,537034,537037,537040]`.
- Method: Node browser-module tests with synthetic `postMessage` parent/context, synthetic bearer strings, in-memory `fetch` responses, and fake host adapters. No network, tenant token, preview, production write, Git, provider, deploy, or lifecycle API is used.
- Changed coverage: retain stable `UAT-001`–`UAT-012`; revise UAT-006 for revocation, late-result denial, and fresh capability generations; revise UAT-009 for stable pre-await focus reference; revise UAT-012 for flag-false delivery, local pinned XState, and CSP source contract.
- Oracle: observable request count/path/body, mapped domain output, typed failure, immutable capability state, command/date arguments, controller state, source security contract, and deterministic performance ceiling.
- Verdict rule: approve test-authoring only when all UAT and app regression assertions pass. Synthetic context is not proof of an approved real-host lifecycle or exact-preview response headers/runtime requests.

## Exact commands

```sh
node --test tests/uat/*.test.mjs > .agents/uat-tester/runs/event-436697-batch-64aedcef61f479aaf509/test-authoring-3/evidence/uat.tap 2>&1
node --test site/tests/*.test.js > .agents/uat-tester/runs/event-436697-batch-64aedcef61f479aaf509/test-authoring-3/evidence/site.tap 2>&1
node --version
sha256sum tests/uat/current-snapshot.uat.test.mjs site/assets/xstate-4.38.3.js site/_headers
```
