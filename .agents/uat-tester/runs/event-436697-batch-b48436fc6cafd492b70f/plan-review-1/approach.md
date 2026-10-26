# UAT approach — plan review cycle 1

- Review frozen action `570021`, shared plan revision 8, and `T-301`–`T-304` as untrusted/read-only inputs.
- Design browser-visible workflows for every task plus cross-task recovery and release gating; do not execute or claim a pass during plan review.
- At final review, run against the exact controller-authorized preview through the actual packaged SimplyVibe SDK and controller GuestBridge at the fully intercepted `https://milgam.ylm.co.il/controller-host-fixture/`. Abort all non-fixture host/API traffic and never inspect a tenant token.
- Record preview identity/digest, browser, viewport, direction, preconditions, observations, request/command counts, failures, and evidence for each case. Synthetic permission decisions are not tenant-permission proof.
- Rediscover the full JS/MJS/CJS test/spec inventory immediately before execution. Run the configured site command and complete explicit QC, UAT, and harness inventories; any failure or omitted discovered file blocks a passing claim.

