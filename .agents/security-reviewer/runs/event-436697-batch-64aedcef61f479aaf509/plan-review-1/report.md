# Security plan review

## Result

- Verdict: changes requested
- Batch: `event-436697-batch-64aedcef61f479aaf509`
- Plan revision: 1
- Reviewed tasks: `T-101`, `T-102`, `T-103`, `T-104`, `T-105`, `T-106`, `T-107`
- Handled action IDs, exact order: `536946`, `536949`, `537034`, `537037`, `537040`
- Findings: 1 medium-severity, high-confidence plan defect

The snapshot data contracts, strict adapters, stale-response suppression, token redaction, fixed permit route, synthetic fixtures, and controller-owned flag/deployment boundary are well specified. The plan is not yet security-complete because it preserves an existing host-context validator that does not bind messages to the parent window, permits cleartext production origins, and accepts an arbitrary HTTP(S) API token destination.

## Finding SV-SEC-001

- Stable fingerprint: `simplyvibe:host-boundary:parent-source-https-api-confinement:v1`
- Severity: medium
- Confidence: high
- Affected tasks: `T-101`, `T-103`, `T-104`, `T-106`
- Category: iframe trust boundary / bearer-token confinement

### Evidence

The existing `contextFromMessage` path in `site/host-context.js:75-93` verifies only the origin and payload; it does not require `event.source === window.parent`. `validateHostContext` at lines 59-68 accepts any HTTP or HTTPS `ApiAddress`. The production-style allowlist entries in `site/constants.js:5-15` include HTTP. The plan directs implementation to reuse host-supplied `ApiAddress` and preserve existing origin validation, while `T-104` only says not to weaken it. No acceptance criterion or test in `T-106` adds parent-source binding, HTTPS-only production trust, normalized API-origin approval, or explicit direct/fallback denial.

### Impact

A message from another browsing context on an allowlisted origin can race to become the one accepted context, and accepted configuration can direct authorization-bearing requests to any HTTP(S) origin. Cleartext production host/API acceptance also permits bearer-token disclosure to an on-path observer when such a context is used. The new snapshot adds three authenticated calls and a privileged navigation bridge, increasing the operations governed by this incomplete boundary.

### Reproduction / plan test

1. Construct a message with an allowlisted `origin`, valid-looking context, and `source` set to an object other than `window.parent`; current `contextFromMessage` accepts it.
2. Set `ApiAddress` to `http://example.test` or `https://unapproved.example`; current `validateHostContext` returns true.
3. Observe that no shared task requires these cases to be rejected before snapshot fetches or host commands.

### Required plan change

Add explicit requirements and negative tests to `T-104`/`T-106` (and enforce them before `T-101`/`T-103` requests): accept bootstrap/host-service messages only from `window.parent` and an expected HTTPS parent origin; restrict normalized `ApiAddress` to approved HTTPS SimplyLog API origins (with any localhost exception isolated to test/dev); bind command replies to the same source/origin; and prove direct/fallback/rejected-context modes perform no authenticated fetch or privileged host command.

## Task-by-task disposition

| Task | Security disposition |
|---|---|
| `T-101` | Request change: exact endpoints/body and token redaction are good, but authorization destination must be approved and HTTPS. |
| `T-102` | Accept: strict shape/reconciliation and no invented classification reduce unsafe data interpretation. |
| `T-103` | Request change: loading after a merely “valid” context is insufficient until parent/source/origin/API confinement is defined. |
| `T-104` | Request change: host-service bridge needs exact sender/origin binding and direct-access denial acceptance. Fixed internal navigation URL is good. |
| `T-105` | Accept: native fixed-action controls and escaped existing renderer direction are compatible with safe rendering; implementation review must still verify no untrusted HTML insertion. |
| `T-106` | Request change: add the negative host/API/direct-access cases documented above. Synthetic non-secret fixtures are good. |
| `T-107` | Accept: controller-owned deployment, false-by-default flag, and honest skipped-live verification are appropriately bounded. |

## Evidence artifacts

- `evidence/host-boundary.md`
- `.agents/shared/plan.md`
- `.agents/shared/tasks.json`
- `site/host-context.js`
- `site/constants.js`

