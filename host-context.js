import { ALLOWED_HOST_ORIGINS, RTL_LANGUAGES } from "./constants.js";

const LOG_PREFIX = "[milgam-dashboard.host-context]";

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

export function validateHostContext(context) {
  if (!context || typeof context !== "object" || Array.isArray(context)) return false;

  const apiAddress = String(context.ApiAddress || "").trim();
  const accessToken = context.Token?.access_token;
  if (!apiAddress || typeof accessToken !== "string" || accessToken.trim() === "") {
    console.warn(LOG_PREFIX, "Invalid host context", { reason: "missing ApiAddress or access token" });
    return false;
  }

  try {
    const url = new URL(apiAddress);
    const valid = url.protocol === "https:" || url.protocol === "http:";
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

export function contextFromMessage(event, allowedOrigins = ALLOWED_HOST_ORIGINS) {
  if (!event || !isAllowedOrigin(event.origin, allowedOrigins)) {
    if (event?.origin) {
      console.warn(LOG_PREFIX, "Rejected host message", { origin: event.origin });
    } else {
      console.warn(LOG_PREFIX, "Rejected host message: missing event/origin");
    }
    return null;
  }

  try {
    const context = parseMessagePayload(event.data);
    const valid = validateHostContext(context);
    if (!valid) {
      console.warn(LOG_PREFIX, "Rejected host message: invalid runtime context", summarizeContext(context));
      return null;
    }
    console.info(LOG_PREFIX, "Accepted host message", summarizeContext(context));
    return context;
  } catch {
    console.error(LOG_PREFIX, "Failed to parse host message payload");
    return null;
  }
}

export function installHostContextListener(windowObject, onContext, allowedOrigins = ALLOWED_HOST_ORIGINS) {
  let accepted = false;
  const handler = (event) => {
    console.info(LOG_PREFIX, "Message event received", { origin: event?.origin });
    if (accepted) return;
    const context = contextFromMessage(event, allowedOrigins);
    if (!context) return;
    console.info(LOG_PREFIX, "Host context fixed and accepted");
    accepted = true;
    onContext(context);
  };

  windowObject.addEventListener("message", handler);
  return () => windowObject.removeEventListener("message", handler);
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
