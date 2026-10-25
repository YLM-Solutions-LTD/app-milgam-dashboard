import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import vm from "node:vm";

import { createHostBootstrap } from "../../site/host-bootstrap.js";
import { createHostServices } from "../../site/host-services.js";
import { createApiClient } from "../../site/api-client.js";
import { loadCurrentSnapshot } from "../../site/current-snapshot.js";

const hostOrigin = "https://milgam.ylm.co.il";
const guestOrigin = "https://fixture.app-milgam-dashboard.pages.dev";
const tick = () => new Promise((resolve) => setTimeout(resolve, 10));

async function faithfulFixture({ onContext } = {}) {
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
    onContext: (context, client) => {
      contexts.push({ context, client });
      onContext?.(context, client);
    },
    onRevoked: (reason) => revoked.push(reason)
  });
  const connected = await bootstrap.connect();
  return { bootstrap, connected, contexts, revoked, harness: host.controllerHarness, host, guest };
}

test("UAT-208 healthy verification burst shares one live SDK handshake", async () => {
  const fixture = await faithfulFixture();
  try {
    await tick();
    let readyRequests = 0;
    const send = fixture.guest.parent.postMessage;
    fixture.guest.parent.postMessage = (message, origin) => {
      if (message.type === "Ready") readyRequests += 1;
      send(message, origin);
    };
    const verified = await Promise.all(Array.from({ length: 20 }, () => fixture.bootstrap.verify()));
    assert.equal(readyRequests, 1, "concurrent user effects must share one live verification handshake");
    assert.ok(verified.every(({ context, client }) => context === fixture.connected.context && client === fixture.connected.client));
    assert.equal(fixture.contexts.length, 1, "verification must not remint application authority");
  } finally {
    fixture.bootstrap.dispose();
    fixture.harness.revoke();
  }
});

test("UAT-208 silent bridge loss blocks effects until distinct controller re-entry", async () => {
  const fixture = await faithfulFixture();
  let authenticatedEffects = 0;
  const userRefresh = async () => {
    await fixture.bootstrap.verify();
    authenticatedEffects += 3;
  };
  try {
    fixture.harness.revoke();
    await assert.rejects(userRefresh(), (error) => error.code === "TIMEOUT");
    await assert.rejects(userRefresh(), (error) => error.code === "HOST_REVOKED");
    assert.equal(authenticatedEffects, 0, "a silently disconnected generation must perform zero authenticated work");

    fixture.harness.reenter();
    for (let attempt = 0; attempt < 30 && fixture.contexts.at(-1)?.context.Token.access_token !== "controller-synthetic-generation-2"; attempt += 1) await tick();
    await userRefresh();
    assert.equal(fixture.contexts.at(-1)?.context.Token.access_token, "controller-synthetic-generation-2");
    assert.equal(authenticatedEffects, 3, "only distinct fresh bridge re-entry may resume the three-report workflow");
  } finally {
    fixture.bootstrap.dispose();
    fixture.harness.revoke();
  }
});

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

test("UAT-208 fresh bridge re-entry automatically starts all three snapshot routes", async () => {
  const paths = [];
  let firstContext;
  let bootstrap;
  const fixture = await faithfulFixture();
  try {
    bootstrap = fixture.bootstrap;
    firstContext = fixture.connected.context;
    const loadForContext = async (context) => loadCurrentSnapshot(createApiClient(context, {
      fetchImpl: async (url) => {
        paths.push(new URL(url).pathname);
        if (url.includes("CurrentEvents")) return new Response(JSON.stringify({ Items: [
          { ScopeKey: "overall", TotalCount: 3, OpenCount: 1, AsOf: "2026-10-25" },
          { ScopeKey: "headquarters", TotalCount: 1, OpenCount: 0, AsOf: "2026-10-25" },
          { ScopeKey: "branches", TotalCount: 2, OpenCount: 1, AsOf: "2026-10-25" }
        ], TotalCount: 3 }));
        if (url.includes("CurrentPermits")) return new Response(JSON.stringify({ Items: [
          { ValidCount: 2, MissingCount: 1, OverdueCount: 0, AsOf: "2026-10-25", ValueDate: "2026-10-25" }
        ], TotalCount: 1 }));
        return new Response(JSON.stringify({ Items: [{ EquipmentId: 1 }], TotalCount: 1 }));
      }
    }));

    await loadForContext(firstContext);
    assert.equal(paths.length, 3);
    const freshLoads = [];
    const originalOnContextCount = fixture.contexts.length;
    fixture.harness.reenter();
    for (let attempt = 0; attempt < 30 && fixture.contexts.length === originalOnContextCount; attempt += 1) await tick();
    assert.equal(fixture.contexts.length, originalOnContextCount + 1, "fresh bridge session must publish a new application context");
    freshLoads.push(await loadForContext(fixture.contexts.at(-1).context));
    assert.equal(freshLoads.length, 1);
    assert.deepEqual(paths.slice(3).sort(), [
      "/api/Entity/MilgamDashboardCurrentEquipment/Search",
      "/api/Entity/MilgamDashboardCurrentEvents/Search",
      "/api/Entity/MilgamDashboardCurrentPermits/Search"
    ]);
  } finally {
    bootstrap?.dispose();
    fixture.harness.revoke();
  }
});

test("UAT-208 overlapping bridge re-entry keeps newest automatic three-snapshot recovery", async () => {
  const loads = [];
  const unhandled = [];
  const onUnhandled = (reason) => unhandled.push(reason);
  process.on("unhandledRejection", onUnhandled);
  let fixture;
  try {
    fixture = await faithfulFixture({
      onContext: (context) => {
        const generation = context.Token.access_token.match(/generation-(\d+)$/)?.[1];
        if (generation === "1") return;
        const paths = [];
        const load = loadCurrentSnapshot(createApiClient(context, {
          fetchImpl: async (url) => {
            paths.push(new URL(url).pathname);
            if (url.includes("CurrentEvents")) return new Response(JSON.stringify({ Items: [
              { ScopeKey: "overall", TotalCount: 3, OpenCount: 1, AsOf: "2026-10-25" },
              { ScopeKey: "headquarters", TotalCount: 1, OpenCount: 0, AsOf: "2026-10-25" },
              { ScopeKey: "branches", TotalCount: 2, OpenCount: 1, AsOf: "2026-10-25" }
            ], TotalCount: 3 }));
            if (url.includes("CurrentPermits")) return new Response(JSON.stringify({ Items: [
              { ValidCount: 2, MissingCount: 1, OverdueCount: 0, AsOf: "2026-10-25", ValueDate: "2026-10-25" }
            ], TotalCount: 1 }));
            return new Response(JSON.stringify({ Items: [{ EquipmentId: 1 }], TotalCount: 1 }));
          }
        }));
        loads.push({ generation, paths, load });
      }
    });

    fixture.harness.reenter();
    queueMicrotask(() => fixture.harness.reenter());
    for (let attempt = 0; attempt < 30 && fixture.contexts.at(-1)?.context.Token.access_token !== "controller-synthetic-generation-3"; attempt += 1) await tick();
    assert.equal(fixture.contexts.at(-1)?.context.Token.access_token, "controller-synthetic-generation-3");
    const newest = loads.find((entry) => entry.generation === "3");
    assert.ok(newest, "the newest overlapping re-entry must automatically begin snapshot recovery");
    await newest.load;
    assert.deepEqual(newest.paths.sort(), [
      "/api/Entity/MilgamDashboardCurrentEquipment/Search",
      "/api/Entity/MilgamDashboardCurrentEvents/Search",
      "/api/Entity/MilgamDashboardCurrentPermits/Search"
    ]);
    await tick();
    assert.deepEqual(unhandled, [], "overlapping re-entry must not leak a disposed handshake rejection");
  } finally {
    process.removeListener("unhandledRejection", onUnhandled);
    fixture?.bootstrap.dispose();
    fixture?.harness.revoke();
  }
});

test("UAT-209 reset, pending handshake, command rejection, and disposal emit no unhandled rejection", async () => {
  const fixture = await faithfulFixture();
  const unhandled = [];
  const onUnhandled = (reason) => unhandled.push(reason);
  process.on("unhandledRejection", onUnhandled);
  try {
    const services = createHostServices(fixture.connected.context, fixture.connected.client);
    fixture.harness.holdCommand();
    const pendingCommand = services.executeCommand("Navigate", { Url: "#/Permits/Dashboard" });
    await tick();
    fixture.harness.reenter();
    const detachedHandshake = fixture.bootstrap.connect().catch((error) => error);
    fixture.bootstrap.dispose();
    fixture.harness.releaseCommand();
    const [commandError, handshakeResult] = await Promise.all([
      pendingCommand.catch((error) => error),
      detachedHandshake
    ]);
    assert.ok(["SESSION_RESET", "DISPOSED", "HOST_REVOKED"].includes(commandError?.code));
    assert.ok(handshakeResult?.context || ["SESSION_RESET", "DISPOSED", "HOST_REVOKED"].includes(handshakeResult?.code));
    await tick();
    await tick();
    assert.deepEqual(unhandled, [], "all expected reset/disposal rejections must be consumed");
    assert.equal(fixture.harness.effects.length, 0, "disposed old generation must produce no navigation effect");
  } finally {
    process.removeListener("unhandledRejection", onUnhandled);
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
