# Test inventory evidence (plan-review discovery only)

Discovery command used:

```sh
find /workspace/src/apps/milgam-dashboard -type f \( -name '*.test.js' -o -name '*.test.mjs' -o -name '*.test.cjs' -o -name '*.spec.js' -o -name '*.spec.mjs' -o -name '*.spec.cjs' \) -print | sort
find /workspace/.simplyvibe/input/controller-host-harness -type f \( -name '*.test.js' -o -name '*.test.mjs' -o -name '*.test.cjs' -o -name '*.spec.js' -o -name '*.spec.mjs' -o -name '*.spec.cjs' \) -print | sort
```

Discovered inventory: 15 application tests plus 1 harness test.

- Site JS (9): `api-client`, `current-snapshot`, `dashboard-data`, `dashboard-machine`, `data-mappers`, `host-bootstrap`, `host-context`, `host-services`, `ui-contract` under `site/tests/*.test.js`.
- QC (3): `operator-reentry-race.test.mjs`, `sdk-bridge-qc.test.mjs`, `snapshot-qc.test.js`.
- UAT (2): `current-snapshot.uat.test.mjs`, `verified-host-bridge.uat.test.mjs`.
- Controller harness (1): `host-fixture.test.mjs`.
- No `.test.cjs` or `.spec.{js,mjs,cjs}` files were present at plan-review discovery time.

Configured site command discovered from `site/package.json`: `(cd site && npm test)`, which runs `node --test tests/*.test.js`. Final execution must rediscover before running and construct explicit QC/UAT/harness file lists from that fresh inventory. No suite was executed and no passing claim is made during plan review.

