# UAT cases — cycle 3

| Case | Tasks | Synthetic workflow and acceptance | Result |
|---|---|---|---|
| UAT-001 | T-101,T-102,T-103,T-105 | Accepted parent context loads exactly three concurrent exact-path POSTs with `{}` and yields coherent events, permits, equipment. | Pass |
| UAT-002 | T-102,T-104,T-105,T-106 | Preserve validated zero, separate permit units, raw host date inputs, unavailable equipment classification, identical-ID dedupe. | Pass |
| UAT-003 | T-103,T-105,T-106 | Current snapshot body remains independent from analytical period/date body. | Pass |
| UAT-004 | T-101,T-103,T-106 | Ten refresh generations abort nine predecessors; only generation ten commits. | Pass |
| UAT-005 | T-101,T-102,T-103,T-105,T-106 | Permission, invalid JSON, and malformed envelope remain explicit/redacted; no fabricated zero. | Pass |
| UAT-006 | T-101,T-103,T-104,T-106 | Reject source/origin/API/plain-object forgeries with zero effects; freeze accepted context; revoke pending request and deny its late result/new work; accept a strictly newer fresh capability generation. | Pass (synthetic only) |
| UAT-007 | T-103,T-105,T-106 | Refresh failure retains the exact last-good object and exposes sanitized stale error. | Pass |
| UAT-008 | T-104,T-105,T-106 | Ready then one exact `Navigate` command to `#/Permits/Dashboard`; busy lock contract present. | Pass |
| UAT-009 | T-104,T-105,T-106 | Rejection preserves data, clears busy state, uses captured pre-await control, guards connected/focusable state, and never dereferences async `event.currentTarget`. | Pass |
| UAT-010 | T-105,T-106 | Hebrew RTL baseline, live status, narrow breakpoint, logical properties, visible focus, RTL/LTR resolution, unavailable label. | Pass (source/module contract) |
| UAT-011 | T-101,T-102,T-106 | Reject invalid reconciliation; measure 0/1/1,000/10,000 equipment rows and enforce `<100 ms` at 10,000. | Pass |
| UAT-012 | T-106,T-107 | Delivered flag false; synthetic fixture contains no JWT; HTML loads only local pinned XState; `_headers` expresses self-only script CSP without unsafe/wildcard script source. | Pass (source contract) |

## Limitations

- No exact preview was authorized for this test-authoring cycle; browser viewport/render, runtime CSP response header, executable network trace, and deployed-byte equality were not tested.
- No approved SimplyLog host or controller-owned faithful harness was supplied. Real expiry/revocation, authenticated re-entry, and real command-response binding remain unverified; synthetic `postMessage` does not close that release gate.
- UAT-009 proves the source cleanup contract, not all four browser DOM variants (surviving, removed, rerendered, ineligible control); those require preview execution.
