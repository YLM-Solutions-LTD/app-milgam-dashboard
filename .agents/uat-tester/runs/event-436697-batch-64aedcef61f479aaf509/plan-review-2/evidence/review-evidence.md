# Plan-review evidence and stable fingerprints

| Fingerprint | Concrete revision-2 evidence | UAT disposition |
|---|---|---|
| `uat:host-proof-required:exact-preview:v1` | Plan host boundary and `T-101`/`T-104`/`T-106` require parent-source binding, approved HTTPS parent/API origins, response binding, and zero privileged effects for negative modes. UAT-006 makes this an executable matrix. | Covered; final host proof still requires the exact authorized preview and approved host/harness. |
| `uat:equipment-classification-unavailable:v1` | Plan equipment section and `T-102`/`T-105` explicitly expose total/facts while withholding validity classification. UAT-002/UAT-011 verify this across unresolved facts. | Covered. |
| `uat:zero-vs-unavailable:v1` | Plan state model and `T-103`/`T-105` distinguish validated zero, first-load error, retained stale data, and unavailable classification. UAT-002/UAT-005/UAT-007 verify each state. | Covered. |
| `uat:performance-evidence:numeric-budgets:v2` | Plan and `T-101`–`T-107` define three calls, 50 ms start spread, 100 ms map ceiling, 10-refresh and 20-activation bursts, 80-element DOM ceiling, and 50 ms render ceilings. UAT-001/UAT-004/UAT-008/UAT-010/UAT-011/UAT-012 require recorded measurements. | Covered. |

No high-confidence critical plan defect or missing workflow coverage was found. Execution claims are intentionally absent at plan-review stage.
