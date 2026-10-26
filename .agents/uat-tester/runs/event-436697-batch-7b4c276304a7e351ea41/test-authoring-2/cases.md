# Cycle 2 deterministic UAT cases

The canonical workflows remain `UAT-201`–`UAT-210`. Cycle 2 retains all 13 earlier assertions and adds three acceptance tests:

- `UAT-206` (`T-203`, `T-204`, `T-205`): load the packaged SDK, prove it is byte-identical to the controller-supplied SDK, initialize it from the corrected browser-established parent origin, complete the actual Ready exchange through the supplied GuestBridge, and issue exactly `Navigate` with `{Url:"#/Permits/Dashboard"}`. Expected: one generation-1 effect and parent hash `/Permits/Dashboard`.
- `UAT-208/UAT-209` (`T-203`, `T-205`): hold a real bridge command, revoke/rotate the bridge session, then release the old command. Expected: old command rejects, zero old-generation effects, old services remain unusable, a fresh SDK-bound capability appears, and only its generation-2 Navigate succeeds.
- `UAT-205` (`T-203`, `T-204`): return a synthetic HTTP 500 JSON body with distinctive personal/internal markers through the SDK-bound API client. Expected: error kind/status/byte metadata remain available while markers are absent from console capture and serialized error.

Retained cases cover exact three-route `{}` snapshot transport, analytics independence, CSP-safe chart source, strict mapping/deduplication, stale-generation suppression, explicit failures without fabricated zeros, bidi/accessibility contracts, 10-refresh behavior, and 10,000-row mapping.

Not executed at test-authoring: exact Pages preview bytes, browser geometry, runtime CSP/network observations, and real tenant permission configuration. The faithful local controller harness proves protocol wiring, not tenant authorization.
