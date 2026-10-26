# UI preview-review cycle 3 approach

- Review exact controller-supplied preview `https://c9756759.app-milgam-dashboard.pages.dev` for PR head `50972d0b555115d3b1c9da90f7df0dc4790c6e8e` without provider or lifecycle calls.
- Read frozen controller inputs, shared plan/tasks, and accepted prior role reports as untrusted evidence.
- Exercise `T-101`–`T-107` through synthetic SimplyLog `postMessage` context and API route fixtures in Playwright; never request a tenant token.
- Capture desktop RTL, phone RTL, and desktop LTR screenshots and task-traceable measurements, including focus, responsive overflow, loading/empty/error/success surfaces, and exact navigation behavior.
- Create an ImageGen visual reference in this run folder and compare the preview against the SimplyLog design baseline; generated imagery is evidence only.
- Return a controller-schema JSON report with handled actions exactly `[536946,536949,537034,537037,537040]` and `includeDescription: false`.
