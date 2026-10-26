import { DATASETS, SCOPE_KEYS } from "./constants.js";

export class DatasetValidationError extends Error {
  constructor(dataset, detail) {
    super(`${dataset} returned invalid data`);
    this.name = "DatasetValidationError";
    this.kind = "invalid-response";
    this.dataset = dataset;
    this.status = null;
    this.body = null;
    this.detail = detail;
  }
}

export function mapPeriods(items) {
  requireArray(items, DATASETS.periods);
  const periods = items.map((row, index) => {
    requireRow(row, DATASETS.periods, index);
    const year = requireInteger(row.Year, "Year", DATASETS.periods, index, { min: 1000, max: 9999 });
    const month = requireInteger(row.Month, "Month", DATASETS.periods, index, { min: 1, max: 12 });
    const label = requireString(row.Label, "Label", DATASETS.periods, index);
    const eventCount = requireCount(row.EventCount, "EventCount", DATASETS.periods, index);
    return { year, month, label, eventCount, available: eventCount > 0 };
  });

  const seen = new Set();
  for (const period of periods) {
    const key = `${period.year}-${period.month}`;
    if (seen.has(key)) invalid(DATASETS.periods, `Duplicate period ${key}`);
    seen.add(key);
  }

  return periods.sort((a, b) => a.year - b.year || a.month - b.month);
}

export function mapDivision(items) {
  requireArray(items, DATASETS.division);
  const rows = items.map((row, index) => {
    requireRow(row, DATASETS.division, index);
    return {
      label: requireString(row.DivisionName, "DivisionName", DATASETS.division, index),
      count: requireCount(row.EventCount, "EventCount", DATASETS.division, index)
    };
  });
  requireUniqueLabels(rows, DATASETS.division, "all");
  return rows.sort(byCountThenLabel);
}

export function mapSummary(items) {
  requireArray(items, DATASETS.summary);
  const rows = items.map((row, index) => {
    requireRow(row, DATASETS.summary, index);
    const key = requireScope(row.ScopeKey, DATASETS.summary, index);
    const mapped = {
      key,
      label: requireString(row.ScopeLabel, "ScopeLabel", DATASETS.summary, index),
      order: requireInteger(row.ScopeOrder, "ScopeOrder", DATASETS.summary, index, { min: 1 }),
      eventCount: requireCount(row.EventCount, "EventCount", DATASETS.summary, index),
      closedCount: requireCount(row.ClosedCount, "ClosedCount", DATASETS.summary, index),
      eligibleDurationCount: requireCount(
        row.EligibleDurationCount,
        "EligibleDurationCount",
        DATASETS.summary,
        index
      ),
      invalidDurationCount: requireCount(
        row.InvalidDurationCount,
        "InvalidDurationCount",
        DATASETS.summary,
        index
      ),
      averageCloseDays: requireNullableNumber(
        row.AverageCloseDays,
        "AverageCloseDays",
        DATASETS.summary,
        index
      )
    };
    validateDurationCounts(mapped, DATASETS.summary, `scope ${key}`);
    validateScopeMetadata(mapped, DATASETS.summary, index);
    if (mapped.closedCount > mapped.eventCount) {
      invalid(DATASETS.summary, `ClosedCount cannot exceed EventCount for scope ${key}`);
    }
    return mapped;
  });

  requireExactlyOneScope(rows, DATASETS.summary);
  return rows.sort((a, b) => a.order - b.order);
}

export function mapCategory(items) {
  requireArray(items, DATASETS.category);
  const result = emptyScopes();

  items.forEach((row, index) => {
    requireRow(row, DATASETS.category, index);
    const key = requireScope(row.ScopeKey, DATASETS.category, index);
    const mapped = {
      key,
      scopeLabel: requireString(row.ScopeLabel, "ScopeLabel", DATASETS.category, index),
      order: requireInteger(row.ScopeOrder, "ScopeOrder", DATASETS.category, index, { min: 1 }),
      label: requireString(row.CategoryName, "CategoryName", DATASETS.category, index),
      count: requireCount(row.EventCount, "EventCount", DATASETS.category, index)
    };
    validateScopeMetadata(mapped, DATASETS.category, index);
    result[key].push(mapped);
  });

  for (const key of SCOPE_KEYS) {
    requireUniqueLabels(result[key], DATASETS.category, key);
    result[key].sort(byCountThenLabel);
  }
  return result;
}

export function mapClosure(items) {
  requireArray(items, DATASETS.closure);
  const result = emptyScopes();

  items.forEach((row, index) => {
    requireRow(row, DATASETS.closure, index);
    const key = requireScope(row.ScopeKey, DATASETS.closure, index);
    const mapped = {
      key,
      scopeLabel: requireString(row.ScopeLabel, "ScopeLabel", DATASETS.closure, index),
      order: requireInteger(row.ScopeOrder, "ScopeOrder", DATASETS.closure, index, { min: 1 }),
      label: requireString(row.CategoryName, "CategoryName", DATASETS.closure, index),
      closedCount: requireCount(row.ClosedCount, "ClosedCount", DATASETS.closure, index),
      eligibleDurationCount: requireCount(
        row.EligibleDurationCount,
        "EligibleDurationCount",
        DATASETS.closure,
        index
      ),
      invalidDurationCount: requireCount(
        row.InvalidDurationCount,
        "InvalidDurationCount",
        DATASETS.closure,
        index
      ),
      averageCloseDays: requireNullableNumber(
        row.AverageCloseDays,
        "AverageCloseDays",
        DATASETS.closure,
        index
      )
    };
    validateDurationCounts(mapped, DATASETS.closure, `row ${index}`);
    validateScopeMetadata(mapped, DATASETS.closure, index);
    result[key].push(mapped);
  });

  for (const key of SCOPE_KEYS) {
    requireUniqueLabels(result[key], DATASETS.closure, key);
    result[key].sort((a, b) => {
      if (a.averageCloseDays === null) return b.averageCloseDays === null ? a.label.localeCompare(b.label) : 1;
      if (b.averageCloseDays === null) return -1;
      return b.averageCloseDays - a.averageCloseDays || a.label.localeCompare(b.label);
    });
  }
  return result;
}

export function mapDashboardDatasets(raw) {
  const division = mapDivision(raw.division);
  const summary = mapSummary(raw.summary);
  const category = mapCategory(raw.category);
  const closure = mapClosure(raw.closure);
  validateReconciliation({ division, summary, category, closure });

  return {
    division,
    summary,
    category,
    closure,
    isEmpty: summary.reduce((sum, row) => sum + row.eventCount, 0) === 0
  };
}

export function validateReconciliation(data, averageTolerance = 0.05) {
  const divisionTotal = sum(data.division, "count");
  const summaryTotal = sum(data.summary, "eventCount");
  if (divisionTotal !== summaryTotal) {
    invalid("reconciliation", "Division total does not equal summary total");
  }

  for (const key of SCOPE_KEYS) {
    const summary = data.summary.find((row) => row.key === key);
    if (!summary) invalid("reconciliation", `Missing summary scope ${key}`);

    if (sum(data.category[key], "count") !== summary.eventCount) {
      invalid("reconciliation", `Category total does not equal ${key} summary total`);
    }

    const closure = data.closure[key];
    for (const closureRow of closure) {
      const categoryRow = data.category[key].find((row) => row.label === closureRow.label);
      if (!categoryRow || closureRow.closedCount > categoryRow.count) {
        invalid("reconciliation", `Closure category ${closureRow.label} is invalid for ${key}`);
      }
    }
    if (sum(closure, "closedCount") !== summary.closedCount
      || sum(closure, "eligibleDurationCount") !== summary.eligibleDurationCount
      || sum(closure, "invalidDurationCount") !== summary.invalidDurationCount) {
      invalid("reconciliation", `Closure counts do not equal ${key} summary counts`);
    }

    if (summary.eligibleDurationCount === 0) {
      if (summary.averageCloseDays !== null) {
        invalid("reconciliation", `${key} average must be null when no duration is eligible`);
      }
      continue;
    }

    const weightedTotal = closure.reduce((total, row) => (
      total + (row.averageCloseDays ?? 0) * row.eligibleDurationCount
    ), 0);
    const weightedAverage = weightedTotal / summary.eligibleDurationCount;
    if (summary.averageCloseDays === null
      || Math.abs(weightedAverage - summary.averageCloseDays) > averageTolerance) {
      invalid("reconciliation", `${key} weighted closure average does not match summary`);
    }
  }

  return true;
}

export function selectLatestPeriod(periods, year = null) {
  const available = periods.filter((period) => period.available && (year === null || period.year === year));
  return available.length ? available[available.length - 1] : null;
}

export function yearsFromPeriods(periods) {
  return [...new Set(periods.filter((period) => period.available).map((period) => period.year))]
    .sort((a, b) => b - a);
}

function validateDurationCounts(row, dataset, location) {
  if (row.closedCount !== row.eligibleDurationCount + row.invalidDurationCount) {
    invalid(dataset, `Closed-count reconciliation failed for ${location}`);
  }
  if (row.eligibleDurationCount === 0 && row.averageCloseDays !== null) {
    invalid(dataset, `Average must be null when no duration is eligible for ${location}`);
  }
  if (row.eligibleDurationCount > 0 && row.averageCloseDays === null) {
    invalid(dataset, `Average is required when eligible durations exist for ${location}`);
  }
}

function validateScopeMetadata(row, dataset, index) {
  const expected = row.key === "headquarters"
    ? { label: "מטה", order: 1 }
    : { label: "סניפים", order: 2 };
  const scopeLabel = Object.hasOwn(row, "scopeLabel") ? row.scopeLabel : row.label;
  if (scopeLabel !== expected.label || row.order !== expected.order) {
    invalid(dataset, `Row ${index} contains invalid scope metadata`);
  }
}

function requireUniqueLabels(rows, dataset, scope) {
  const labels = new Set();
  for (const row of rows) {
    if (labels.has(row.label)) invalid(dataset, `Duplicate label ${row.label} in scope ${scope}`);
    labels.add(row.label);
  }
}

function requireExactlyOneScope(rows, dataset) {
  if (rows.length !== SCOPE_KEYS.length) invalid(dataset, "Summary must contain exactly two scope rows");
  for (const key of SCOPE_KEYS) {
    if (rows.filter((row) => row.key === key).length !== 1) {
      invalid(dataset, `Summary must contain exactly one ${key} row`);
    }
  }
}

function requireArray(value, dataset) {
  if (!Array.isArray(value)) invalid(dataset, "Dataset must be an array");
}

function requireRow(row, dataset, index) {
  if (!row || typeof row !== "object" || Array.isArray(row)) invalid(dataset, `Row ${index} is invalid`);
}

function requireString(value, field, dataset, index) {
  if (typeof value !== "string" || value.trim() === "") invalid(dataset, `Row ${index} field ${field} must be text`);
  return value;
}

function requireInteger(value, field, dataset, index, { min = Number.MIN_SAFE_INTEGER, max = Number.MAX_SAFE_INTEGER } = {}) {
  const parsed = coerceNumber(value, field, dataset, index);
  if (!Number.isSafeInteger(parsed) || parsed < min || parsed > max) {
    invalid(dataset, `Row ${index} field ${field} must be an integer in range`);
  }
  return parsed;
}

function requireCount(value, field, dataset, index) {
  const parsed = requireInteger(value, field, dataset, index, { min: 0 });
  if (parsed < 0) {
    invalid(dataset, `Row ${index} field ${field} must be an integer in range`);
  }
  return parsed;
}

function requireNullableNumber(value, field, dataset, index) {
  if (value === null) return null;
  const parsed = coerceNumber(value, field, dataset, index);
  if (!Number.isFinite(parsed) || parsed < 0) {
    invalid(dataset, `Row ${index} field ${field} must be a non-negative number or null`);
  }
  return parsed;
}

function coerceNumber(value, field, dataset, index) {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string") {
    const normalized = value.trim();
    if (!normalized) {
      invalid(dataset, `Row ${index} field ${field} must be numeric`);
    }
    const parsed = Number(normalized);
    if (!Number.isFinite(parsed)) {
      invalid(dataset, `Row ${index} field ${field} must be numeric`);
    }
    return parsed;
  }
  invalid(dataset, `Row ${index} field ${field} must be numeric`);
}

function requireScope(value, dataset, index) {
  if (!SCOPE_KEYS.includes(value)) invalid(dataset, `Row ${index} contains an invalid ScopeKey`);
  return value;
}

function emptyScopes() {
  return { headquarters: [], branches: [] };
}

function sum(rows, field) {
  return rows.reduce((total, row) => total + row[field], 0);
}

function byCountThenLabel(a, b) {
  return b.count - a.count || a.label.localeCompare(b.label);
}

function invalid(dataset, detail) {
  console.warn("[milgam-dashboard.mappers]", `Invalid ${dataset} data:`, detail);
  throw new DatasetValidationError(dataset, detail);
}
