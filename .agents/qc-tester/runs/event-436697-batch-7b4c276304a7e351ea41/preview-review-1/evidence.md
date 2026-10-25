# Preview review 1 evidence

- Exact preview: `https://275c4e6f.app-milgam-dashboard.pages.dev`
- Controller-supplied head: `ea974089c5cfa402a44b99606514721807b49dd8`
- Browser/runtime: Chromium `140.0.7339.16`; Node.js `v20.20.2`
- Inputs: synthetic parent `postMessage`, bearer placeholder, and intercepted API fixtures only; no tenant credential, live SimplyLog request, provider call, or lifecycle mutation.

## Exact-preview results

- Four successful visual passes at 390×844 and 1440×900 in RTL and LTR showed no horizontal overflow or measured clipping. Snapshot DOM count was 41 in every pass (limit 80).
- Current snapshots were enabled. Each successful load issued the three exact current POST routes concurrently (maximum measured concurrency 3), with body `{}` and the synthetic authorization header. Period selection caused zero current-route calls.
- Initial three-route 500 failure exposed retry without numeric placeholders; retry recovered. A failed refresh retained the prior 12-event snapshot and displayed stale/retry state.
- All three permit buttons had distinct accessible names. Keyboard Enter emitted exactly `Navigate`, `{Url: "#/Permits/Dashboard"}`, then restored focus. Twenty rapid activations while pending emitted one command and recovered after rejection without a page error.
- Donut segments, swatches, stacked segments, and bars rendered with CSP-safe classes/SVG attributes. The affected DOM contained zero inline style attributes; every donut segment had a visible computed stroke, every swatch a non-transparent color, and every nonzero bar a nonzero width.
- Delivered headers preserve `default-src 'self'`, `script-src 'self'`, `style-src 'self'`, `base-uri 'none'`, and `object-src 'none'`. No CSP violation or third-party executable request occurred. Console errors were limited to the deliberately injected 500 responses; abort warnings occurred when fixture contexts were closed or analytical requests superseded.
- The 10,000-row equipment fixture displayed `10,000 פריטי ציוד`, retained 41 snapshot nodes, and created no equipment fact list. Its end-to-ready browser interval was 212.05 ms (includes fixture serialization, transfer, parsing, mapping, state work, and concurrent analytical rendering; it is not asserted as the isolated 50 ms render measurement).

## Deterministic regression

- QC: 25/25 passed. The 10,000-row mapper had five warm runs of 23.557–29.498 ms for 2,083,924 decoded bytes; the ten-refresh controller fixture committed generation 10 only.
- Site: 56/56 passed.
- UAT: 13/13 passed. Its 10,000-row mapper measured 26.605 ms for 1,043,924 decoded bytes.

Screenshots and structured browser data are under `evidence/`. The deployed `app.js`, `app.css`, `constants.js`, and `current-snapshot.js` bytes match the reviewed local release-candidate files by SHA-256; controller supplied the exact head identity.

## Remaining release gate

T-205 cannot be closed in this QC environment. The shared plan requires an approved real SimplyLog host or controller-owned faithful harness for authorization expiry/revocation during requests and commands, zero post-revocation effects, fresh authorized re-entry, and command-response generation binding. Synthetic messaging is explicitly insufficient. No approved host/harness was supplied, so this is reported as a blocking limitation rather than fabricated evidence.
