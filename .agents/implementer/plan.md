# Implementation plan

Batch: `event-436697-batch-64aedcef61f479aaf509`  
Cycle: `implementation-2`  
Frozen actions: `536946`, `536949`, `537034`, `537037`, `537040` (`includeDescription=false`)

- [x] T-101: Added immutable private-brand host capability; gated API/host services; made generic equipment envelopes shape-only while preserving exact `{}` searches and fixed event/permit row counts.
- [x] T-102: Applied strict dataset cardinality and post-dedup equipment population reconciliation; identical duplicates pass and conflicting duplicates fail.
- [x] T-103: Reconfirmed independent abortable snapshot lifecycle, current-generation commit, stale last-good retention, and period separation through regression/QC/UAT.
- [x] T-104: Reconfirmed bound host date/navigation services, unchanged raw dates, exact permit URL, shared pending lock, and safe recovery.
- [x] T-105: Preserved responsive accessible aggregate-only snapshot UI and existing analytical dashboard in RTL/LTR.
- [x] T-106: Added remediation regressions and passed focused, full, QC/UAT, trust, and numeric mapper performance checks.
- [x] T-107: Left the live-call flag false and recorded local evidence plus honest unavailable live/browser limitations.

Implementation order: `T-101` → `T-102` → `T-103`/`T-104` regressions → `T-105` preservation → `T-106` verification → `T-107` evidence.
