# Preview evidence summary

- Exact preview: `https://c9756759.app-milgam-dashboard.pages.dev`; expected head supplied by controller: `50972d0b555115d3b1c9da90f7df0dc4790c6e8e`.
- Chromium `140.0.7339.16`; 1440×900 RTL/LTR and 390×844 RTL.
- After accepted synthetic parent context, analytics rendered but the snapshot status was `תמונת המצב הנוכחית אינה מופעלת בסביבה זו.`, refresh was disabled, and current-report request count was zero in every run.
- Deployed `constants.js` hash-matches local (`320f37e2164730251ec6bb2c769d21a571ff627d0d3ef88da4af358216499b76`) and sets `CURRENT_SNAPSHOT_LIVE_CALLS_ENABLED = false`.
- Response CSP enforces `script-src 'self'`; every observed executable request was same-origin. Deployed/local XState hash is `06f5c308e93a6542c15c13c6bc16ac6841e995538ee48682a13909e298650024`.
- Disabled-state layouts had no horizontal document overflow; direction resolved correctly. Direct access made zero API requests.
- Supporting local suites passed 13/13 UAT and 55/55 site assertions on Node.js v20.20.2.
- Because the exact preview is disabled, snapshot happy path, retry, stale refresh, concurrency, permit navigation/locking, and rejection focus variants cannot be executed. No approved real SimplyLog host/harness was supplied, so real authorization expiry/re-entry also remains unproved.
- No real token, tenant API, production write, deployment, provider action, lifecycle call, or Git action occurred.

