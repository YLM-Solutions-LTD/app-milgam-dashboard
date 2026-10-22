# Planner memory

- Current batch: `event-436697-batch-64aedcef61f479aaf509`, remediation-planning cycle 2; shared plan revision 3 is ready after incorporating accepted QC/UAT findings.
- Frozen action order acknowledged: 536946, 536949, 537034, 537037, 537040. Event description excluded.
- Decision: add an independent current snapshot above the existing analytical dashboard using three authenticated `{}` entity-search requests.
- Decision: current events require overall/HQ/branches reconciliation; permits retain valid/missing/overdue as separate units and all navigate unfiltered to `#/Permits/Dashboard` through host services.
- Decision: equipment supports total and validated/deduplicated facts only. Valid/overdue classification remains explicitly unavailable and is not a blocker.
- Decision: report dates delegate unchanged to the existing host `ToDisplayDate` boundary; never append `Z`.
- Decision: errors/malformed responses never become zeros; snapshot has independent loading/error/stale/request-ID state.
- Decision: local/default `CURRENT_SNAPSHOT_LIVE_CALLS_ENABLED` remains false. Deployment and live verification are controller-owned; skipped live checks must be stated honestly.
- No backend, SQL, SearchAllEvents, Git, deployment, lifecycle API, or application source edits are part of planning.
- Cycle 2 decision: host bootstrap and service responses bind to `window.parent` plus an approved HTTPS origin; normalized `ApiAddress` is confined to approved HTTPS SimplyLog API origins. Direct/rejected/fallback modes perform no authenticated fetch or privileged command.
- Cycle 2 decision: performance acceptance uses measurable local budgets—10,000-row adapter ≤100 ms after warm-up, ready render ≤50 ms at two viewports, snapshot ≤80 DOM elements, 10-refresh and 20-activation burst tests, and recorded byte/runtime/browser evidence.
- Remediation decision: equipment envelope cardinality is dataset-specific. Validate shape/TotalCount, normalize and deduplicate identical EquipmentId rows, reject conflicting duplicates, then reconcile unique count to TotalCount; never reject a valid identical duplicate solely because raw Items.length exceeds TotalCount.
- Remediation decision: authenticated host contexts must originate from the validated parent/source/origin binding path and carry a non-forgeable module-private brand; an approved-origin-shaped plain object or public marker alone is not trusted, and accepted context fields are immutable.
- Validation: revision 3 board passed the referenced task-board schema constraints and preserves exact action order 536946, 536949, 537034, 537037, 537040.
