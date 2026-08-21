import test from "node:test";
import assert from "node:assert/strict";

import { createApiClient, DashboardRequestError, validateItemsEnvelope } from "../api-client.js";
import { DATASETS, ENDPOINTS } from "../constants.js";
import { buildMonthRange, buildPeriodDiscoveryRange, buildSearchBody, daysInMonth } from "../date-range.js";

const TOKEN = "secret-token-that-must-not-leak";
const context = {
  ApiAddress: "https://tenant.example.test///",
  Token: { token_type: "TokenScheme", access_token: TOKEN }
};

test("date helpers construct exact selected-month and discovery ranges, including leap years", () => {
  assert.equal(daysInMonth(2024, 2), 29);
  assert.equal(daysInMonth(2025, 2), 28);
  assert.deepEqual(buildMonthRange(2024, 2), {
    FromDate: "2024-02-01T00:00:00",
    ToDate: "2024-02-29T23:59:59"
  });
  assert.deepEqual(buildMonthRange(2026, 8), {
    FromDate: "2026-08-01T00:00:00",
    ToDate: "2026-08-31T23:59:59"
  });
  assert.deepEqual(buildPeriodDiscoveryRange(new Date(2026, 7, 20, 12)), {
    FromDate: "2000-01-01T00:00:00",
    ToDate: "2026-08-31T23:59:59"
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
    ToDate: "2026-08-31T23:59:59"
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

  for (const key of Object.keys(ENDPOINTS)) await client.requestItems(key, range);

  assert.deepEqual(calls.map((call) => call.url), Object.values(ENDPOINTS).map((path) => `https://tenant.example.test${path}`));
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
  const client = createApiClient({
    ApiAddress: "https://tenant.example.test",
    Token: { access_token: TOKEN }
  }, {
    fetchImpl: async (_url, options) => {
      authorization = options.headers.Authorization;
      return jsonResponse({ Items: [], TotalCount: 0 });
    }
  });

  await client.requestItems("periods", buildMonthRange(2026, 8));
  assert.equal(authorization, `Bearer ${TOKEN}`);
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
  test(`HTTP ${status} preserves status and response body without request secrets`, async () => {
    const responseBody = { message: `status-${status}`, echoedToken: TOKEN };
    const client = createApiClient(context, {
      fetchImpl: async () => jsonResponse(responseBody, status)
    });

    await assert.rejects(
      client.requestItems("summary", buildMonthRange(2026, 8)),
      (error) => {
        assert.ok(error instanceof DashboardRequestError);
        assert.equal(error.status, status);
        assert.equal(error.body.message, `status-${status}`);
        assert.equal(error.body.echoedToken, "[REDACTED]");
        assert.ok(!JSON.stringify(error).includes(TOKEN));
        assert.ok(!error.message.includes(TOKEN));
        assert.ok(!Object.hasOwn(error, "headers"));
        return true;
      }
    );
  });
}

test("invalid JSON and invalid envelope are dataset-specific invalid-response errors", async () => {
  const invalidJsonClient = createApiClient(context, {
    fetchImpl: async () => new Response("not-json", { status: 200 })
  });
  await assert.rejects(
    invalidJsonClient.requestItems("division", buildMonthRange(2026, 8)),
    (error) => error.kind === "invalid-response" && error.dataset === DATASETS.division && error.body === "not-json"
  );

  const invalidDataClient = createApiClient(context, {
    fetchImpl: async () => jsonResponse({ Result: [] })
  });
  await assert.rejects(
    invalidDataClient.requestItems("category", buildMonthRange(2026, 8)),
    (error) => error.kind === "invalid-response" && error.dataset === DATASETS.category
  );
});

test("network failures are handled without leaking token data", async () => {
  const client = createApiClient(context, {
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
