# UI preview evidence

Exact candidate: controller-supplied commit `ea974089c5cfa402a44b99606514721807b49dd8` at `https://275c4e6f.app-milgam-dashboard.pages.dev`.

## Observable result

- Chromium `140.0.7339.16` rendered the enabled snapshot at 1440×900 RTL, 390×844 RTL, and 1440×900 LTR with zero horizontal overflow and 41 snapshot descendants.
- Each run issued exactly one POST with body `{}` to each documented Current Events, Permits, and Equipment route. The 10,000-equipment fixture rendered only the aggregate total and unavailable-classification copy; no equipment fact list appeared.
- Snapshot values were correct and non-fabricated: events 128/14 overall, 50/6 headquarters, 78/8 branches; permits 92 valid, 7 missing, 4 overdue; equipment 10,000.
- Three permit controls had distinct accessible names. Synthetic activation emitted one `Navigate` command with `{ "Url": "#/Permits/Dashboard" }`. Synthetic command rejection restored focus to the originating missing-permit control.
- Strict response CSP remained `style-src 'self'` with `object-src 'none'` and `base-uri 'none'`. The rendered DOM had no inline style attributes. Donut segments, legend swatches, the stacked comparison, and bars were visible. No relevant CSP message, uncaught page error, or third-party executable request was observed.
- The focused permit control had a clearly visible double outline. It uses the permit's amber semantic color rather than the approved reference's blue focus token; this remains perceivable and is recorded as a non-blocking design variance, not a release defect.
- Polite status regions exposed host connection and snapshot updated state. Layout order remained coherent under runtime `dir=rtl` and `dir=ltr`.

## Evidence files

- `playwright-results.json`: headers, browser version, DOM metrics, route bodies, commands, console/page messages, executable URLs, status regions, and chart geometry.
- `preview-desktop-rtl.png`, `preview-mobile-rtl.png`, `preview-desktop-ltr.png`: exact-preview screenshots.
- `preview-navigation-rejection.png`: focus restoration after synthetic command rejection.
- `imagegen-review-reference.png`: fresh ImageGen comparison reference, SHA-256 `b9de0a7675abc14491274b3543be0d4d8bf14e68849272084cf48a5d468ff3cf`.

## Evidence boundary

The wrapper used synthetic allowed-origin parent messaging and non-secret fixtures. It cannot satisfy `T-205`, which explicitly requires an approved real SimplyLog host or controller-owned faithful harness to prove authorization expiry/revocation, zero old-generation effects, fresh authorization recovery, and command-response generation binding. No approved environment or accepted lifecycle artifact was present in the supplied inputs. Commit-to-preview identity is controller-supplied; provider state was not queried.

