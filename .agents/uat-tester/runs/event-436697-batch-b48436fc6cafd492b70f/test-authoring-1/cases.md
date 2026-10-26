# Deterministic UAT cases

| Case | Tasks | Goal and observable result | Mode |
|---|---|---|---|
| UAT-301 | T-301, T-302 | Boundary, leap-day, one-day, and cross-year From/To values produce timezone-less `00:00:00` / `23:59:59.997`; invalid values fail before effects. | Automated synthetic |
| UAT-302 | T-301, T-302, T-304 | Empty discovery seeds a usable current-month draft; accepted Apply starts exactly four analytical calls with identical bounds and no snapshot call. | Automated synthetic |
| UAT-303 | T-303, T-304 | HTTP-200 decimal-string event/permit aggregates normalize; empty, signed, fractional, exponent, negative, unsafe, missing, and very long forms fail closed. | Automated synthetic |
| UAT-304 | T-302, T-303, T-304 | Analytics and snapshot refresh paths remain separate, live snapshot flag remains true, and packaged verified SDK supports exact `Navigate {Url:"#/Permits/Dashboard"}` with revocation/re-entry safety. | Automated synthetic actual SDK/GuestBridge |
| UAT-305 | T-304, T-305 | One footer outside state content uses unchanged packaged assets; unavailable/preview/production and Hebrew/English truth tables work with no footer network/authentication dependency. | Automated synthetic |

Cross-task retained UAT in `current-snapshot.uat.test.mjs` and `verified-host-bridge.uat.test.mjs` additionally covers three-call snapshot concurrency, stale retention, terminal 401, fresh re-entry, exact navigation, malformed response privacy, mapper volume, CSP/source constraints, and disposal races.

Browser-only viewport, focus, DOM, long-task, exact-preview stamp identity, and real tenant permission checks are deferred to authorized preview review and are not claimed here.
