# Performance reviewer memory

- App: `milgam-dashboard`
- Current batch: `event-436697-batch-64aedcef61f479aaf509`
- Current assignment: plan review cycle 2, covering `T-101` through `T-107`.
- Scope is read-only for shared plan, task board, source, and previews. Reviewer writes are confined to this role home.
- Review emphasis: authenticated-call gating; exactly three bounded snapshot requests; stale/abort behavior; linear equipment adaptation; bounded DOM/state retention; measurable browser and API budgets; high-volume fixtures.
- No live preview or runtime measurements were supplied for plan review; cycle 2 assesses the measurability and boundedness of revision 2 rather than claiming runtime results.
- Cycle 1 verdict: `changes_required`.
- Stable finding: `perf:plan:snapshot-missing-measurable-budgets-and-volume-cases:v1` (`medium`, high confidence). The design has sound bounded-call and linear-work intent, but `T-106`/`T-107` lack numeric request, volume, timing, DOM, and burst acceptance cases.
- Proposed calibration: 3 requests per snapshot action, 0 on period change/retries; 10,000-row equipment fixture; 100 ms warmed adapter budget; constant equipment-derived DOM with snapshot <=80 elements; 50 ms ready render at phone/desktop test viewports; 20-click navigation burst produces one pending command.
- Cycle 2 disposition: revision 2 incorporates the stable cycle-1 finding across `T-101`–`T-107`; all proposed request, volume, mapping, DOM, render, refresh-burst, navigation-burst, decoded-byte, and environment-recording checks are now explicit. No remaining release-relevant plan performance finding identified.
