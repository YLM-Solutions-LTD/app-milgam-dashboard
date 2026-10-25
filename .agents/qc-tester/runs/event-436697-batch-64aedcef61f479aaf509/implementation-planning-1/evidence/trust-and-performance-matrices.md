# Attempt-2 trust-boundary and performance matrices

These are deterministic final-review oracles, not executed results. All credentials are synthetic canaries and all host identities are aliases.

## Trust-boundary matrix

| ID | Parent/source/origin/API condition | Expected bootstrap | Authenticated fetches | Date/command effects | UI result |
|---|---|---:|---:|---:|---|
| `TB-01` | `source===window.parent`; approved HTTPS parent; corresponding approved HTTPS API | accept once | permitted after acceptance | permitted; response must match source+origin | normal load |
| `TB-02` | approved origin, same-origin window that is not `window.parent` | reject | 0 | 0 | honest unavailable/fallback |
| `TB-03` | `window.parent`, unapproved HTTPS origin | reject | 0 | 0 | honest unavailable/fallback |
| `TB-04` | `window.parent`, production-style HTTP origin | reject | 0 | 0 | honest unavailable/fallback |
| `TB-05` | approved parent, HTTP `ApiAddress` | reject before URL/auth construction | 0 | 0 | sanitized unavailable |
| `TB-06` | approved parent, arbitrary/unapproved HTTPS `ApiAddress` | reject before URL/auth construction | 0 | 0 | sanitized unavailable |
| `TB-07` | direct/top-level, malformed payload, timeout, or fallback-only mode | reject/unbound | 0 | 0 | standalone guidance; late valid context remains recoverable |
| `TB-08` | valid bootstrap, command/date response from wrong source or origin | bootstrap stays bound; response rejected | only already-authorized calls | mismatched completion has no effect | data retained; sanitized recoverable feedback |
| `TB-09` | explicit localhost development exception with synthetic data/token | accept only under declared test policy | permitted only to declared local API | local mock only | clearly test-mode evidence |
| `TB-10` | localhost exception with production bearer canary | reject | 0 | 0 | sanitized unavailable |

For every denial, instrument URL construction and fetch/host-service entry points, not merely network completion. Pass requires zero authorization-bearing request attempts and zero privileged host calls. Logs and saved evidence may contain source aliases and origins, never token values or raw host payloads.

## Performance/API-efficiency matrix

| ID | Scenario | Samples/setup | Required measurement and oracle |
|---|---|---|---|
| `PF-01` | Initial snapshot / explicit snapshot refresh | deferred valid 3-dataset fixture | exactly 3 requests; start spread ≤50 ms; current-generation peak ≤3; no paging/retry/fourth call |
| `PF-02` | Period change | ready snapshot + two analytical periods | 0 snapshot calls; snapshot timestamp/state unchanged |
| `PF-03` | Equipment mapper sizes 0/1/1,000/10,000 | 1 warm-up then ≥5 isolated recorded runs per size | correct unique count and bytes; every 10,000-row run ≤100 ms; normalized output only |
| `PF-04` | Duplicate-heavy/nullable equipment | deterministic duplicate ratios and null fields | one-pass/map behavior; expected dedupe; conflicts reject; no inferred classification |
| `PF-05` | Ten-refresh burst | fake clock; reverse/out-of-order resolution | only generation 10 commits; superseded signals abort/ignore; one last-good maximum; no retry storm |
| `PF-06` | Twenty permit activations | mixed click/Enter/Space while command deferred | exactly 1 `ready`→`Navigate` chain; unlock on resolve and reject |
| `PF-07` | Ready render at 390×844 and 1440×900 | normalized 10,000-row-origin fixture; 1 warm-up + ≥5 runs/view | every render ≤50 ms from state delivery through forced layout and next frame |
| `PF-08` | DOM growth 1→10,000 equipment rows | identical visible aggregate | snapshot root-inclusive elements ≤80; equipment subtree count identical; 0 fact/list nodes added |
| `PF-09` | Retention after success/failure/supersession | inspect reachable state in harness | current normalized generation plus at most one last-good; no obsolete raw response generations |

Each numeric record includes runtime/browser version, OS, viewport/DPR, clock source, fixture rows/unique rows/duplicate ratio, decoded bytes, all sample durations, DOM counts, request spread/peak, winning generation, and command count. Local mapper/render ceilings exclude network latency and cannot be represented as live-service latency claims.

## Responsive and accessibility execution grid

| State | 320×568 | 390×844 | 768×1024 | 1440×900 | RTL + LTR | 200% zoom |
|---|---:|---:|---:|---:|---:|---:|
| ready zero/nonzero | required | required | required | required | required | desktop + effective narrow |
| loading | geometry smoke | full | geometry smoke | full | required | required |
| first-load error/unavailable host | geometry smoke | full | geometry smoke | full | required | required |
| stale refresh error | geometry smoke | full | geometry smoke | full | required | required |
| navigation error/recovery | geometry smoke | full | geometry smoke | full | required | required |

“Full” means screenshot, geometry, accessibility-tree, tab order, announcement transcript, contrast/focus measurements, page scroll width, 44×44 target sizes, mixed-bidi/long-copy fixture, and console/network capture. “Geometry smoke” retains clipping, overlap, scrolling, visibility, and target-size assertions.
