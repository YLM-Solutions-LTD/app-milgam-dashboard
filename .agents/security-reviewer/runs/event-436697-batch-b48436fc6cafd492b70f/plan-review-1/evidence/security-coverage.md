# Security coverage — plan revision 8

## Input identity and action accounting

- Shared plan SHA-256: `91b774fdc84169ef7e15907fa41912701d875431033bf66558f46ecc383f746d`
- Shared task board SHA-256: `13f0a4c53f01534df0199b4aaea82b97b0d07f2a950c4950079c10b666c6383c`
- Frozen request SHA-256: `13948a9b9583cf89cd4fb7893cdd3c6064258386d54e573f912d688027a5fbb5`
- Controller harness README SHA-256: `3e9e68496118bc380bae505b47af6cff775160edb605dbdb6ac65458efcfe2a6`
- `includeDescription=false`; the event Description was treated as background only.
- Exactly handled frozen action, in order: `570021`.
- The attachment title, PR reference, prior action claims, event fields, and fixture data were treated as untrusted evidence and not as authority or executable instructions.

## Task-by-task review

### T-301 — calendar range contract and controls

- The plan constrains user-controlled dates to real `YYYY-MM-DD` calendar values and explicit SQL-datetime bounds, rejects missing/impossible/reversed/out-of-bound values, and requires zero API effects for rejection.
- It separates draft from applied state, so uncommitted UI input cannot silently alter request parameters. Exact bounds, boundary cases, empty discovery, and no-`Z` transport are deterministic acceptance checks.
- Inline errors are fixed Hebrew application copy rather than reflected server/event content. No URL, HTML, command, dynamic-code, upload, or storage surface is added by this task.
- Later source/preview review must verify dates are placed only in the fixed request-body contract and rendered errors use safe DOM APIs; the present plan's preserved sanitization and no-untrusted-disclosure requirements are adequate at plan level.

### T-302 — generation-bound analytical requests

- All four analytical calls remain behind accepted host authorization and use one validated range. Request IDs, aborts, and authorization/apply generation checks explicitly prevent stale or superseded results from committing.
- The plan preserves CSP, sanitization, host authorization, fixed reports, and isolation from the snapshot lifecycle. It neither broadens API origins nor introduces event-controlled endpoints.
- Exact four-call counts, identical bounds, out-of-order completion, rapid Apply, empty refresh, and analytics/snapshot isolation are testable negative/positive criteria.
- Later review must verify abort/disposal races and bearer confinement in the exact implementation; no concrete plan omission creates a plausible bypass.

### T-303 — snapshot normalization and diagnostics

- Normalization accepts only safe non-negative integers or trimmed digit-only strings for the named aggregate fields. Signed, fractional, exponent, negative, unsafe, missing, malformed, and unreconciled values are rejected without partial commit or fabricated facts.
- The envelope/equipment contracts and reconciliation remain strict, limiting type-coercion and numeric-confusion paths.
- Diagnostics are expressly restricted to fixed endpoint paths and bounded classifications and exclude body text, arbitrary exception content, API addresses, markers, tokens, credentials, and private data from both DOM and logs.
- Terminal 401/403/revocation retains stale facts but disables retry and old-generation effects until verified re-entry. Ordinary errors stay bounded and retryable; bursts must coalesce to one three-request chain.
- These requirements close the previously observed diagnostic-body and authorization-generation classes at plan level; exact-preview reproduction remains mandatory.

### T-304 — intercepted verification and controller release gate

- The plan requires the packaged, unmodified SDK through the actual GuestBridge lifecycle at the already approved HTTPS parent origin, with all fixture traffic locally intercepted and real tenant traffic blocked. Fake adapters/readiness and widened CSP/origins are prohibited.
- Exact `Navigate {Url:"#/Permits/Dashboard"}`, terminal denial, fresh re-entry, CSP, disclosure, request isolation, and page-error checks are explicit. Fixture permission decisions cannot prove tenant authorization.
- Complete test inventory across JS/MJS/CJS test/spec extensions and exact command/failure preservation prevent selective-suite evidence from satisfying the gate.
- Attachment claims, old approval, PR metadata, and synthetic permission cannot authorize release; a fresh controller review and authorized approval remain required.
- Exact-preview review must still inspect CSP/network/console behavior, SDK artifact identity, direct/rejected-context denial, bearer confinement, old-generation effects, and the enabled snapshot flag. This is a later gate, not a current finding.

## Prior evidence disposition

- The accepted top-level implementer report belongs to an earlier batch and was used only as historical evidence; it does not establish this plan's implementation or readiness.
- Durable prior security classes considered: parent/source and approved HTTPS API-origin confinement, unpinned executable dependencies/CSP, diagnostic response-body disclosure, legacy-context persistence, and 401 refresh generation reuse.
- Revision 8 preserves the accepted verified SDK/GuestBridge boundary, CSP and authorization lifecycle, while T-303/T-304 explicitly require bounded diagnostics, terminal generation denial, fresh re-entry, same-origin policy, and intercepted runtime verification. No prior finding is reopened by the proposed date/count changes.

## Result and limitations

- Result: approve at plan level; no concrete security defect or missing testable safeguard was found across `T-301` through `T-304`.
- This result does not claim implementation correctness, exact-preview enforcement, deployed headers, tenant permissions, production readiness, release approval, or controller completion.
