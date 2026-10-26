# UI plan-review evidence

Batch: `event-436697-batch-b48436fc6cafd492b70f`  
Tasks: `T-301`, `T-302`, `T-303`, `T-304`  
Frozen action acknowledged: `570021`

## Verdict basis

Plan revision 8 is UI-decision-complete. It retains the accepted dashboard hierarchy while adding a clear explicit date-range workflow. Requirements and acceptance criteria cover RTL/LTR parity, phone and desktop fit, keyboard use, focus placement, invalid-state announcement, analytical/snapshot independence, stale authorization treatment, strict-CSP charts, and intercepted preview verification. No release-blocking UI ambiguity was found.

## Normative layout and interaction specification

- Use Arial with `sans-serif` fallback and only `normal`/`bold` weights. Use `#1e6bd6` as the sole brand accent; neutral white/black/gray form the hierarchy. Semantic red and amber are reserved for invalid/error and stale states respectively, always paired with text and iconography.
- Render one logical DOM order in both directions: From date, To date, Apply, analytics refresh, status. Let CSS logical properties mirror layout; do not reorder focus with positive `tabindex` or direction-specific markup.
- Desktop/tablet: the date pair and actions may share a wrapping row. Narrow phone: stack each labeled input and button at full available width. Interactive targets are at least 44px high, text wraps, and the page must not overflow horizontally at 390x844 or 1440x900.
- Date labels are `מתאריך` and `עד תאריך (כולל)`. Inputs expose their native date semantics and an explicit accessible label. Keep draft values visually stable while the prior applied result remains visible. Applying uses a pending state on the Apply control and announces completion without moving focus on success.
- Invalid input sets `aria-invalid=true` on the relevant field, connects one concise Hebrew message with `aria-describedby`, places focus on the first relevant invalid field, and sends no request. Error copy distinguishes missing/invalid dates, impossible dates, year bounds, and reversed range without exposing internal values beyond the user's own input.
- Keep the current snapshot in a visually separate landmark after analytics, with its own heading, last-updated/stale status, refresh/retry control, event counts, three distinct native permit controls, and equipment summary. Analytics Apply/refresh never changes snapshot facts, timestamp, busy state, or focus.
- While analytics is loading, preserve control geometry and announce loading; empty results retain the applied range and offer analytical refresh. Recoverable analytical or snapshot failure offers `RETRY`; ready/empty analytics offers `REFRESH`. Snapshot 401/403/revocation retains last-good facts with a textual stale banner and disables ineffective retry until fresh verified re-entry.
- Charts must preserve visible text values, labels and accessible summaries under strict CSP; color cannot be the only differentiator. Loading placeholders, empty copy, stale copy, validation, success status, recoverable error, authorization-unavailable state, and host-navigation failure all require distinct text.
- Permit activation is keyboard operable. During a pending Navigate command, disable only the activated single-flight control as required by the lifecycle; rejection restores focus and provides an announced failure message. Synthetic fixture permission is not tenant permission proof.

## Task traceability

- `T-301`: From/To/Apply hierarchy, draft/applied distinction, validation, focus, announcements, 44px targets, logical bidi order, and responsive stacking are explicit and acceptance-testable.
- `T-302`: four-report pending/success/empty/error states share the applied-range context; analytical refresh and Apply remain visually and behaviorally isolated from the snapshot.
- `T-303`: normalized counts render as numeric facts without partial/fabricated values. Bounded report-specific Hebrew recovery copy, stale last-good treatment, disabled unauthorized retry, and independent snapshot refresh are specified.
- `T-304`: the plan requires keyboard/focus, announcements, overflow, strict CSP/chart visibility, no page errors, RTL/LTR, two viewports, real packaged SDK navigation, authorization/re-entry, and complete test-inventory evidence. These checks are sufficient for exact-preview UI review; production and tenant state remain controller-owned.

## ImageGen evidence

- Selected reference: `date-range-responsive-reference.png`, SHA-256 `f195c69f45cfce36d94d96acfe6e252403d575dabc2c813152dcd5b77a17a65e`.
- Built-in ImageGen mode; use case `ui-mockup`; generated as a non-runtime design reference.
- The image demonstrates desktop and narrow-phone RTL hierarchy, stacked responsive controls, visible invalid focus/error, chart text, and separation of analytics from the current snapshot. Generated text and sample numbers are illustrative only; this written specification and live semantic HTML are normative.

## Evidence integrity and limits

- Shared plan SHA-256: `91b774fdc84169ef7e15907fa41912701d875431033bf66558f46ecc383f746d`.
- Shared tasks SHA-256: `13f0a4c53f01534df0199b4aaea82b97b0d07f2a950c4950079c10b666c6383c`.
- Review is plan-only. It does not prove implementation, exact-preview behavior, real tenant permissions, deployment, release approval, or controller completion.
