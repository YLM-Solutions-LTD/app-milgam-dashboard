# QC preview review 2 — approach

Review the exact PR head `8f1e577bbcb4670878dec24ff570c1382a18d170` at `https://ea51f277.app-milgam-dashboard.pages.dev` against tasks `T-201`–`T-205`.

Use Chromium and the controller-owned fixture served locally at the corrected trusted origin `https://milgam.ylm.co.il/controller-host-fixture/`. Exercise the actual packaged `SimplyVibeClient` and `GuestBridge`; do not inject adapters, readiness, guest commands, or tenant credentials. Fulfill synthetic API responses locally and abort all other tenant host/API traffic.

Cover 390×844 and 1440×900, RTL and LTR, snapshot load/refresh, analytical-date independence, permit controls and rapid activation, keyboard/focus behavior, session revocation/re-entry, API 401 recovery, stale/late effects, CSP, console/network hygiene, overflow, clipping, and repeated actions. Record reproducible evidence and stable findings without changing app, shared artifacts, tests, Git, provider state, or lifecycle state.
