import { buildMonthRange, buildPeriodDiscoveryRange } from "./date-range.js";
import { mapDashboardDatasets, mapPeriods, selectLatestPeriod } from "./data-mappers.js";

export async function loadPeriods(client, { now = new Date(), signal } = {}) {
  const items = await client.requestItems("periods", buildPeriodDiscoveryRange(now), { signal });
  const periods = mapPeriods(items);
  return { periods, selectedPeriod: selectLatestPeriod(periods) };
}

export async function loadDashboard(client, selectedPeriod, { signal } = {}) {
  if (!selectedPeriod) throw new TypeError("A selected period is required");
  const range = buildMonthRange(selectedPeriod.year, selectedPeriod.month);

  const [division, summary, category, closure] = await Promise.all([
    client.requestItems("division", range, { signal }),
    client.requestItems("summary", range, { signal }),
    client.requestItems("category", range, { signal }),
    client.requestItems("closure", range, { signal })
  ]);

  return mapDashboardDatasets({ division, summary, category, closure });
}
