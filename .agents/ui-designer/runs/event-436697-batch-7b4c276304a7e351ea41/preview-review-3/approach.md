# UI preview-review approach

- Exact candidate: `b138df3040ab4468220a29f595d0caa62920f679` at `https://42ad1c5f.app-milgam-dashboard.pages.dev`.
- Applied SimplyLog baseline v1 to every shared task `T-201`–`T-205`.
- Loaded the preview only inside the corrected `https://milgam.ylm.co.il/controller-host-fixture/` harness, using its actual GuestBridge and the preview's packaged SDK. All API routes were fulfilled locally; unexpected traffic was aborted.
- Exercised ready, 500 stale retention, 401 terminal denial, unchanged-session retry, fresh re-entry, 20-activation permit burst, held-command revocation, and overlapping re-entry.
- Captured 1440×900 RTL, 390×844 RTL, and 1440×900 LTR views; inspected overflow, focus, accessible names, chart visibility, CSP styles, snapshot DOM size, console, and page errors.
- Generated a fresh non-runtime ImageGen reference for the stale-but-retained state and compared hierarchy/state clarity without treating subjective differences as defects.
