# Deterministic evidence

- Runtime: Node.js `v20.20.2`; browser: not supplied/not executed.
- UAT: 13 passed, 0 failed, 0 skipped; total 177.940 ms.
- App regression: 55 passed, 0 failed, 0 skipped; total 209.481 ms.
- UAT SHA-256: `752fec0ca9fdf60489fedd8484ee8949d71db01d11abb17a58653e874c727c7f`.
- XState 4.38.3 bytes SHA-256: `06f5c308e93a6542c15c13c6bc16ac6841e995538ee48682a13909e298650024`.
- `_headers` SHA-256: `60a0abdd450a5075a3e202e20ad30f9542ba913dcaeaa5e07df603b8e9a5623c`.
- Mapper observations: 0 rows / 27 bytes / 0.006 ms; 1 / 127 / 0.011 ms; 1,000 / 103,422 / 3.164 ms; 10,000 / 1,043,924 / 25.806 ms. Unique outputs matched 0/1/1,000/10,000.
- Request workflow observations: three exact current-report calls; each POST body `{}`; start spread asserted under 50 ms. Ten refreshes aborted nine old generations and committed only generation ten. Rejected contexts and post-revocation new work produced zero authenticated effects in their probes.
- Full bounded logs: `evidence/uat.tap`, `evidence/site.tap`.

No real token, tenant, external network, production mutation, or controller lifecycle action was used.
