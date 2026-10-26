# UI design evidence — shared revision 12

## Evidence boundary

- Reviewed `.agents/shared/plan.md` revision 12 (SHA-256 `fb9eba8b7be48e6682922cbdae680a488103f39c10d2729a2c41e5bd7aad8366`) and `.agents/shared/tasks.json` revision 12 (SHA-256 `090aa53ae94bd996e3489492421ee62b8242274001ca33fd2d81eb79954d3e1f`).
- Verified frozen request `includeDescription=false` with the sole ordered action `570021`.
- Verified `/workspace/.simplyvibe/input/remediation-cycle-3.json` is absent. No cycle-3 fingerprint payload can be enumerated or reconstructed from that file; this is controller packaging state, not an app-controlled UI defect.
- Did not access the explicitly denied deployed origin. This review uses local source, the controller fixture contract, packaged builder references/assets, prior accepted reports as context, and synthetic ImageGen evidence only.

## Task-by-task review

### T-301 — range controls

Revision 12 specifies native From/To inputs, Apply and separate refresh actions, 44px targets, logical RTL/LTR layout, 390×844 and 1440×900 fit, inline announced validation, `aria-invalid`, useful focus, zero-effect invalid edits, and draft/applied separation. These requirements are implementation-ready and preserve a clear form hierarchy. At narrow widths, stack the two fields and actions in DOM order; keep the error immediately after the field group and do not move it visually away from its programmatic association.

### T-302 — analytical lifecycle

The plan makes loading, empty, ready, recoverable error, stale suppression, and refresh semantics observable without coupling them to the independent snapshot. The current-data view remains stable while a draft range is edited, preventing a misleading visual mismatch. Loading/status copy should announce once per generation; the main dashboard must not be replaced by a full-page spinner when retained data can safely remain visible.

### T-303 — snapshot normalization and recovery

The plan preserves distinct permit categories, truthful counts, last-good stale facts, report-specific bounded Hebrew guidance, disabled ineffective retry after terminal authorization loss, and re-entry recovery. Semantic state must use text plus color; permit navigation controls remain real buttons/links with visible focus. Decimal-string normalization changes data acceptance, not visual formatting or information hierarchy.

### T-304 — verification

The required checks cover RTL/LTR keyboard/focus order, announcements, overflow, strict-CSP charts, both target viewports, all application states, and explicit render/DOM budgets. The exact-preview restriction is honest: local synthetic evidence can validate the design contract but cannot prove deployment or tenant configuration.

### T-305 — release footer

Revision 12 follows the builder contract: exactly one packaged semantic footer after state-dependent main content, in document flow, using the marker, `<dl>`, label/value hooks, `<bdi>`, same-origin CSS/module, and unavailable initial values. It explicitly covers host-waiting, loading, missing-context, empty, recoverable error, terminal stale/error, and ready states; 390×844/1440×900; RTL Hebrew/LTR English; zoom, wrapping, no overlap/overflow, language changes, zero network/auth effects, malformed metadata, preview `Not released`, and valid frozen production timestamps. It forbids page-open time, viewer current time, dashboard refresh time, event time, and hand-maintained versions. This is visually and semantically implementation-ready.

Normative footer behavior comes from the packaged assets, not from generated pixels: use the asset's Hebrew copy (`פרטי גרסה`, `גרסה`, `עדכון אחרון`, `תאריך שחרור`, `לא זמין`, `תצוגה מקדימה`, `טרם פורסם`) and English equivalents; keep `Arial, sans-serif`, named weight, neutral surface, border separation, flex wrapping, and `overflow-wrap:anywhere`.

## Archived-finding reconciliation

- `perf:plan:range-and-count-release-missing-measurable-budgets:v1` remains resolved. Current plan lines 71–72 and 90–91 plus task acceptance define row/byte, mapping/render, long-task, DOM, request-total, concurrency, cancellation, burst, and commit ceilings. This review does not claim those later candidate measurements have executed.
- `perf:plan-review:configured-site-suite-fails-missing-xstate:v1` is resolved in the repaired current environment. Current plan line 34 records the complete rediscovered inventory and fresh results: site 61/61, QC 34/34, UAT 23/23, harness 2/2 after restoration of locked `xstate` 4.38.3. T-304 still requires the unchanged complete commands on the implementation candidate.
- No supplied cycle-3 manifest fingerprint exists because the named file is absent. The absence is recorded as a limitation and no synthetic fingerprint is created.

## Fresh ImageGen evidence

- File: `evidence/revision12-footer-responsive-reference.png`
- SHA-256: `1f6d44bce5afa4c1e38d9ff28872f2791c6f8253c47688f254defa7715507d94`
- Mode: built-in ImageGen, `ui-mockup`.
- Prompt intent: side-by-side 1440×900 Hebrew RTL ready state and 390×844 English LTR loading/error state with From/To, Apply, separate refresh, snapshot/cards/charts, visible focus, inline status, and a wrapping in-flow release footer showing explicit synthetic Preview/Unavailable/Not released metadata.

The mockup is directional evidence only. It incorrectly mixes some domain examples and footer rendering details, so the revision-12 plan and packaged footer assets above are normative. It must not be copied into runtime source or treated as tenant data or actual release metadata.

## Verdict

Approve revision 12 through the UI-design lens for all structure-based tasks `T-301`–`T-305`. No reproducible plan-level UI, accessibility, bidi, responsive, state, or release-footer defect remains. Implementation, exact-preview behavior, tenant permissions, production metadata, release authorization, and controller completion remain unproven.
