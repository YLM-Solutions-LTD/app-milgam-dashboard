# Security review approach

- Review shared plan revision 12 and tasks T-301 through T-305 against host/API confinement, untrusted-data disclosure, authorization generations, footer metadata provenance, and the controller release gate.
- Treat accepted reports from plan-review-1, plan-review-2, and the archived pre-repair cycle-3 run as historical evidence only.
- Verify the repaired dependency/current-suite statement and reconcile archived fingerprints from current evidence.
- Read the builder release-footer contract and packaged assets because T-305 mandates copying those assets unchanged.
- Use only local static inspection and synthetic execution. Do not access the denied preview origin, tenant traffic, credentials, Git, providers, or lifecycle APIs.

