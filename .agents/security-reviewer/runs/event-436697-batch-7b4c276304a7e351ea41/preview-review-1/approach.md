# Preview security review approach

- Review the exact controller-supplied preview and matching source at head `ea974089c5cfa402a44b99606514721807b49dd8` read-only.
- Cover every shared task ID `T-201` through `T-205` against the iframe trust boundary.
- Use only synthetic parent messages, bearer values, and intercepted API route fixtures; never use a real tenant token.
- Inspect host source/origin validation, API-origin confinement, token handling, direct/fallback denial, request and command generation binding, DOM injection sinks, navigation, storage, CSP, and executable origins.
- Record only reproducible or well-supported defects with stable fingerprints and conservative severity/confidence.
