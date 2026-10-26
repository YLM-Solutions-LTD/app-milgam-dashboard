# Implementer approach — implementation-planning cycle 1

Planning only. No application source, shared artifact, other role home, controller input, prior run, Git metadata, provider, tenant, deployment, or lifecycle state was changed.

## Frozen scope

- Batch: `event-436697-batch-b48436fc6cafd492b70f`
- Plan: revision 12
- Tasks: `T-301`, `T-302`, `T-303`, `T-304`, `T-305`
- Ordered frozen actions: `570021`
- `includeDescription=false`; the event Description is background only.
- Runtime work remains browser-only under `site/`; release and external effects remain controller-owned.

## Planning method

1. Read the frozen request/event, private controller history, shared board, planner report, accepted cycle-3 UI/security/performance/UAT reviews, controller-host-harness contract, builder release-footer contract/assets, host-services reference, API guidance, and implementer checklist.
2. Reproduced the current source seams without changing them: month-only analytical bounds and selectors, coupled refresh authorization path, number-only snapshot aggregate parsing, and absent release footer/assets.
3. Rediscovered all applicable `*.test.{js,mjs,cjs}` and `*.spec.{js,mjs,cjs}` files before running the configured suites. No CJS or spec files exist in the current inventory.
4. Ran the configured site command and complete explicit QC, UAT, and controller-harness inventories. These are baseline regressions; their pass status does not claim T-301, T-303, or T-305 is implemented.
5. Produced a task-ID-traceable HTML/CSS/JS implementation and verification plan. Existing defects are requirements for the implementation stage, not completed fixes.

## Decision

The work is concrete and implementable with no missing browser/server contract. Verdict is `approve_with_findings`: implementation planning may proceed, while the four reproduced current-source defects remain mandatory implementation requirements. The denied deployed preview was not accessed, no real tenant traffic was attempted, and synthetic fixture permissions are not tenant or release evidence.
