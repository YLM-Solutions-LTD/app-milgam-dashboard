# QC acceptance traceability

Acceptance criteria are numbered in their published order in `.agents/shared/tasks.json`.

| Acceptance criterion | Planned QC coverage | Primary evidence/oracle |
|---|---|---|
| `T-101.AC1` | `QC-001` | Three exact concurrent endpoint calls, `{}` bodies, ≤50 ms start spread, no fourth call. |
| `T-101.AC2` | `QC-001` | Distinct `Items`/envelope `TotalCount` capture versus domain count fixtures. |
| `T-101.AC3` | `QC-002` | Typed abort/HTTP/network/JSON/envelope failure matrix, no empty/zero coercion. |
| `T-101.AC4` | `QC-002`, `QC-012`, `QC-014` | Monthly body snapshots and full analytical regression. |
| `T-101.AC5` | `QC-002`, `QC-007` | Negative trust matrix with zero authenticated snapshot/analytics requests. |
| `T-102.AC1` | `QC-003` | Valid normalized event, separate permit, and deduplicated equipment snapshots. |
| `T-102.AC2` | `QC-004` | Exhaustive reconciliation/type/required/uniqueness/conflict/population rejection fixtures. |
| `T-102.AC3` | `QC-003`, `QC-004` | Inactive/null/never-treated/arbitrary-status countability with unavailable classification. |
| `T-102.AC4` | `QC-003`, `QC-009` | Normalized/UI/a11y text scan forbids Missing+Overdue “invalid” label. |
| `T-102.AC5` | `QC-004`, `QC-013` | Post-warm five-sample 10,000-row ≤100 ms measurement and duplicate-heavy unique-count oracle. |
| `T-103.AC1` | `QC-005` | Parallel orthogonal state timeline and independent UI screenshots. |
| `T-103.AC2` | `QC-005` | Period change has zero current requests and identical snapshot values/timestamp. |
| `T-103.AC3` | `QC-006` | Reverse completion/abort log proves old success/failure cannot commit. |
| `T-103.AC4` | `QC-006`, `QC-009` | No-zero initial error and complete last-good stale retention. |
| `T-103.AC5` | `QC-001`, `QC-005` | Exactly three per load/refresh, none per period, no paging/retry. |
| `T-104.AC1` | `QC-007` | Byte-exact raw date adapter argument ledger. |
| `T-104.AC2` | `QC-008` | Ready→Navigate ordered ledger with exact URL/payload for each metric. |
| `T-104.AC3` | `QC-008`, `QC-009` | Navigation rejection preserves snapshot and announces sanitized recoverable error. |
| `T-104.AC4` | `QC-002`, `QC-007`, `QC-012` | Host/permission regression and zero-effect denial matrix. |
| `T-104.AC5` | `QC-002`, `QC-007` | Source/origin/API/direct/HTTP/mismatch rejection before privileged effects. |
| `T-105.AC1` | `QC-005`, `QC-009`, `QC-012` | Current-vs-monthly hierarchy plus no-clear period transition. |
| `T-105.AC2` | `QC-009` | State-matrix DOM/text comparison distinguishes zero/loading/error/unavailable. |
| `T-105.AC3` | `QC-008`, `QC-011` | Native distinct permit names, full keyboard activation, focus/contrast/non-color checks. |
| `T-105.AC4` | `QC-010`, `QC-011` | Four-viewports × two-directions geometry, reflow/zoom, DOM/focus/bidi order. |
| `T-105.AC5` | `QC-005`, `QC-012` | Existing controls/charts/tables interaction and visual regression. |
| `T-105.AC6` | `QC-013` | Five post-warm ready render samples ≤50 ms at both required viewports. |
| `T-106.AC1` | `QC-014` | Targeted/full deterministic offline suite with exact pass/fail/skip counts and artifact scan. |
| `T-106.AC2` | `QC-002`, `QC-004`, `QC-006`, `QC-008`, `QC-014` | Controlled mutation oracles for body, navigation, stale, and classification protections. |
| `T-106.AC3` | `QC-009`, `QC-011`, `QC-012` | Zero/state truthfulness and analytical date/chart UI regression. |
| `T-106.AC4` | `QC-013`, `QC-014` | Versioned numeric ledger: rows, bytes, timings, DOM, concurrency, generation, command counts. |
| `T-107.AC1` | `QC-015` | Final config/runtime inspection proves default local flag false. |
| `T-107.AC2` | `QC-014`, `QC-015` | Separate local/preview/live results; unavailable live checks marked skipped. |
| `T-107.AC3` | `QC-015` | Prohibited-action/artifact scan and controller-owned boundary review. |

## Cross-cutting checklist coverage

| Quality dimension | Cases |
|---|---|
| Buttons, fields, links, retry, refresh, keyboard, duplicate activation | `QC-005`, `QC-008`, `QC-011`, `QC-012` |
| 400/401/403/500, validation, offline, timeout, recovery, redaction | `QC-002`, `QC-006`, `QC-009` |
| Late valid context after timeout/fallback | `QC-007` |
| 320/390/768/1440 responsive, zoom, long copy, no x-scroll | `QC-010` |
| RTL/LTR/mixed-language order, alignment, focus | `QC-010`, `QC-011` |
| Labels, names, status, focus, contrast, touch target | `QC-008`, `QC-011` |
| Refresh, period changes, rapid interactions, slow/out-of-order responses | `QC-005`, `QC-006`, `QC-008`, `QC-012` |
| Console/network/assets/unhandled rejections | `QC-002`, `QC-008`, `QC-012`, `QC-014` |
| Numeric mapper/render/DOM/request/command budgets | `QC-001`, `QC-004`, `QC-006`, `QC-008`, `QC-013` |
| Exact preview identity and reproducible evidence | execution contract, `QC-014`, `QC-015` |

## Task summary

| Task | Covered by |
|---|---|
| `T-101` | `QC-001`, `QC-002`, `QC-007`, `QC-012`, `QC-014` |
| `T-102` | `QC-003`, `QC-004`, `QC-009`, `QC-013` |
| `T-103` | `QC-001`, `QC-005`, `QC-006`, `QC-009` |
| `T-104` | `QC-002`, `QC-007`, `QC-008`, `QC-009`, `QC-012` |
| `T-105` | `QC-005`, `QC-008`–`QC-013` |
| `T-106` | `QC-002`, `QC-004`, `QC-006`, `QC-008`–`QC-014` |
| `T-107` | `QC-014`, `QC-015` |

Coverage result: all 33 acceptance criteria across `T-101` through `T-107` have a named fixture, procedure, instrumentation/evidence oracle, and pass condition. Execution status is designed/not run because this is implementation planning and no exact preview or approved host harness was supplied.
