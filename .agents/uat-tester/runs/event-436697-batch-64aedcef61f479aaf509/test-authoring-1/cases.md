# Executable UAT traceability — attempt 2

All tests use synthetic postMessage context and API fixtures; no live tenant, token, preview, or network.

| Case | Tasks | Result |
|---|---|---|
| UAT-001 | T-101, T-102, T-103, T-105 | PASS |
| UAT-002 | T-102, T-104, T-105, T-106 | FAIL: identical-ID dedupe |
| UAT-003 | T-103, T-105, T-106 | PASS |
| UAT-004 | T-101, T-103, T-106 | PASS |
| UAT-005 | T-101, T-102, T-103, T-105, T-106 | PASS |
| UAT-006 | T-101, T-103, T-104, T-106 | PASS |
| UAT-007 | T-103, T-105, T-106 | PASS |
| UAT-008 | T-104, T-105, T-106 | PASS |
| UAT-009 | T-104, T-105, T-106 | PASS |
| UAT-010 | T-105, T-106 | PASS (source/runtime contract only) |
| UAT-011 | T-101, T-102, T-106 | PASS |
| UAT-012 | T-106, T-107 | PASS |

An executable traceability assertion proves the stable UAT IDs are contiguous and their union covers exactly T-101 through T-107. Exact-preview and approved-host checks were not supplied and are not claimed.
