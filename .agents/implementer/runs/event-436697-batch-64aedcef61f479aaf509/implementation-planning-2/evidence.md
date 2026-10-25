# Implementation-planning cycle 2 evidence

## Inputs reconciled in attempt 2

- Frozen input: `.simplyvibe/input/pending-actions.json` (`includeDescription=false`, actions `[536946,536949,537034,537037,537040]`).
- Shared revision 3: `.agents/shared/plan.md`, `.agents/shared/tasks.json`; every task entry `T-101`–`T-107` was read in full.
- Accepted planner `planning-2` and `remediation-planning-2`, security/performance/UAT/UI `plan-review-2` reports, UAT cases/evidence, UI design specification, and prior implementer `implementation-planning-1` reports/evidence were read as read-only.
- Designer evidence is referenced by its accepted report; no generated image was copied into runtime source.

## Current-source audit

- `site/host-context.js:49-69` validates a caller-provided object using public `__trustedHostOrigin`; `site/api-client.js:35-37` relies on that validator. There is no module-private capability check, so an unbound shaped object can construct an authorization-bearing client.
- `site/host-context.js:86-95` freezes only a shallow outer copy; nested token data is not independently copied/frozen, so remediation must protect post-acceptance mutation.
- `site/api-client.js:164-172` rejects any current envelope whose raw `Items.length` differs from `TotalCount`, before dataset semantics are known.
- `site/current-snapshot.js:60-73` contains the intended map-based equipment dedupe, but `requireEnvelope` at lines 100-103 rejects identical duplicates before the map can reconcile unique population.
- Snapshot generation/abort handling, exact navigation/date seams, aggregate-only markup, and false-by-default flag already exist and should be preserved while focused defects are repaired.

## Reproduction

Command from app root: `node --test tests/qc/*.test.js`.

Observed again in attempt 2 on 2026-09-30:

- 11 tests total; 8 passed; 3 failed; 0 skipped.
- Failure 1: unbound shaped context did not throw (`QC-HOST-BOUNDARY-001`).
- Failures 2–3: identical `EquipmentId` duplicates with complete-population `TotalCount:1` were rejected by mapper and transport (`QC-EQUIPMENT-DEDUPE-001`).
- This matches the accepted QC report and supports revision-3 remediation. No application source was changed during reproduction.

Command from app root: `node --test tests/uat/*.test.mjs`.

- 13 tests total; 12 passed; 1 failed.
- The sole failure is UAT-002's identical-equipment duplicate fixture, which is the same `QC-EQUIPMENT-DEDUPE-001` implementation defect rather than a third finding.
- Representative UAT mapper evidence recorded 10,000 unique rows at 1,043,924 decoded bytes in 26.626 ms on this run; this does not close the duplicate-heavy remediation case or browser budgets.

Command from `site/`: `npm test`.

- 47 tests total; 47 passed; 0 failed.
- This establishes the unchanged analytical and existing snapshot regression baseline; it does not cover the two controller-authored remediation failures.

An accidental `npm test` invocation from the app root returned `ENOENT` because the package manifest is intentionally under `site/`; the correctly scoped command above passed. No install, write, or dependency change was performed.

## Stable findings carried into implementation

1. `QC-HOST-BOUNDARY-001` — high severity, high confidence; tasks `T-101`, `T-104`, `T-106`. Close only after module-private brand, immutable copy, negative zero-effect tests, and command/date boundary coverage pass.
2. `QC-EQUIPMENT-DEDUPE-001` — high severity, high confidence; tasks `T-101`, `T-102`, `T-106`. Close only after transport defers cardinality and equipment reconciles unique count after identical-deduplication while conflicts remain rejected.

## Attempt-2 implementation seams

- `site/host-context.js:49-100`: internal shape/origin validation, immutable scalar/token copying, private brand creation and predicate.
- `site/api-client.js:35-47,137-173`: reject unbranded contexts before capturing token/base URL; make current-envelope validation shape-only while keeping exact `{}` transport.
- `site/current-snapshot.js:26-73,100-103`: retain event/permit dataset cardinality and move equipment population comparison after one-pass identical dedupe.
- `site/host-services.js:1-14`: gate injected host-service capabilities with the same private predicate; no replacement transport.
- `site/app.js:73-98,203-267`, `site/index.html`, `site/app.css`: preserve lifecycle, exact board navigation, aggregate DOM, and accepted responsive/accessibility states unless regression evidence requires a focused adjustment.
- `site/tests/host-context.test.js`, `site/tests/api-client.test.js`, `site/tests/current-snapshot.test.js`, and existing UI contract tests: add the stable remediation cases and rerun full regression; controller-owned `tests/qc` and `tests/uat` remain read-only acceptance suites.

## Planning boundary

No `site/`, test, shared, controller, prior-run, Git, provider, deployment, lifecycle, backend, SQL, database, or issue-tracker artifact was modified. Authenticated live, exact-preview, real host-service, and browser visual/accessibility behavior was not executed or claimed in this planning stage.
