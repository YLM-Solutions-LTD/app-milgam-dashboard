# UAT execution — preview review cycle 1

- `UAT-301` (`T-301`, `T-302`, `T-304`): PASS. Ten draft edits made zero calls; an empty-discovery cross-year Apply made exactly four analytical and zero snapshot calls with identical `2025-12-31T00:00:00` / `2026-01-01T23:59:59.997` bodies at all four viewport/direction combinations.
- `UAT-302` (`T-301`, `T-304`): PASS for the exercised reversed range: zero calls, inline Hebrew alert, `aria-invalid=true` on the focused `to-date` input. Both viewport/direction pairs had no horizontal overflow.
- `UAT-303` (`T-302`, `T-304`): PASS for analytics/snapshot isolation and deterministic local generation coverage; exact-preview superseding ten-Apply timing was not separately repeated.
- `UAT-304` (`T-301`, `T-302`, `T-304`): PASS in configured deterministic suites; browser 4,000-row ceiling measurement belongs to the performance role and is not claimed here.
- `UAT-305` (`T-303`, `T-304`): PASS. Deployed preview rendered trimmed decimal-string event/permit aggregates correctly and retained numeric envelope/equipment behavior.
- `UAT-306` (`T-303`, `T-304`): FAIL. After an intercepted current-report HTTP 401, last-good data was retained and further old-generation API effects were zero, but the UI presented an enabled retry and ordinary “try again” copy instead of disabling retry pending fresh re-entry.
- `UAT-307` (`T-301`–`T-304`): PASS. Held old-session Navigate had zero effects; fresh re-entry emitted exactly `Navigate {Url:"#/Permits/Dashboard"}`. CSP was strict and executable requests were limited to the exact preview and fully intercepted controller fixture.
- `UAT-308` (`T-301`–`T-305`): FAIL because UAT-306 is a required workflow failure. Complete suites otherwise passed: site 67/67, QC 43/43, UAT 29/29, harness 2/2.
- `UAT-309` (`T-304`, `T-305`): PASS for exact preview ready and no-context states at desktop/phone RTL/LTR. Exactly one visible footer showed head prefix `1c5ebdae74cb`, explicit Preview, a stamped Last update, and Not released; no footer-originated API/auth calls occurred. Deterministic tests cover invalid/unstamped/production variants.

Synthetic permission decisions do not establish deployed tenant permissions.
