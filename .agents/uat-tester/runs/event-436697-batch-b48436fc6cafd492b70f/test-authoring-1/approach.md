# UAT test-authoring approach

- Batch: `event-436697-batch-b48436fc6cafd492b70f`; plan revision 12; action `570021`; description excluded.
- Apply workflows to `T-301` through `T-305` using deterministic local fixtures only.
- Exercise public behavior and source contracts without modifying the app or contacting any tenant/deployed origin.
- Inventory every `*.test.{js,mjs,cjs}` and `*.spec.{js,mjs,cjs}` before running complete site, UAT, QC, and controller-harness suites.
- Record limitations honestly: test-authoring does not prove exact preview, real tenant permissions, deployed metadata, or controller release readiness.
