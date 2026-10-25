# Implementation cycle 3 — recovered process attempt 1

Frozen tasks: `T-201`, `T-202`, `T-203`, `T-204`, `T-205`.

Frozen actions, in order: `536946`, `536949`, `537034`, `537037`, `537040`, `547704`, `547710`, `547713`, `569787`, `569843`.

1. Preserve `T-201`/`T-202`: true live-call flag, exact report adapters, RTL charts, strict CSP/trusted origins, verified SDK bytes, and response-body-free diagnostics.
2. For `T-203`, make SDK session identity—not legacy Context or repeated cached `ready()`—the sole authority root. Taint a generation terminally after HTTP 401/403 and deny ordinary refresh/reconnect until a distinct bridge re-entry creates a new generation.
3. For `T-203`/`T-204`, keep one snapshot controller across ordinary refresh, retain last-good facts as visibly stale on 500/401/403, and automatically load all three reports exactly once on fresh re-entry.
4. For `T-203`/`T-204`, keep permit navigation single-flight until its own promise settles; revocation must suppress old effects without clearing the guard early. Catch every detached reconnect/handshake rejection, including reset/disposal races.
5. Add behavioral lifecycle tests for each current fingerprint, discover all test extensions, then run `cd site && npm test`, QC JS+MJS, UAT MJS, and controller-host-harness tests. Preserve exact failures and commands.
6. Record source/test evidence by task/fingerprint and explicitly defer deployed exact-preview and real tenant permission verification to controller stages; make no network, deployment, Git, provider, or lifecycle call.
