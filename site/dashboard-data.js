import { buildInclusiveRange, buildPeriodDiscoveryRange, monthRangeFromPeriod } from "./date-range.js";
import { mapDashboardDatasets, mapPeriods, selectLatestPeriod } from "./data-mappers.js";

export async function loadPeriods(client, { now = new Date(), signal } = {}) {
  const items = await client.requestItems("periods", buildPeriodDiscoveryRange(now), { signal });
  const periods = mapPeriods(items);
  const selectedPeriod = selectLatestPeriod(periods);
  const fallback = { year: now.getFullYear(), month: now.getMonth() + 1 };
  return { periods, selectedRange: monthRangeFromPeriod(selectedPeriod || fallback) };
}

export async function loadDashboard(client, selectedRange, { signal } = {}) {
  if (!selectedRange) throw new TypeError("A selected range is required");
  const range = buildInclusiveRange(selectedRange.from, selectedRange.to);

  const [division, summary, category, closure] = await Promise.all([
    client.requestItems("division", range, { signal }),
    client.requestItems("summary", range, { signal }),
    client.requestItems("category", range, { signal }),
    client.requestItems("closure", range, { signal })
  ]);

  return mapDashboardDatasets({ division, summary, category, closure });
}
