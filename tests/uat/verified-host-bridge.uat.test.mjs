import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import vm from "node:vm";

import { createHostBootstrap } from "../../site/host-bootstrap.js";
import { createHostServices } from "../../site/host-services.js";
import { createApiClient } from "../../site/api-client.js";

const hostOrigin = "https://milgam.ylm.co.il";
const guestOrigin = "https://fixture.app-milgam-dashboard.pages.dev";
const tick = () => new Promise((resolve) => setTimeout(resolve, 10));

async function faithfulFixture() {
  const [bridgeSource, harnessSource, packagedSdkSource, suppliedSdkSource] = await Promise.all([
    readFile(new URL("../../../../../.simplyvibe/input/controller-host-harness/vendor/guest-bridge.js", import.meta.url), "utf8"),
    readFile(new URL("../../../../../.simplyvibe/input/controller-host-harness/host-fixture.js", import.meta.url), "utf8"),
    readFile(new URL("../../site/assets/simplyvibe-client.js", import.meta.url), "utf8"),
    readFile(new URL("../../../../../.simplyvibe/input/controller-host-harness/vendor/simplyvibe-client.js", import.meta.url), "utf8")
  ]);
  assert.equal(packagedSdkSource, suppliedSdkSource, "packaged SDK must be the controller-supplied verified SDK");

  const hostHandlers = new Set();
  const guestHandlers = new Set();
  const loadHandlers = new Set();
  const host = {
    location: { href: `${hostOrigin}/controller-host-fixture/`, search: `?preview=${encodeURIComponent(guestOrigin)}`, hash: "" },
    addEventListener: (name, handler) => { if (name === "message") hostHandlers.add(handler); },
    removeEventListener: (name, handler) => hostHandlers.delete(handler)
  };
  const parent = { postMessage(data, origin) {
    assert.equal(origin, hostOrigin);
    queueMicrotask(() => hostHandlers.forEach((handler) => handler({ source: frameWindow, origin: guestOrigin, data })));
  }};
  const frameWindow = { postMessage(data, origin) {
    assert.equal(origin, guestOrigin);
    queueMicrotask(() => guestHandlers.forEach((handler) => handler({ source: parent, origin: hostOrigin, data })));
  }};
  const frame = {
    contentWindow: frameWindow,
    addEventListener: (name, handler) => { if (name === "load") loadHandlers.add(handler); },
    removeEventListener: (_name, handler) => loadHandlers.delete(handler),
    dispatchEvent: () => loadHandlers.forEach((handler) => handler())
  };
  const guest = {
    parent,
    location: { ancestorOrigins: [hostOrigin] },
    document: { referrer: `${hostOrigin}/controller-host-fixture/` },
    addEventListener: (name, handler) => { if (name === "message") guestHandlers.add(handler); },
    removeEventListener: (_name, handler) => guestHandlers.delete(handler)
  };
  const hostContext = vm.createContext({
    window: host,
    SimplyLog: {},
    location: host.location,
    document: { getElementById: () => frame },
    URL,
    URLSearchParams,
    Promise,
    Event: class {},
    console
  });
  vm.runInContext(bridgeSource, hostContext);
  vm.runInContext(harnessSource, hostContext);
  vm.runInNewContext(packagedSdkSource, { window: guest, URL, Promise, setTimeout, clearTimeout, console });
  frame.dispatchEvent({ type: "load" });

  const contexts = [];
  const revoked = [];
  const bootstrap = createHostBootstrap({
    windowObject: guest,
    timeoutMs: 300,
    onContext: (context, client) => contexts.push({ context, client }),
    onRevoked: (reason) => revoked.push(reason)
  });
  const connected = await bootstrap.connect();
  return { bootstrap, connected, contexts, revoked, harness: host.controllerHarness, host };
}

test("UAT-206 packaged verified SDK reaches the real GuestBridge Navigate path", async () => {
  const fixture = await faithfulFixture();
  try {
    const services = createHostServices(fixture.connected.context, fixture.connected.client);
    assert.equal(services.available, true);
    await services.ready();
    await services.executeCommand("Navigate", { Url: "#/Permits/Dashboard" });
    assert.equal(fixture.host.location.hash, "/Permits/Dashboard");
    assert.deepEqual(Array.from(fixture.harness.effects, (effect) => ({ name: effect.name, url: effect.url, generation: effect.generation })), [
      { name: "Navigate", url: "#/Permits/Dashboard", generation: 1 }
    ]);
  } finally {
    fixture.bootstrap.dispose();
    fixture.harness.revoke();
  }
});

test("UAT-208/UAT-209 bridge revocation denies old commands and requires fresh SDK generation", async () => {
  const fixture = await faithfulFixture();
  try {
    const oldServices = createHostServices(fixture.connected.context, fixture.connected.client);
    fixture.harness.holdCommand();
    const pending = oldServices.executeCommand("Navigate", { Url: "#/Permits/Dashboard" });
    await tick();
    fixture.harness.revoke();
    fixture.harness.reenter();
    await assert.rejects(pending, (error) => ["SESSION_RESET", "DISPOSED", "HOST_REVOKED"].includes(error.code));
    fixture.harness.releaseCommand();
    await tick();
    assert.equal(fixture.harness.effects.length, 0, "old-generation command must have zero effects");
    await assert.rejects(oldServices.executeCommand("Navigate", { Url: "#/Permits/Dashboard" }), /authorization|disposed|session/i);

    for (let attempt = 0; attempt < 30 && fixture.contexts.length < 2; attempt += 1) await tick();
    assert.equal(fixture.contexts.length, 2, "session rotation must create a fresh verified SDK capability");
    const fresh = fixture.contexts[1];
    await createHostServices(fresh.context, fresh.client).executeCommand("Navigate", { Url: "#/Permits/Dashboard" });
    assert.equal(fixture.harness.effects.length, 1);
    assert.equal(fixture.harness.effects[0].generation, 2);
  } finally {
    fixture.bootstrap.dispose();
    fixture.harness.revoke();
  }
});

test("UAT-205 synthetic API error bodies stay out of logs and serialized errors", async () => {
  const fixture = await faithfulFixture();
  const marker = "UAT_PRIVATE_PERSON_MARKER_DO_NOT_LOG";
  const observed = [];
  const originalError = console.error;
  console.error = (...args) => observed.push(args);
  try {
    const client = createApiClient(fixture.connected.context, {
      fetchImpl: async () => new Response(JSON.stringify({ person: marker, internal: "restricted-detail" }), { status: 500 })
    });
    await assert.rejects(client.requestItems("periods", { FromDate: "2026-01-01T00:00:00", ToDate: "2026-01-31T23:59:59" }), (error) => {
      assert.equal(error.kind, "http");
      assert.doesNotMatch(JSON.stringify(error), new RegExp(marker));
      return true;
    });
    assert.doesNotMatch(JSON.stringify(observed), new RegExp(marker));
  } finally {
    console.error = originalError;
    fixture.bootstrap.dispose();
    fixture.harness.revoke();
  }
});
