# Preview evidence summary

- Exact preview core files `index.html`, `app.js`, `app.css`, and `constants.js` hash-match the reviewed local files. SHA-256 values are in `local-site-sha256.txt`.
- Chromium 140 ran desktop RTL 1440×900, phone RTL 390×844, desktop LTR 1440×900, first-load 403/retry, and direct timeout workflows.
- Valid synthetic context produced exactly three current-report POSTs with `{}` bodies. Their start spread was 3 ms or less. Month selection did not add current-report calls.
- Raw date calls were `2026-10-25T09:00:00` and `2026-10-25`; exact permit command order was `ready`, then `Navigate`, `{Url:"#/Permits/Dashboard"}`.
- Snapshot descendant count was 41; phone and desktop body scroll width equaled client width. Expected 403 resource messages were the only console errors and occurred only in the intentional failure case.
- First-load failure rendered no snapshot values and retry recovered. Direct timeout made zero API requests.
- Local supporting suites: UAT 13 passed / 0 failed; site 49 passed / 0 failed.
- Screenshots and machine observations are in this evidence directory. No real token, tenant API, production write, deployment, lifecycle call, or provider action occurred.
- Blocker: no approved real SimplyLog host or controller host harness was supplied. Synthetic `MessageEvent` context is diagnostic and does not prove the deployed preview's real host bridge, session-expiry, or authorized re-entry behavior.
