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

const allowed = ["https://host.example"];
const validContext = {
  ApiAddress: "https://api.example",
  Token: { access_token: "runtime-only" }
};

test("host context accepts object and JSON string payloads from a fixed allowed origin", () => {
  assert.deepEqual(parseMessagePayload(JSON.stringify(validContext)), validContext);
  assert.equal(parseMessagePayload(validContext), validContext);
  assert.deepEqual(contextFromMessage({ origin: allowed[0], data: validContext }, allowed), validContext);
  assert.deepEqual(contextFromMessage({ origin: allowed[0], data: JSON.stringify(validContext) }, allowed), validContext);
  assert.equal(isAllowedOrigin("https://not-allowed.example", allowed), false);
  assert.equal(contextFromMessage({ origin: "https://not-allowed.example", data: validContext }, allowed), null);
  assert.equal(contextFromMessage({ origin: allowed[0], data: "invalid json" }, allowed), null);
});

test("host context requires a usable API address and access token", () => {
  assert.equal(validateHostContext(validContext), true);
  assert.equal(validateHostContext({ ApiAddress: "https://api.example", Token: {} }), false);
  assert.equal(validateHostContext({ ApiAddress: "javascript:alert(1)", Token: { access_token: "x" } }), false);
  assert.equal(validateHostContext(null), false);
});

test("listener ignores invalid messages, accepts only the first valid context, and remains recoverable", () => {
  const listeners = new Map();
  const fakeWindow = {
    addEventListener(type, listener) { listeners.set(type, listener); },
    removeEventListener(type) { listeners.delete(type); }
  };
  const received = [];
  const dispose = installHostContextListener(fakeWindow, (context) => received.push(context), allowed);

  listeners.get("message")({ origin: "https://bad.example", data: validContext });
  listeners.get("message")({ origin: allowed[0], data: { ApiAddress: "", Token: {} } });
  assert.equal(received.length, 0);
  listeners.get("message")({ origin: allowed[0], data: validContext });
  listeners.get("message")({ origin: allowed[0], data: validContext });
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
