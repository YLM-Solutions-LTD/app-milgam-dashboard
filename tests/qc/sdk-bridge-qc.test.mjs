import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";

import { createHostBootstrap } from "../../site/host-bootstrap.js";
import { createHostServices } from "../../site/host-services.js";
import { isBoundHostContext } from "../../site/host-context.js";

const read = (url) => fs.readFileSync(url, "utf8");
const packagedClientUrl = new URL("../../site/assets/simplyvibe-client.js", import.meta.url);
const suppliedClientUrl = new URL("../../../../../.simplyvibe/input/controller-host-harness/vendor/simplyvibe-client.js", import.meta.url);
const guestBridgeUrl = new URL("../../../../../.simplyvibe/input/controller-host-harness/vendor/guest-bridge.js", import.meta.url);
const hostFixtureUrl = new URL("../../../../../.simplyvibe/input/controller-host-harness/host-fixture.js", import.meta.url);
const tick = () => new Promise((resolve) => setTimeout(resolve, 10));

function controllerFixture() {
  const hostHandlers = new Set();
  const guestHandlers = new Set();
  const loadHandlers = new Set();
  const hostOrigin = "https://milgam.ylm.co.il";
  const guestOrigin = "https://fixture.app-milgam-dashboard.pages.dev";
  const hostLocation = {
    href: `${hostOrigin}/controller-host-fixture/index.html`,
    search: `?preview=${encodeURIComponent(guestOrigin)}`,
    hash: ""
  };
  const hostWindow = {
    location: hostLocation,
    addEventListener(name, handler) { if (name === "message") hostHandlers.add(handler); },
    removeEventListener(name, handler) { if (name === "message") hostHandlers.delete(handler); }
  };
  const parent = {
    postMessage(data, origin) {
      assert.equal(origin, hostOrigin);
      queueMicrotask(() => hostHandlers.forEach((handler) => handler({ source: frameWindow, origin: guestOrigin, data })));
    }
  };
  const guestWindow = {
    parent,
    location: { ancestorOrigins: [hostOrigin] },
    document: { referrer: `${hostOrigin}/controller-host-fixture/` },
    addEventListener(name, handler) { if (name === "message") guestHandlers.add(handler); },
    removeEventListener(name, handler) { if (name === "message") guestHandlers.delete(handler); }
  };
  const frameWindow = {
    postMessage(data, origin) {
      assert.equal(origin, guestOrigin);
      queueMicrotask(() => guestHandlers.forEach((handler) => handler({ source: parent, origin: hostOrigin, data })));
    }
  };
  const frame = {
    contentWindow: frameWindow,
    addEventListener(name, handler) { if (name === "load") loadHandlers.add(handler); },
    removeEventListener(name, handler) { if (name === "load") loadHandlers.delete(handler); },
    dispatchEvent() { loadHandlers.forEach((handler) => handler()); }
  };
  const hostContext = vm.createContext({
    window: hostWindow,
    SimplyLog: {},
    location: hostLocation,
    document: { getElementById: () => frame },
    URL,
    URLSearchParams,
    Promise,
    Event: class {},
    console
  });
  vm.runInContext(read(guestBridgeUrl), hostContext);
  vm.runInContext(read(hostFixtureUrl), hostContext);
  vm.runInNewContext(read(packagedClientUrl), { window: guestWindow, URL, Promise, setTimeout, clearTimeout, console });
  frame.dispatchEvent();
  return { guestWindow, hostLocation, harness: hostWindow.controllerHarness };
}

test("T-203/T-204: packaged SDK is byte-identical to the supplied verified SDK and no adapter global is used", () => {
  assert.deepEqual(fs.readFileSync(packagedClientUrl), fs.readFileSync(suppliedClientUrl));
  const source = read(packagedClientUrl);
  assert.match(source, /root\.SimplyVibeClient = SimplyVibeClient/);
  assert.doesNotMatch(source, /SimplyVibeHostAdapter/);
});

test("T-203/T-204/T-205: real packaged SDK bootstrap performs Ready and exact Navigate through GuestBridge", async () => {
  const { guestWindow, hostLocation, harness } = controllerFixture();
  let accepted;
  const bootstrap = createHostBootstrap({
    windowObject: guestWindow,
    onContext: (context, client) => { accepted = { context, client }; },
    timeoutMs: 300
  });
  try {
    const connected = await bootstrap.connect();
    assert.equal(connected.context, accepted.context);
    assert.equal(connected.client, accepted.client);
    assert.equal(isBoundHostContext(connected.context), true);
    assert.equal(connected.context.ApiAddress, "https://api.ylm.co.il");
    assert.equal(connected.context.Token.access_token, "controller-synthetic-generation-1");
    const services = createHostServices(connected.context, connected.client);
    assert.equal(services.available, true);
    await services.ready();
    await services.executeCommand("Navigate", { Url: "#/Permits/Dashboard" });
    assert.equal(hostLocation.hash, "/Permits/Dashboard");
    assert.equal(harness.effects.length, 1);
    assert.equal(harness.effects[0].name, "Navigate");
    assert.equal(harness.effects[0].url, "#/Permits/Dashboard");
    assert.equal(harness.effects[0].generation, 1);
  } finally {
    bootstrap.dispose();
    harness.revoke();
  }
});

test("T-203/T-205: bridge session rotation rejects the old pending command and fresh SDK re-entry alone recovers", async () => {
  const { guestWindow, harness } = controllerFixture();
  const bootstrap = createHostBootstrap({ windowObject: guestWindow, timeoutMs: 300 });
  try {
    const first = await bootstrap.connect();
    const firstServices = createHostServices(first.context, first.client);
    harness.holdCommand();
    const pending = firstServices.executeCommand("Navigate", { Url: "#/Permits/Dashboard" });
    const rejected = assert.rejects(pending, (error) => ["SESSION_RESET", "HOST_REVOKED", "DISPOSED"].includes(error.code));
    await tick();
    harness.revoke();
    harness.reenter();
    await rejected;
    harness.releaseCommand();
    await tick();
    assert.equal(harness.effects.length, 0, "old command must have zero navigation effects");
    assert.equal(isBoundHostContext(first.context), false, "old application capability must be revoked");
    await assert.rejects(
      firstServices.executeCommand("Navigate", { Url: "#/Permits/Dashboard" }),
      (error) => error.code === "HOST_REVOKED"
    );

    const fresh = await bootstrap.reconnect();
    assert.notEqual(fresh.context, first.context);
    assert.equal(fresh.context.Token.access_token, "controller-synthetic-generation-2");
    const freshServices = createHostServices(fresh.context, fresh.client);
    await freshServices.executeCommand("Navigate", { Url: "#/Permits/Dashboard" });
    assert.equal(harness.effects.length, 1);
    assert.equal(harness.effects[0].generation, 2);
  } finally {
    bootstrap.dispose();
    harness.revoke();
  }
});
