# Evidence summary

- Exact preview `https://ea51f277.app-milgam-dashboard.pages.dev`, head `8f1e577bbcb4670878dec24ff570c1382a18d170`.
- The corrected controller fixture served actual GuestBridge at `https://milgam.ylm.co.il/controller-host-fixture/`; the guest loaded its packaged same-origin `assets/simplyvibe-client.js`. No adapter/readiness/command implementation was injected.
- All API responses were local intercepted fixtures; no tenant token or real tenant request was used. No unexpected request was observed.
- Four viewport/direction runs each issued exactly three `{}` current calls; start spread was under 5 ms, decoded fixture size was 914,331 bytes, snapshot descendants were 41, inline styles were 0, and no horizontal overflow occurred.
- Exact permit Navigate and generation rotation work. A held old command produced zero effects; fresh generation 2 produced one `Navigate {Url:"#/Permits/Dashboard"}`.
- Failing evidence: pending 20-activation burst committed two Navigate effects; HTTP 500 cleared last-good snapshot content; HTTP 401 cleared last-good content and a subsequent pre-re-entry refresh issued three current calls. Fresh re-entry recovered with three current calls.
- API error body marker `DO-NOT-LOG` did not appear in captured errors. The only console messages were browser HTTP status diagnostics.
- Strict CSP remained self-only for scripts/styles and all observed executable requests were either controller fixture files or exact-preview same-origin files.
