# Security preview-review approach

1. Confirm exact candidate source identity and inspect every T-301–T-305 security-relevant path read-only.
2. Inventory and run the complete configured test suites without extension omissions; preserve exact commands and results.
3. Exercise the exact preview through the controller-owned, locally intercepted real SDK/GuestBridge harness and synthetic API fixtures only.
4. Test accepted host context, rejected/direct context, bearer/API confinement, generation revocation/re-entry, exact Navigate, bounded diagnostics, and all-state footer provenance.
5. Report only reproducible defects with stable fingerprints; distinguish synthetic fixture evidence from tenant permissions and controller release authority.
