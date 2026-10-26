# Preview security review approach

- Review the exact controller-supplied preview `https://02ea3f16.app-milgam-dashboard.pages.dev` and matching source at head `3b3f8d4373ff90c2073fb4e884e1fe622a8595a0` read-only.
- Cover every shared task ID `T-201` through `T-205` against the iframe trust boundary.
- Use the controller-owned, unmodified GuestBridge fixture with actual guest SDK initialization and synthetic bearer/API fixtures; never inject or fake the guest adapter/readiness/command methods and never use a real tenant token.
- Inspect host source/origin validation, API-origin confinement, token handling, direct/fallback denial, request and command generation binding, DOM injection sinks, navigation, storage, CSP, and executable origins.
- Reproduce host disconnect/re-entry and in-flight command/API expiry where supported, and report unsupported gates honestly.
- Record only reproducible or well-supported defects with stable fingerprints and conservative severity/confidence.
