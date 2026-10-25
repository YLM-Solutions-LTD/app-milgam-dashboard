# Cycle 2 implementation evidence

- Packaged SDK integrity: `site/assets/simplyvibe-client.js` SHA-256 `ee67f5ae15c70fee8443701b4391946a2275d922acdf9d1797c69dad3c414bf1`, identical to the controller-supplied verified client.
- SDK bootstrap: `site/host-bootstrap.js` resolves an exact allowlisted parent origin from browser-owned ancestor/referrer data, constructs the packaged client, registers its event handler before `ready()`, binds returned context to the client generation, observes session-source replacement, and disposes/revokes on replacement, reconnect, and page hide.
- Runtime wiring: `site/index.html` loads the SDK from same-origin assets; `site/app.js` uses the private bootstrap/client; `site/host-services.js` has no global adapter fallback. Refresh and permit activation reauthorize before authenticated effects.
- Diagnostics: `site/api-client.js` and `site/dashboard-machine.js` retain only bounded metadata (`dataset`, `kind`, `status`, `bodyBytes`, `itemCount`); raw/parsed bodies, snippets, and external error messages are absent from errors and console diagnostics.
- Preserved release contracts: `CURRENT_SNAPSHOT_LIVE_CALLS_ENABLED=true`; chart/CSP implementation and trusted origin lists were not widened or relaxed.

Checks (Node v20.20.2):

- `cd site && npm test`: 59 passed, 0 failed, 0 skipped.
- `node --test tests/qc/*.test.js`: 25 passed, 0 failed, 0 skipped. Recorded 10,000-row warm measurements were 22.466–27.798 ms for 2,083,924 decoded bytes.
- `node --test tests/uat/*.test.mjs`: 13 passed, 0 failed, 0 skipped. Recorded 10,000-row measurement was 25.164 ms for 1,043,924 decoded bytes.
- Controller harness vendor test: 2 passed, 0 failed, proving real SDK/GuestBridge Ready, exact Navigate, session reset, old-command rejection, and fresh-generation command success with local fixtures.
- `node --check site/app.js` and `node --check site/host-bootstrap.js`: passed.
- Static scan found no production `SimplyVibeHostAdapter`, response-body snippet logging, or live-flag reset.

No tenant/API/provider/deployment/lifecycle request was made. Exact deployed-preview review remains a later controller stage and is not claimed here.
