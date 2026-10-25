# UAT traceability — plan revision 5

| Task | Acceptance cases |
|---|---|
| `T-201` | UAT-201, UAT-202, UAT-210 |
| `T-202` | UAT-203, UAT-207, UAT-210 |
| `T-203` | UAT-201 through UAT-210 |
| `T-204` | UAT-201 through UAT-207, UAT-210 |
| `T-205` | UAT-202, UAT-206, UAT-208, UAT-209, UAT-210 |

Every task has positive acceptance plus negative, recovery, responsive/accessibility, or evidence-boundary coverage. Cross-task workflows cover authenticated entry, enabled configuration, analytics independence, CSP-safe charts, strict report semantics, refresh races, responsive performance, permit navigation, authorization revocation/re-entry, and release handoff.

The evidence tiers are deliberately non-substitutable: local deterministic results cannot prove the exact deployed artifact; standalone/synthetic preview fixtures cannot prove real authorization lifecycle behavior; and approved-host evidence does not authorize deployment or release.
