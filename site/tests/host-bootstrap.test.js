import test from "node:test";
import assert from "node:assert/strict";
import { createHostBootstrap } from "../host-bootstrap.js";
import { revokeHostContext, validateHostContext } from "../host-context.js";

function fixture() {
  const listeners = new Map();
  const parent = {};
  const contexts = [];
  class VerifiedClient {
    constructor(options) { this.options = options; this.disposed = false; VerifiedClient.instances.push(this); }
    on() { return () => {}; }
    ready() { return Promise.resolve({ ApiAddress: "https://localhost:5721", Token: { access_token: `synthetic-${VerifiedClient.instances.length}` } }); }
    executeCommand() { return Promise.resolve(); }
    dispose() { this.disposed = true; }
  }
  VerifiedClient.instances = [];
  const windowObject = {
    parent,
    SimplyVibeClient: VerifiedClient,
    location: { ancestorOrigins: ["https://localhost:5500"] },
    document: { referrer: "" },
    addEventListener: (name, handler) => listeners.set(name, handler),
    removeEventListener: (name, handler) => { if (listeners.get(name) === handler) listeners.delete(name); }
  };
  const bootstrap = createHostBootstrap({ windowObject, onContext: (context) => contexts.push(context), timeoutMs: 50 });
  return { bootstrap, contexts, listeners, parent, windowObject, VerifiedClient };
}

test("verified SDK bootstrap binds exact browser parent origin and keeps ordinary reconnect idempotent", async () => {
  const { bootstrap, contexts, VerifiedClient } = fixture();
  const first = await bootstrap.connect();
  assert.equal(VerifiedClient.instances[0].options.hostOrigin, "https://localhost:5500");
  assert.equal(validateHostContext(first.context), true);
  const second = await bootstrap.reconnect();
  assert.equal(second.context, first.context);
  assert.equal(VerifiedClient.instances.length, 1);
  assert.equal(validateHostContext(first.context), true);
  assert.equal(validateHostContext(second.context), true);
  assert.equal(contexts.length, 1);
  bootstrap.dispose();
  assert.equal(validateHostContext(second.context), false);
});

test("HTTP authorization rejection taints the unchanged session until a distinct Ready source re-enters", async () => {
  const { bootstrap, listeners, parent, VerifiedClient, contexts } = fixture();
  const receive = listeners.get("message");
  receive({ source: parent, origin: "https://localhost:5500", data: { protocol: "SimplyVibe", version: 1, type: "Ready", source: "host", payload: { source: "generation-1" } } });
  const first = await bootstrap.connect();
  revokeHostContext(first.context, "http-401");
  await assert.rejects(bootstrap.reconnect(), (error) => error.code === "HOST_REVOKED");
  assert.equal(VerifiedClient.instances.length, 1, "unchanged session must not mint a replacement client");
  receive({ source: parent, origin: "https://localhost:5500", data: { protocol: "SimplyVibe", version: 1, type: "Ready", source: "host", payload: { source: "generation-2" } } });
  await new Promise((resolve) => setTimeout(resolve, 0));
  assert.equal(VerifiedClient.instances.length, 2);
  assert.equal(contexts.length, 2, "fresh session automatically creates one application generation");
  assert.equal(validateHostContext(contexts[1]), true);
  bootstrap.dispose();
});

test("host session-source replacement revokes the active SDK generation", async () => {
  const { bootstrap, listeners, parent, VerifiedClient } = fixture();
  const first = await bootstrap.connect();
  const receive = listeners.get("message");
  receive({ source: parent, origin: "https://localhost:5500", data: { protocol: "SimplyVibe", version: 1, type: "Ready", requestId: "ready-1", source: "host", payload: { source: "generation-1" } } });
  receive({ source: parent, origin: "https://localhost:5500", data: { protocol: "SimplyVibe", version: 1, type: "Ready", requestId: null, source: "host", payload: { source: "generation-2" } } });
  await new Promise((resolve) => setTimeout(resolve, 0));
  assert.equal(validateHostContext(first.context), false);
  assert.equal(VerifiedClient.instances[0].disposed, true);
  bootstrap.dispose();
});
