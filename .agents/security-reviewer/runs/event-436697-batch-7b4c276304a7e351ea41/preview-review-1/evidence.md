# Exact-preview security evidence

Exact preview: `https://275c4e6f.app-milgam-dashboard.pages.dev`  
Controller-supplied head: `ea974089c5cfa402a44b99606514721807b49dd8`

## Trust-boundary exercise

- An iframe under synthetic approved parent `https://mnt.ylm.co.il` accepted a non-secret synthetic capability and issued the three exact current-report `POST {}` requests plus the existing analytical request only to `https://api.ylm.co.il`.
- The synthetic bearer appeared only in the `Authorization` header. Permit activation produced `ready()` followed by `executeCommand("Navigate", { Url: "#/Permits/Dashboard" })`.
- Direct top-level access followed by a forged same-page `postMessage` produced zero API requests and zero host calls.
- All executable requests were same-origin. The preview CSP is `default-src 'self'; script-src 'self'; style-src 'self'; ...; base-uri 'none'; object-src 'none'; form-action 'none'`; frame ancestors and API connections are allowlisted.
- Deployed XState SHA-256 `06f5c308e93a6542c15c13c6bc16ac6841e995538ee48682a13909e298650024` matches the reviewed local asset.

## Reproduced response-body disclosure

The synthetic analytical route returned HTTP 500 with body `{ "personName": "SYNTHETIC PRIVATE PERSON", "internalRecord": "SYNTHETIC-991" }`. The exact preview emitted the complete object to the browser console:

```text
[milgam-dashboard.api] HTTP error {
  dataset: "MilgamDashboardByMonth",
  status: 500,
  body: { personName: "SYNTHETIC PRIVATE PERSON", internalRecord: "SYNTHETIC-991" }
}
```

Source path: `site/api-client.js`, `requestItems()`, HTTP-error branch, where the parsed response body is passed to `console.error`. Token string sanitization does not remove unrelated personal or internal API fields. This exposes server-returned data through the browser diagnostic surface to local observers and extensions with console/debug access. Impact is constrained to error responses and a client already authorized to receive the response, so severity is low.

Artifacts: `browser-security.mjs`, `browser-results.json`, `headers.txt`, `xstate-headers.txt`, `xstate.js`, `digests.txt`, and `index.html` in this run directory.
