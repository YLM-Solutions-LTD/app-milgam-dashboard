# QC planning input manifest

- Batch: `event-436697-batch-64aedcef61f479aaf509`
- App: `milgam-dashboard`
- Stage/cycle: `implementation-planning` / `1`
- Frozen action IDs: `536946`, `536949`, `537034`, `537037`, `537040`
- Description: excluded (`includeDescription=false`)
- Review type: read-only plan/source inspection, attempt 2; no exact preview was supplied and no checks were executed.

| Read-only input | SHA-256 |
|---|---|
| `.agents/shared/plan.md` | `546ec3a041d541b04c0a01b7ccfa8e86ea940fd0ded0268d36b396a8725b0965` |
| `.agents/shared/tasks.json` | `298361e7dc194d0cba4e2b3f9937f80468c1934d6f7139e491286758dc1553f0` |
| planner planning-2 report | `2c44d361d2e26052bc92fd7943dd34fe094b6ac109542a66e03a75ba4fad2225` |
| UI plan-review-2 report | `01151168bdbc4697dd0e7c0183e4f46d4a048ec58c9db0b925f8412f1eeb9026` |
| UI approach | `af010382e753c83e70087eb2e5e38ac601dd98db6f1d63f147487321e93c0e` |
| UI design specification | `efffc7b02a184b9284d081b8e098eca301fc5a2bbd7c620cbffe684b5da0bf61` |
| security plan-review-2 report | `d8385cc3a03d4eac8d879516e58261e716e0b9747d25f1f7015b51073410c78b` |
| performance plan-review-2 report | `11590a9d6dff7057ced4a0a7d788f48d387896341fdcb75fe642221e99547fd2` |
| UAT plan-review-2 report | `77ba7f56281b51d6ce1e699e37b2ca220c3344e09b9d91df90bfb971580d0063` |
| UAT cases | `706e11ddf358e04e2fb941eb6374a489e137da2bd09e8b3e9abba79400191d26` |
| UAT traceability | `e2bf264d8e8efb3cb214e155f609f69fd82a3902d75f5dd4ce9c30ee39b4e950` |

The inspected pre-implementation `site/` manifest digest was `9ae0e16597d486eb9db97aa7c396057cb3f5cefe3521a09b6f03f83e3f6c6f07` (SHA-256 of sorted per-file SHA-256 lines, excluding `node_modules`). It records planning context only and is not a preview identity or implementation result.

Accepted visual reference inspected read-only: `.agents/ui-designer/runs/event-436697-batch-64aedcef61f479aaf509/plan-review-2/evidence/current-snapshot-responsive-reference.png`. Its illustrative values/copy are not test oracles; the shared plan, task board, and design specification are canonical.

Attempt-2 read-only source hashes used by `source-seams.md`:

| Source | SHA-256 |
|---|---|
| `site/constants.js` | `c2e142906d853f6025ab5be2f856494baaeff5670989d9252ae3d331a6f31f70` |
| `site/api-client.js` | `31abf4ee6a1c1821cfcf184a86f7691a9d3801ee38533c55fa51c8a58ff32b0e` |
| `site/host-context.js` | `f42c9f40c398646f1bfec73624808506c194c58ab62f913bbce881be77ac54b4` |
| `site/dashboard-data.js` | `9e4cb18656d6836cb0663e3e468e16a7c75c15d20ed1e9951c368b5246339487` |
| `site/data-mappers.js` | `5b545cc9ce6feec7ce9d57e36e46ce4e1130232e4bd3d7f5870912ad4a18d60c` |
| `site/dashboard-machine.js` | `8e8b94309e6d91d4b97f45513af48faa9da6cffcb701c3d735f546d86cd3fc0f` |
| `site/index.html` | `66a2241944197f9f39e1761a2ffec19f5a85975fec7f8495d25bcfc02607c1d4` |
| `site/app.js` | `f544fa93c2296ce8d5717a3f6263ee171c17cf1ae2dc5342a503ad6843c73e7e` |
| `site/app.css` | `4737a8bc08c3a127889541a422b57690a035988e96976daee6bff9d33ffaa3ce` |
