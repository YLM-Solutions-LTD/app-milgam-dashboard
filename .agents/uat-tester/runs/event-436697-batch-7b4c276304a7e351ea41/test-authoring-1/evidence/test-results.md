# Deterministic test evidence

- Runtime: Node.js `v20.20.2`; browser: not supplied and not executed.
- Command: `node --test tests/uat/*.test.mjs`
  - Result: 13 passed, 0 failed, 0 skipped; 172.526 ms.
- Command: `(cd site && npm test)`
  - Result: 56 passed, 0 failed, 0 skipped; 250.228 ms.
- UAT SHA-256: `e7bdf6da4406a4def99e4f03aa9c32f3945ecb8a3e8ac6fee344b538d12dd77e`.
- `_headers` SHA-256: `60a0abdd450a5075a3e202e20ad30f9542ba913dcaeaa5e07df603b8e9a5623c`.
- `constants.js` SHA-256: `898e9a226b7c8469265f7adabd6013af54b147f7d17cde522460d5554a592ee2`.
- Mapper observations after warm-up: 0 rows / 27 decoded bytes / 0.006 ms; 1 / 127 / 0.009 ms; 1,000 / 103,422 / 2.830 ms; 10,000 / 1,043,924 / 25.925 ms. Unique outputs matched each envelope count.
- Transport observation: exactly three current-report calls, each POST body `{}`, start spread below the asserted 50 ms bound.
- Generation observation: a ten-refresh synthetic burst aborted nine superseded signals and committed only generation ten.
- Trust observation: rejected/unbound/forged contexts caused zero probed fetch/command effects; post-revocation request completion was denied; fresh synthetic context received a greater generation.
- Presentation observation: deterministic source checks require flag=true, no `style=`/`.style` chart generation, local donut SVG/presentation attributes and magnitude/color classes, and strict self-only script/style CSP without unsafe relaxations.

No real token, tenant request, external network, production mutation, deploy, Git operation, provider action, or lifecycle API was used.
