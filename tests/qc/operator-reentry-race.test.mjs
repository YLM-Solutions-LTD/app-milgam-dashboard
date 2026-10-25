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

test("T-203/T-205: healthy concurrent verification shares a fresh handshake without reminting context", async () => {
  const { guestWindow, harness } = controllerFixture();
  const accepted = [];
  const bootstrap = createHostBootstrap({ windowObject: guestWindow, onContext: context => accepted.push(context), timeoutMs: 300 });
  try {
    const first = await bootstrap.connect();
    await tick();
    let handshakes = 0;
    const send = guestWindow.parent.postMessage;
    guestWindow.parent.postMessage = (message, origin) => {
      if (message.type === "Ready") handshakes += 1;
      send(message, origin);
    };
    const verified = await Promise.all(Array.from({ length: 20 }, () => bootstrap.verify()));
    assert.equal(handshakes, 1);
    assert.equal(accepted.length, 1);
    assert.ok(verified.every(result => result.context === first.context && result.client === first.client));
    assert.equal(isBoundHostContext(first.context), true);
  } finally { bootstrap.dispose(); harness.revoke(); }
});

test("T-203/T-205: silent bridge disposal denies authenticated work until distinct re-entry", async () => {
  const { guestWindow, harness } = controllerFixture();
  const accepted = [];
  const bootstrap = createHostBootstrap({ windowObject: guestWindow, onContext: context => accepted.push(context), timeoutMs: 80 });
  let authenticatedEffects = 0;
  const refresh = async () => { await bootstrap.verify(); authenticatedEffects += 3; };
  try {
    const first = await bootstrap.connect();
    harness.revoke();
    await assert.rejects(refresh(), error => error.code === "TIMEOUT");
    assert.equal(authenticatedEffects, 0);
    assert.equal(isBoundHostContext(first.context), false);
    await assert.rejects(refresh(), error => error.code === "HOST_REVOKED");
    assert.equal(authenticatedEffects, 0);
    harness.reenter();
    for (let attempt = 0; attempt < 30 && accepted.at(-1)?.Token.access_token !== "controller-synthetic-generation-2"; attempt += 1) await tick();
    await refresh();
    assert.equal(authenticatedEffects, 3);
    assert.equal(accepted.at(-1).Token.access_token, "controller-synthetic-generation-2");
  } finally { bootstrap.dispose(); harness.revoke(); }
});

test("T-203/T-205: re-entry cancels old verification without revoking the fresh generation", async () => {
  const { guestWindow, harness } = controllerFixture();
  const accepted = [];
  const bootstrap = createHostBootstrap({ windowObject: guestWindow, onContext: context => accepted.push(context), timeoutMs: 300 });
  try {
    const first = await bootstrap.connect();
    harness.revoke();
    const pending = bootstrap.verify();
    const rejected = assert.rejects(pending, error => ["DISPOSED", "SESSION_RESET"].includes(error.code));
    await tick();
    harness.reenter();
    await rejected;
    for (let attempt = 0; attempt < 30 && accepted.at(-1)?.Token.access_token !== "controller-synthetic-generation-2"; attempt += 1) await tick();
    const fresh = await bootstrap.verify();
    assert.equal(isBoundHostContext(first.context), false);
    assert.equal(isBoundHostContext(fresh.context), true);
    assert.equal(fresh.context.Token.access_token, "controller-synthetic-generation-2");
  } finally { bootstrap.dispose(); harness.revoke(); }
});

test("T-203/T-204/T-205: overlapping fresh re-entry recovers newest generation without unhandled disposal", async () => {
  const { guestWindow, harness } = controllerFixture();
  const accepted = [];
  const unhandled = [];
  const onUnhandled = (reason) => unhandled.push(reason);
  process.on("unhandledRejection", onUnhandled);
  const bootstrap = createHostBootstrap({ windowObject: guestWindow, onContext: context => accepted.push(context), timeoutMs: 300 });
  try {
    await bootstrap.connect();
    harness.reenter();
    queueMicrotask(() => harness.reenter());
    for (let attempt = 0; attempt < 30 && accepted.at(-1)?.Token.access_token !== "controller-synthetic-generation-3"; attempt += 1) {
      await tick();
    }
    assert.equal(accepted.at(-1)?.Token.access_token, "controller-synthetic-generation-3");
    assert.equal(isBoundHostContext(accepted.at(-1)), true);
    assert.equal(isBoundHostContext(accepted[0]), false, "the replaced generation must remain revoked");
    await new Promise(resolve => setTimeout(resolve, 20));
    assert.deepEqual(unhandled, [], "overlapping re-entry must consume every expected disposed/reset handshake rejection");
  } finally {
    process.removeListener("unhandledRejection", onUnhandled);
    bootstrap.dispose();
    harness.revoke();
  }
});
