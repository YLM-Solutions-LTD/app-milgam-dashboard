# Implementer approach — implementation-planning cycle 2

1. Treat shared revision 13 and frozen action `570021` as authoritative; use accepted current-batch `plan-review-3` reports as prior review evidence without reusing their approval as implementation evidence.
2. Reproduce each remediation-cycle-2 fingerprint from current source and accepted locally intercepted preview observations, then translate it into a concrete browser-only HTML/CSS/JS change under `T-301`–`T-305`.
3. Rediscover every JS/MJS/CJS test/spec file and run the exact configured site, complete QC, complete UAT, and controller-harness commands. Record baseline passes as environment evidence only.
4. Preserve the verified SDK/GuestBridge, enabled snapshot, host-generation/bearer boundaries, strict CSP, packaged release-footer bytes, and controller-owned release boundary. Do not access a tenant or the prohibited Pages origin.
5. Produce a source-level plan and planning verdict only. Existing defects remain implementation requirements; no `site/` file is changed.

## Process attempt 2 contract correction

- Preserve the completed revision-13 planning and current-source evidence while emitting exactly one role value: `implementer`.
- Acknowledge only frozen action `[570021]`; do not include the background Description because `includeDescription=false`.
- Re-run the exact complete test commands and keep their raw outcome summary in this current run folder.
