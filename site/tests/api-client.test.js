import test from "node:test";
import assert from "node:assert/strict";

import { createApiClient, DashboardRequestError, validateItemsEnvelope } from "../api-client.js";
import { CURRENT_DATASET_KEYS, DATASETS, ENDPOINTS } from "../constants.js";
import { buildMonthRange, buildPeriodDiscoveryRange, buildSearchBody, daysInMonth } from "../date-range.js";
import { contextFromMessage, revokeHostContext } from "../host-context.js";

const TOKEN = "secret-token-that-must-not-leak";
const rawContext = {
  ApiAddress: "https://localhost:5721///",
  Token: { token_type: "TokenScheme", access_token: TOKEN }
};
const parentWindow = {};
const bindContext = (value = rawContext) => contextFromMessage({ source: parentWindow, origin: "https://localhost:5500", data: value }, ["https://localhost:5500"], parentWindow);
const context = bindContext();

test("date helpers construct exact selected-month and discovery ranges, including leap years", () => {
  assert.equal(daysInMonth(2024, 2), 29);
  assert.equal(daysInMonth(2025, 2), 28);
  assert.deepEqual(buildMonthRange(2024, 2), {
    FromDate: "2024-02-01T00:00:00",
    ToDate: "2024-02-29T23:59:59.997"
  });
  assert.deepEqual(buildMonthRange(2026, 8), {
    FromDate: "2026-08-01T00:00:00",
    ToDate: "2026-08-31T23:59:59.997"
  });
  assert.deepEqual(buildPeriodDiscoveryRange(new Date(2026, 7, 20, 12)), {
    FromDate: "2000-01-01T00:00:00",
    ToDate: "2026-08-31T23:59:59.997"
  });
});

test("search body has the exact contract keys and selected-month dates", () => {
  assert.deepEqual(buildSearchBody(buildMonthRange(2026, 8)), {
    PageIndex: 1,
    StartIndex: 0,
    PageSize: 1000,
    Filter: null,
    OrderBy: null,
    SortDirection: null,
    OrderBySecondary: null,
    SortDirectionSecondary: null,
    ItemStatus: 0,
    FromDate: "2026-08-01T00:00:00",
    ToDate: "2026-08-31T23:59:59.997"
  });
});

test("client calls every exact endpoint with host base URL, headers, and JSON body", async () => {
  const calls = [];
  const client = createApiClient(context, {
    fetchImpl: async (url, options) => {
      calls.push({ url, options });
      return jsonResponse({ Items: [], TotalCount: 0 });
    }
  });
  const range = buildMonthRange(2026, 8);

  const analyticalKeys = Object.keys(ENDPOINTS).filter((key) => !CURRENT_DATASET_KEYS.includes(key));
  for (const key of analyticalKeys) await client.requestItems(key, range);

  assert.deepEqual(calls.map((call) => call.url), analyticalKeys.map((key) => `https://localhost:5721${ENDPOINTS[key]}`));
  for (const call of calls) {
    assert.equal(call.options.method, "POST");
    assert.deepEqual(call.options.headers, {
      Authorization: `TokenScheme ${TOKEN}`,
      "Content-Type": "application/json"
    });
    assert.deepEqual(JSON.parse(call.options.body), buildSearchBody(range));
    assert.ok(!call.url.includes("dbo."));
    assert.ok(!call.url.includes("Report_ByEntity_"));
    assert.ok(!call.url.includes("*"));
  }
});

test("client defaults token type to Bearer", async () => {
  let authorization;
  const client = createApiClient(bindContext({
    ApiAddress: "https://localhost:5721",
    Token: { access_token: TOKEN }
  }), {
    fetchImpl: async (_url, options) => {
      authorization = options.headers.Authorization;
      return jsonResponse({ Items: [], TotalCount: 0 });
    }
  });

  await client.requestItems("periods", buildMonthRange(2026, 8));
  assert.equal(authorization, `Bearer ${TOKEN}`);
});

test("unbound host-shaped objects are rejected before fetch", () => {
  let calls = 0;
  assert.throws(() => createApiClient({ ...rawContext, __trustedHostOrigin: "https://localhost:5500", __hostContextBound: true }, {
    fetchImpl: async () => { calls += 1; }
  }), /host context/i);
  assert.equal(calls, 0);
});

test("revoked clients issue no request and late responses cannot commit", async () => {
  let calls = 0;
  const revokedContext = bindContext();
  const client = createApiClient(revokedContext, { fetchImpl: async () => { calls += 1; return jsonResponse({ Items: [], TotalCount: 0 }); } });
  revokeHostContext(revokedContext);
  await assert.rejects(client.requestCurrent("currentEquipment"), (error) => error.kind === "authorization-revoked");
  assert.equal(calls, 0);

  let release;
  const activeContext = bindContext();
  const lateClient = createApiClient(activeContext, { fetchImpl: () => new Promise((resolve) => { release = resolve; }) });
  const pending = lateClient.requestCurrent("currentEquipment");
  revokeHostContext(activeContext);
  release(jsonResponse({ Items: [], TotalCount: 0 }));
  await assert.rejects(pending, (error) => error.kind === "authorization-revoked");
});

test("Items is required, empty Items is valid, and incomplete pages are rejected", () => {
  const empty = [];
  assert.equal(validateItemsEnvelope({ Items: empty, TotalCount: 0 }), empty);
  assert.throws(() => validateItemsEnvelope({ TotalCount: 0 }), invalidResponse);
  assert.throws(() => validateItemsEnvelope({ Items: null, TotalCount: 0 }), invalidResponse);
  assert.throws(() => validateItemsEnvelope({ Items: [{}], TotalCount: 2 }), (error) => (
    invalidResponse(error) && error.detail === "Paged response is incomplete"
  ));
});

for (const status of [400, 401, 403, 500]) {
  test(`HTTP ${status} preserves bounded metadata without retaining response fields`, async () => {
    const marker = `personal-internal-marker-${status}`;
    const responseBody = { message: marker, echoedToken: TOKEN };
    const client = createApiClient(bindContext(), {
      fetchImpl: async () => jsonResponse(responseBody, status)
    });

    await assert.rejects(
      client.requestItems("summary", buildMonthRange(2026, 8)),
      (error) => {
        assert.ok(error instanceof DashboardRequestError);
        assert.equal(error.status, status);
        assert.equal(Object.hasOwn(error, "body"), false);
        assert.ok(error.bodyBytes > 0);
        assert.ok(!JSON.stringify(error).includes(marker));
        assert.ok(!JSON.stringify(error).includes(TOKEN));
        assert.ok(!error.message.includes(TOKEN));
        assert.ok(!Object.hasOwn(error, "headers"));
        return true;
      }
    );
  });
}

test("invalid JSON and invalid envelope are dataset-specific invalid-response errors", async () => {
  const invalidJsonClient = createApiClient(bindContext(), {
    fetchImpl: async () => new Response("not-json", { status: 200 })
  });
  await assert.rejects(
    invalidJsonClient.requestItems("division", buildMonthRange(2026, 8)),
    (error) => error.kind === "invalid-response" && error.dataset === DATASETS.division
      && error.bodyBytes === "not-json".length && !Object.hasOwn(error, "body")
  );

  const invalidDataClient = createApiClient(bindContext(), {
    fetchImpl: async () => jsonResponse({ Result: [] })
  });
  await assert.rejects(
    invalidDataClient.requestItems("category", buildMonthRange(2026, 8)),
    (error) => error.kind === "invalid-response" && error.dataset === DATASETS.category
  );
});

test("network failures are handled without leaking token data", async () => {
  const client = createApiClient(bindContext(), {
    fetchImpl: async () => { throw new Error(`socket failed for ${TOKEN}`); }
  });

  await assert.rejects(client.requestItems("closure", buildMonthRange(2026, 8)), (error) => {
    assert.equal(error.kind, "network");
    assert.equal(error.dataset, DATASETS.closure);
    assert.ok(!JSON.stringify(error).includes(TOKEN));
    return true;
  });
});

function jsonResponse(value, status = 200) {
  return new Response(JSON.stringify(value), {
    status,
    headers: { "Content-Type": "application/json" }
  });
}

function invalidResponse(error) {
  return error instanceof DashboardRequestError && error.kind === "invalid-response";
}
