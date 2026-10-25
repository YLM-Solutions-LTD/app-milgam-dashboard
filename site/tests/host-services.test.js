import test from "node:test";
import assert from "node:assert/strict";

import { contextFromMessage, revokeHostContext } from "../host-context.js";
import { createHostServices } from "../host-services.js";

function bindContext() {
  const parent = {};
  return contextFromMessage({
    source: parent,
    origin: "https://localhost:5500",
    data: { ApiAddress: "https://localhost:5721", Token: { access_token: "synthetic" } }
  }, ["https://localhost:5500"], parent);
}

test("host services reject commands after capability revocation", async () => {
  let commands = 0;
  const context = bindContext();
  const services = createHostServices(context, {
    ready: async () => ({}),
    executeCommand: async () => { commands += 1; },
    ToDisplayDate: (value) => `shown:${value}`
  });
  assert.equal(services.toDisplayDate("raw"), "shown:raw");
  revokeHostContext(context);
  await assert.rejects(services.ready(), (error) => error.code === "HOST_REVOKED");
  await assert.rejects(services.executeCommand("Navigate", {}), (error) => error.code === "HOST_REVOKED");
  assert.throws(() => services.toDisplayDate("raw"), (error) => error.code === "HOST_REVOKED");
  assert.equal(commands, 0);
});

test("late command completion is rejected when its generation is revoked", async () => {
  let release;
  const context = bindContext();
  const services = createHostServices(context, {
    ready: async () => ({}),
    executeCommand: () => new Promise((resolve) => { release = resolve; })
  });
  const pending = services.executeCommand("Navigate", { Url: "#/Permits/Dashboard" });
  revokeHostContext(context);
  release({ ok: true });
  await assert.rejects(pending, (error) => error.code === "HOST_REVOKED");
});
