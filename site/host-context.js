import { ALLOWED_API_ORIGINS_BY_HOST, ALLOWED_HOST_ORIGINS, RTL_LANGUAGES } from "./constants.js";

const LOG_PREFIX = "[milgam-dashboard.host-context]";
const boundContexts = new WeakMap();
const revocationSubscribers = new Set();
let nextGeneration = 0;

export function summarizeContext(context = null) {
  if (!context || typeof context !== "object") return null;
  const tokenType = typeof context.Token?.token_type === "string" ? context.Token.token_type : null;
  return {
    ApiAddress: context.ApiAddress ? String(context.ApiAddress) : null,
    tokenType,
    hasAccessToken: typeof context.Token?.access_token === "string" && context.Token.access_token.trim() !== "",
    LanguageCode: context.LanguageCode || null,
    CultureInfo: context.CultureInfo || null,
    LanguageDirection: context.LanguageDirection || null,
    ApplicationName: context.ApplicationName || null
  };
}

export function parseMessagePayload(data) {
  if (typeof data === "string") {
    console.info(LOG_PREFIX, "Parsing JSON message payload");
    const parsed = JSON.parse(data);
    return parsed;
  }
  if (data && typeof data === "object" && !Array.isArray(data)) {
    if (data.context && typeof data.context === "object") {
      console.info(LOG_PREFIX, "Unwrapping nested payload", { wrapper: "context" });
    } else if (data.payload && typeof data.payload === "object") {
      console.info(LOG_PREFIX, "Unwrapping nested payload", { wrapper: "payload" });
    }
    if (data.context !== undefined) return parseMessagePayload(data.context);
    if (data.payload !== undefined) return parseMessagePayload(data.payload);
    if (data.data !== undefined && (typeof data.data === "string" || (data.data && typeof data.data === "object"))) {
      console.info(LOG_PREFIX, "Unwrapping nested payload", { wrapper: "data" });
      return parseMessagePayload(data.data);
    }
  }
  return data;
}

export function isAllowedOrigin(origin, allowedOrigins = ALLOWED_HOST_ORIGINS) {
  const allowed = typeof origin === "string" && allowedOrigins.includes(origin);
  if (!allowed) {
    console.warn(LOG_PREFIX, "Blocked message origin", { origin, allowedOrigins });
  }
  return allowed;
}

function validateHostContextShape(context, hostOrigin) {
  if (!context || typeof context !== "object" || Array.isArray(context)) return false;

  const apiAddress = String(context.ApiAddress || "").trim();
  const accessToken = context.Token?.access_token;
  if (!apiAddress || typeof accessToken !== "string" || accessToken.trim() === "") {
    console.warn(LOG_PREFIX, "Invalid host context", { reason: "missing ApiAddress or access token" });
    return false;
  }

  try {
    const url = new URL(apiAddress);
    const approvedApiOrigins = ALLOWED_API_ORIGINS_BY_HOST[hostOrigin] || [];
    const valid = url.protocol === "https:" && approvedApiOrigins.includes(url.origin);
    if (!valid) {
      console.warn(LOG_PREFIX, "Invalid host context", {
        reason: "invalid ApiAddress protocol",
        ApiAddress: String(context.ApiAddress)
      });
    }
    return valid;
  } catch {
    console.warn(LOG_PREFIX, "Invalid host context", { reason: "malformed ApiAddress", ApiAddress: String(context.ApiAddress) });
    return false;
  }
}

export function isBoundHostContext(context) {
  return Boolean(context && typeof context === "object" && boundContexts.get(context)?.active === true);
}

export function hostContextGeneration(context) {
  return boundContexts.get(context)?.generation ?? null;
}

export function revokeHostContext(context, reason = "revoked") {
  const capability = boundContexts.get(context);
  if (!capability?.active) return false;
  capability.active = false;
  for (const subscriber of revocationSubscribers) subscriber(context, { generation: capability.generation, reason });
  return true;
}

export function onHostContextRevoked(subscriber) {
  if (typeof subscriber !== "function") throw new TypeError("A revocation subscriber is required");
  revocationSubscribers.add(subscriber);
  return () => revocationSubscribers.delete(subscriber);
}

export function validateHostContext(context) {
  return isBoundHostContext(context);
}

export function contextFromMessage(event, allowedOrigins = ALLOWED_HOST_ORIGINS, parentWindow = globalThis.window?.parent) {
  if (!event || event.source !== parentWindow || !isAllowedOrigin(event.origin, allowedOrigins)) {
    if (event?.origin) {
      console.warn(LOG_PREFIX, "Rejected host message", { origin: event.origin });
    } else {
      console.warn(LOG_PREFIX, "Rejected host message: missing event/origin");
    }
    return null;
  }

  try {
    const context = parseMessagePayload(event.data);
    const valid = validateHostContextShape(context, event.origin);
    if (!valid) {
      console.warn(LOG_PREFIX, "Rejected host message: invalid runtime context", summarizeContext(context));
      return null;
    }
    const boundContext = immutableContextCopy(context, event.origin);
    boundContexts.set(boundContext, { active: true, generation: ++nextGeneration });
    console.info(LOG_PREFIX, "Accepted host message", summarizeContext(context));
    return boundContext;
  } catch {
    console.error(LOG_PREFIX, "Failed to parse host message payload");
    return null;
  }
}

function immutableContextCopy(context, hostOrigin) {
  const copy = cloneSerializable(context);
  copy.__trustedHostOrigin = hostOrigin;
  copy.__hostContextBound = true;
  return deepFreeze(copy);
}

function cloneSerializable(value, seen = new WeakSet()) {
  if (value === null || typeof value !== "object") return value;
  if (seen.has(value)) throw new TypeError("Host context must not contain circular values");
  seen.add(value);
  const copy = Array.isArray(value) ? [] : {};
  for (const [key, child] of Object.entries(value)) copy[key] = cloneSerializable(child, seen);
  seen.delete(value);
  return copy;
}

function deepFreeze(value) {
  if (!value || typeof value !== "object" || Object.isFrozen(value)) return value;
  for (const child of Object.values(value)) deepFreeze(child);
  return Object.freeze(value);
}

export function installHostContextListener(windowObject, onContext, allowedOrigins = ALLOWED_HOST_ORIGINS) {
  let acceptedContext = null;
  const handler = (event) => {
    console.info(LOG_PREFIX, "Message event received", { origin: event?.origin });
    const context = contextFromMessage(event, allowedOrigins, windowObject.parent);
    if (!context) return;
    if (acceptedContext && sameAuthorization(acceptedContext, context)) {
      revokeHostContext(context, "duplicate");
      return;
    }
    if (acceptedContext) revokeHostContext(acceptedContext, "replaced");
    acceptedContext = context;
    console.info(LOG_PREFIX, "Host context accepted");
    onContext(context);
  };

  windowObject.addEventListener("message", handler);
  return () => {
    windowObject.removeEventListener("message", handler);
    if (acceptedContext) revokeHostContext(acceptedContext, "disposed");
  };
}

function sameAuthorization(left, right) {
  return left.__trustedHostOrigin === right.__trustedHostOrigin
    && left.ApiAddress === right.ApiAddress
    && left.Token?.token_type === right.Token?.token_type
    && left.Token?.access_token === right.Token?.access_token;
}

export function resolveRuntimeLocale(context = {}) {
  const configuredDirection = String(context.LanguageDirection || "").toLowerCase();
  const culture = String(context.LanguageCode || context.CultureInfo || "he").toLowerCase();
  const language = culture.split(/[-_]/)[0] || "he";
  const direction = configuredDirection === "rtl" || configuredDirection === "ltr"
    ? configuredDirection
    : (RTL_LANGUAGES.includes(language) ? "rtl" : "ltr");

  return { language, direction };
}

export function applyRuntimeLocale(context, documentObject = document) {
  const locale = resolveRuntimeLocale(context);
  documentObject.documentElement.lang = locale.language;
  documentObject.documentElement.dir = locale.direction;
  return locale;
}
