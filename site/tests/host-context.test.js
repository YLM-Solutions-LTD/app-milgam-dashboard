import test from "node:test";
import assert from "node:assert/strict";

import {
  applyRuntimeLocale,
  contextFromMessage,
  installHostContextListener,
  isAllowedOrigin,
  parseMessagePayload,
  resolveRuntimeLocale,
  validateHostContext
} from "../host-context.js";

const allowed = ["https://localhost:5500"];
const validContext = {
  ApiAddress: "https://localhost:5721",
  Token: { access_token: "runtime-only" }
};

test("host context accepts object and JSON string payloads from a fixed allowed origin", () => {
  assert.deepEqual(parseMessagePayload(JSON.stringify(validContext)), validContext);
  assert.equal(parseMessagePayload(validContext), validContext);
  const parent = {};
  assert.equal(contextFromMessage({ source: parent, origin: allowed[0], data: validContext }, allowed, parent).ApiAddress, validContext.ApiAddress);
  assert.equal(contextFromMessage({ source: parent, origin: allowed[0], data: JSON.stringify(validContext) }, allowed, parent).__hostContextBound, true);
  assert.equal(isAllowedOrigin("https://not-allowed.example", allowed), false);
  assert.equal(contextFromMessage({ source: parent, origin: "https://not-allowed.example", data: validContext }, allowed, parent), null);
  assert.equal(contextFromMessage({ source: parent, origin: allowed[0], data: "invalid json" }, allowed, parent), null);
});

test("host context requires a usable API address and access token", () => {
  const parent = {};
  const accepted = contextFromMessage({ source: parent, origin: allowed[0], data: validContext }, allowed, parent);
  assert.equal(validateHostContext(accepted), true);
  assert.equal(validateHostContext({ ...accepted }), false);
  assert.equal(validateHostContext({ ApiAddress: "https://api.example", Token: {} }), false);
  assert.equal(validateHostContext({ ApiAddress: "javascript:alert(1)", Token: { access_token: "x" } }), false);
  assert.equal(validateHostContext(null), false);
});

test("accepted context is an immutable capability and nested input mutation cannot change it", () => {
  const parent = {};
  const payload = { ...validContext, Token: { ...validContext.Token }, Configuration: [{ Name: "x", Value: { enabled: true } }] };
  const accepted = contextFromMessage({ source: parent, origin: allowed[0], data: payload }, allowed, parent);
  payload.Token.access_token = "changed";
  payload.Configuration[0].Value.enabled = false;
  assert.equal(accepted.Token.access_token, "runtime-only");
  assert.equal(accepted.Configuration[0].Value.enabled, true);
  assert.ok(Object.isFrozen(accepted));
  assert.ok(Object.isFrozen(accepted.Token));
  assert.ok(Object.isFrozen(accepted.Configuration[0].Value));
});

test("listener ignores invalid messages, accepts only the first valid context, and remains recoverable", () => {
  const listeners = new Map();
  const fakeWindow = {
    parent: {},
    addEventListener(type, listener) { listeners.set(type, listener); },
    removeEventListener(type) { listeners.delete(type); }
  };
  const received = [];
  const dispose = installHostContextListener(fakeWindow, (context) => received.push(context), allowed);

  listeners.get("message")({ source: fakeWindow.parent, origin: "https://bad.example", data: validContext });
  listeners.get("message")({ source: fakeWindow.parent, origin: allowed[0], data: { ApiAddress: "", Token: {} } });
  assert.equal(received.length, 0);
  listeners.get("message")({ source: fakeWindow.parent, origin: allowed[0], data: validContext });
  listeners.get("message")({ source: fakeWindow.parent, origin: allowed[0], data: validContext });
  assert.equal(received.length, 1);
  dispose();
  assert.equal(listeners.has("message"), false);
});

test("runtime direction honors explicit RTL/LTR and otherwise infers language", () => {
  assert.deepEqual(resolveRuntimeLocale({ LanguageDirection: "rtl", LanguageCode: "en-US" }), {
    language: "en",
    direction: "rtl"
  });
  assert.deepEqual(resolveRuntimeLocale({ LanguageDirection: "ltr", LanguageCode: "he-IL" }), {
    language: "he",
    direction: "ltr"
  });
  assert.deepEqual(resolveRuntimeLocale({ CultureInfo: "he-IL" }), { language: "he", direction: "rtl" });
  assert.deepEqual(resolveRuntimeLocale({ CultureInfo: "en-US" }), { language: "en", direction: "ltr" });

  const fakeDocument = { documentElement: { lang: "", dir: "" } };
  applyRuntimeLocale({ LanguageCode: "en", LanguageDirection: "ltr" }, fakeDocument);
  assert.deepEqual(fakeDocument.documentElement, { lang: "en", dir: "ltr" });
  applyRuntimeLocale({ LanguageCode: "he", LanguageDirection: "rtl" }, fakeDocument);
  assert.deepEqual(fakeDocument.documentElement, { lang: "he", dir: "rtl" });
});
