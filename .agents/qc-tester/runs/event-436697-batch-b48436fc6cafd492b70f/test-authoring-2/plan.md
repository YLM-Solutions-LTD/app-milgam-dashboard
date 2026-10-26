# QC test-authoring cycle 2

- Reconcile plan revision 13 and T-301 through T-305 against all three remediation-cycle-2 fingerprints.
- Add deterministic regressions only under `tests/qc/` for bounded analytical windows, terminal snapshot authorization, and 320px footer containment.
- Rediscover every JS/MJS/CJS test/spec inventory and execute the configured site, complete QC, complete UAT, and controller actual-SDK harness commands.
- Treat exact deployed-browser behavior as unverified because the controller prohibits access to the deployed origin.

