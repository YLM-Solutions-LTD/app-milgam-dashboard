# Remediation-planning evidence

- Frozen source: `pending-actions.json` preserves action order `536946`, `536949`, `537034`, `537037`, `537040`, `547704`, `547710`, `547713`, `569787`, `569843`; `includeDescription=false`.
- Cycle-2 accepted findings: missing packaged/initialized guest SDK and real command path; legacy context surviving harness disconnect; raw/parsed API error-body disclosure. The three missing-command reports share one implementation root and remain mapped to `T-203`–`T-205`.
- Superseded finding: the frame-ancestor rejection used the mistaken fixture origin. Controller authority corrects the fixture to `https://milgam.ylm.co.il/controller-host-fixture/`; the plan explicitly forbids widening trusted origins or CSP.
- Read-only source inspection confirmed `index.html` does not package the verified client, `host-services.js` defaults to `globalThis.SimplyVibeHostAdapter`, and `api-client.js` logs sanitized but otherwise complete response bodies/snippets.
- The supplied manifest records verified GuestBridge and SimplyVibeClient artifacts; the SDK supports Ready correlation, commands, session reset, and disposal needed by the revised acceptance criteria.
- Shared plan revision 6 and tasks `T-201`–`T-205` specify same-origin SDK packaging, private instance binding, SDK/application generation revocation, metadata-only diagnostics, corrected local-only harness operation, exact Navigate acceptance, and fresh re-entry.
- Validation commands returned `schema-valid` and `true` for exact source action order and unchanged task IDs.
