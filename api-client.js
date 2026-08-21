import { DATASETS, ENDPOINTS } from "./constants.js";
import { buildSearchBody } from "./date-range.js";
import { validateHostContext } from "./host-context.js";

const LOG_PREFIX = "[milgam-dashboard.api]";

function sanitizeEndpoint(endpoint) {
  return String(endpoint || "").replace(/[\\s\\n\\r\\t]+/g, "");
}

export class DashboardRequestError extends Error {
  constructor({ kind, dataset, status = null, body = null, detail = null }) {
    super(buildSafeMessage(kind, dataset, status));
    this.name = "DashboardRequestError";
    this.kind = kind;
    this.dataset = dataset;
    this.status = status;
    this.body = body;
    this.detail = detail;
  }

  toJSON() {
    return {
      name: this.name,
      kind: this.kind,
      dataset: this.dataset,
      status: this.status,
      body: this.body,
      detail: this.detail,
      message: this.message
    };
  }
}

export function createApiClient(context, { fetchImpl = globalThis.fetch } = {}) {
  if (!validateHostContext(context)) {
    throw new TypeError("Valid SimplyLog host context is required");
  }
  if (typeof fetchImpl !== "function") throw new TypeError("A fetch implementation is required");

  const baseUrl = String(context.ApiAddress).replace(/\/+$/, "");
  const accessToken = context.Token.access_token;
  const suppliedTokenType = String(context.Token.token_type || "").trim();
  const tokenType = /^[A-Za-z][A-Za-z0-9+.-]*$/.test(suppliedTokenType)
    ? suppliedTokenType
    : "Bearer";
  const secrets = [accessToken, `${tokenType} ${accessToken}`];

  async function requestItems(datasetKey, range, { signal } = {}) {
    const endpoint = ENDPOINTS[datasetKey];
    const dataset = DATASETS[datasetKey] || String(datasetKey || "unknown");
    if (!endpoint) throw new TypeError(`Unknown dashboard dataset: ${datasetKey}`);
    const requestBody = buildSearchBody(range);
    const fullUrl = `${baseUrl}${sanitizeEndpoint(endpoint)}`;
    console.info(LOG_PREFIX, "Starting request", {
      dataset,
      endpoint,
      url: fullUrl,
      range: { fromDate: requestBody.FromDate, toDate: requestBody.ToDate }
    });

    let response;
    try {
      response = await fetchImpl(`${baseUrl}${endpoint}`, {
        method: "POST",
        headers: {
          Authorization: `${tokenType} ${accessToken}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(buildSearchBody(range)),
        signal
      });
    } catch (error) {
      if (signal?.aborted || error?.name === "AbortError") {
        console.warn(LOG_PREFIX, "Request aborted", { dataset });
        throw new DashboardRequestError({ kind: "aborted", dataset });
      }
      console.error(LOG_PREFIX, "Network error", { dataset, detail: sanitizeValue(error?.message || "Network request failed", secrets) });
      throw new DashboardRequestError({
        kind: "network",
        dataset,
        detail: sanitizeValue(error?.message || "Network request failed", secrets)
      });
    }

    let rawBody = "";
    try {
      rawBody = await response.text();
    } catch {
      rawBody = "";
    }

    const sanitizedRawBody = sanitizeValue(rawBody, secrets);
    const parsed = tryParseJson(rawBody);
    const sanitizedBody = parsed.ok
      ? sanitizeValue(parsed.value, secrets)
      : sanitizedRawBody;

    console.info(LOG_PREFIX, "Response received", {
      dataset,
      status: response.status,
      ok: response.ok,
      bodyBytes: sanitizedRawBody.length
    });

    if (!response.ok) {
      console.error(LOG_PREFIX, "HTTP error", {
        dataset,
        status: response.status,
        body: sanitizeValue(sanitizedBody, secrets)
      });
      throw new DashboardRequestError({
        kind: "http",
        dataset,
        status: response.status,
        body: sanitizedBody
      });
    }

    if (!parsed.ok) {
      console.error(LOG_PREFIX, "Invalid JSON response", { dataset, bodySnippet: String(sanitizedRawBody).slice(0, 180) });
      throw new DashboardRequestError({
        kind: "invalid-response",
        dataset,
        status: response.status,
        body: sanitizedRawBody,
        detail: "Response was not valid JSON"
      });
    }

    const items = validateItemsEnvelope(parsed.value, { dataset, status: response.status, secrets });
    console.info(LOG_PREFIX, "Request successful", { dataset, itemCount: items.length });
    return items;
  }

  return { requestItems };
}

export function validateItemsEnvelope(response, { dataset = "unknown", status = 200, secrets = [] } = {}) {
  if (!response || typeof response !== "object" || !Array.isArray(response.Items)) {
    throw new DashboardRequestError({
      kind: "invalid-response",
      dataset,
      status,
      body: sanitizeValue(response, secrets),
      detail: "Items must be an array"
    });
  }

  const totalCount = normalizeTotalCount(response.TotalCount);
  if (totalCount !== null && totalCount > response.Items.length) {
    throw new DashboardRequestError({
      kind: "invalid-response",
      dataset,
      status,
      body: sanitizeValue(response, secrets),
      detail: "Paged response is incomplete"
    });
  }

  return response.Items;
}

function normalizeTotalCount(totalCount) {
  if (typeof totalCount === "number" && Number.isFinite(totalCount)) return totalCount;
  if (typeof totalCount === "string") {
    const trimmed = totalCount.trim();
    if (!trimmed) return null;
    const parsed = Number(trimmed);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
}

export function sanitizeValue(value, secrets = []) {
  const replacements = secrets.filter((secret) => typeof secret === "string" && secret.length > 0);

  if (typeof value === "string") {
    let safe = value;
    for (const secret of replacements) safe = safe.split(secret).join("[REDACTED]");
    safe = safe.replace(/Authorization\s*[:=]\s*[^,;\r\n}]+/gi, "Authorization: [REDACTED]");
    return safe;
  }
  if (Array.isArray(value)) return value.map((item) => sanitizeValue(item, replacements));
  if (value && typeof value === "object") {
    const safe = {};
    for (const [key, item] of Object.entries(value)) {
      if (/authorization|access[_-]?token|token/i.test(key)) safe[key] = "[REDACTED]";
      else safe[key] = sanitizeValue(item, replacements);
    }
    return safe;
  }
  return value;
}

function tryParseJson(text) {
  try {
    return { ok: true, value: JSON.parse(text) };
  } catch {
    return { ok: false, value: null };
  }
}

function buildSafeMessage(kind, dataset, status) {
  if (kind === "http") return `${dataset} request failed with HTTP ${status}`;
  if (kind === "invalid-response") return `${dataset} returned an invalid response`;
  if (kind === "aborted") return `${dataset} request was cancelled`;
  return `${dataset} request failed`;
}
