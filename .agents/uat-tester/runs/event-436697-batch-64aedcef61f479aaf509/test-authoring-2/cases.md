# Executable UAT traceability — cycle 2

All executions use synthetic host context and API fixtures. Stable case and task IDs are preserved.

| Case | Tasks | Acceptance outcome | Result |
|---|---|---|---|
| UAT-001 | T-101, T-102, T-103, T-105 | Authenticated entry starts exactly three concurrent empty-body searches and maps a coherent snapshot. | PASS |
| UAT-002 | T-102, T-104, T-105, T-106 | Zero is distinct from unavailable; permit units and raw dates remain separate; identical equipment rows deduplicate. | PASS |
| UAT-003 | T-103, T-105, T-106 | Monthly analytical request construction remains distinct from snapshot searches. | PASS |
| UAT-004 | T-101, T-103, T-106 | A ten-refresh burst commits only generation ten and aborts superseded generations. | PASS |
| UAT-005 | T-101, T-102, T-103, T-105, T-106 | Permission, invalid JSON, and malformed envelopes fail explicitly without fabricated metrics or token leakage. | PASS |
| UAT-006 | T-101, T-103, T-104, T-106 | Wrong source/origin/API, malformed input, plain objects, and forged public markers have zero privileged effect; accepted context is immutable. | PASS |
| UAT-007 | T-103, T-105, T-106 | Refresh failure retains the complete last-good snapshot and emits a sanitized stale error. | PASS |
| UAT-008 | T-104, T-105, T-106 | Permit action uses ready then exact unfiltered navigation and exposes a busy lock contract. | PASS |
| UAT-009 | T-104, T-105, T-106 | Navigation failure preserves data and clears busy state. | PASS |
| UAT-010 | T-105, T-106 | RTL/LTR, live status, focus, logical CSS, narrow layout, and unavailable copy contracts remain present. | PASS (module/source contract) |
| UAT-011 | T-101, T-102, T-106 | Strict reconciliation and 0/1/1,000/10,000-row mapper budgets pass with decoded-byte evidence. | PASS |
| UAT-012 | T-106, T-107 | Live-call flag stays false and test credentials remain explicitly synthetic. | PASS |

Traceability assertion proves the union covers exactly T-101 through T-107. Exact deployed preview, browser rendering, and approved live-host integration were not supplied and are not claimed.
