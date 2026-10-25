# Exact-preview security evidence

## Identity and integrity

- Controller preview: `https://1de11912.app-milgam-dashboard.pages.dev`
- Controller PR head: `d9ef28ddc6be1d9b6b9fb2f066bcde19c53c193b`
- Preview `/` and local `site/index.html` SHA-256: `cd7a191ca6071bf21ea0be1457ca9e2af93653213fb02b59077e87710434e769`
- Preview and local `app.js`, `api-client.js`, `host-context.js`, `host-services.js`, `current-snapshot.js`, and `constants.js` hashes matched exactly.
- Browser: bundled Chromium headless shell 1187 through Playwright Core 1.55.0.
- Synthetic-only token: no real tenant token or live SimplyLog request was used.

## Positive and negative host checks

An approved-origin synthetic parent (`https://mnt.ylm.co.il`) framed the exact preview and posted a synthetic context whose API origin was route-fixtured at `https://api.ylm.co.il`.

- The preview issued the exact three current-report `POST` requests, each with body `{}` and the synthetic bearer header, plus the existing month-discovery request.
- The snapshot rendered validated synthetic values.
- Permit activation called `ready`, then `executeCommand("Navigate", { Url: "#/Permits/Dashboard" })`.
- `ToDisplayDate` received the raw fixture date strings unchanged.
- Direct/top-level access followed by a same-page forged host-shaped `postMessage` produced zero API requests and zero host-adapter calls.

These checks support closure of the earlier host-boundary fingerprint `simplyvibe:host-boundary:parent-source-https-api-confinement:v1` for the exercised paths.

## Response and executable dependency evidence

The preview HTML response had `x-content-type-options: nosniff` and `referrer-policy: strict-origin-when-cross-origin`, but no `Content-Security-Policy` header. The page loads this executable before `app.js`:

```html
<script src="https://cdn.jsdelivr.net/npm/xstate@4.38.3/dist/xstate.js"></script>
```

The script element has no `integrity` attribute. The browser trace confirmed a live request to that jsDelivr URL. Once the approved parent posts the host context, the app makes authorization-bearing requests from the same JavaScript realm. Therefore code supplied by that third-party response can install a message listener or wrap `fetch` before the context arrives and read/exfiltrate the bearer token. The preview's missing CSP provides no independent script-source or outbound-connection containment.

## Reproduction

1. Fetch the preview headers and observe that `Content-Security-Policy` is absent.
2. Fetch the preview HTML and inspect the jsDelivr XState script tag; observe that `integrity` is absent.
3. Load the preview under a synthetic approved parent and inspect network traffic; observe the browser fetches `https://cdn.jsdelivr.net/npm/xstate@4.38.3/dist/xstate.js` before accepting host context and later sending authorization-bearing API calls.
4. For a harmless proof of capability, intercept only that CDN response in a controlled browser and prepend a message listener that records `event.data.Token.access_token`; post the synthetic approved context and observe that CDN-originated page code receives the synthetic token. Do not use a real token.

## Task coverage

- `T-101`: exact API destination/body and private bound-context gate exercised; third-party same-realm code can still observe the credential before requests.
- `T-102`: strict current-report mapping exercised with synthetic valid envelopes; no HTML/script injection sink found in snapshot values.
- `T-103`: authenticated snapshot starts only after accepted host context; direct forged context produced no request.
- `T-104`: exact date and navigation calls exercised; fixed navigation payload observed.
- `T-105`: rendered snapshot values use fixed templates and formatted numeric/date values; no untrusted rich-HTML feature found.
- `T-106`: local accepted tests were reviewed; the deployed third-party-script condition is not covered by them.
- `T-107`: the deployed preview has live calls enabled as authorized for verification; this makes executable dependency integrity material to the bearer-token boundary.
