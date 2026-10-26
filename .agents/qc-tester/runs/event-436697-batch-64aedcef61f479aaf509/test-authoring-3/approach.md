# QC test-authoring cycle 3 approach

- Reconcile revision-4 implementation and accepted role evidence against T-101 through T-107.
- Replace superseded cycle-2 assertions for the restored false delivery flag and stable pre-await permit control.
- Add deterministic synthetic coverage for authorization generation replacement, revocation during in-flight API/host work, and fresh re-entry.
- Add source-backed checks for same-origin XState and the static-host CSP without network access.
- Run the QC suite and the read-only app regression suite; record bounded TAP evidence and exact counts.
- Do not use a real tenant token, external API, provider, preview, deployment, Git, or lifecycle API.
