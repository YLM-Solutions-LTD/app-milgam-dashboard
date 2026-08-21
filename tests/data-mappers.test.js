import test from "node:test";
import assert from "node:assert/strict";

import {
  DatasetValidationError,
  mapCategory,
  mapClosure,
  mapDashboardDatasets,
  mapDivision,
  mapPeriods,
  mapSummary,
  selectLatestPeriod,
  validateReconciliation,
  yearsFromPeriods
} from "../data-mappers.js";

const raw = {
  periods: [
    { Year: 2025, Month: 12, Label: "12/25", EventCount: 7 },
    { Year: 2026, Month: 1, Label: "1/26", EventCount: 5 },
    { Year: 2026, Month: 2, Label: "2/26", EventCount: 0 }
  ],
  division: [
    { DivisionName: "חטיבה א", EventCount: 3 },
    { DivisionName: "חטיבה ב", EventCount: 2 }
  ],
  summary: [
    {
      ScopeKey: "headquarters",
      ScopeLabel: "מטה",
      ScopeOrder: 1,
      EventCount: 3,
      ClosedCount: 2,
      EligibleDurationCount: 1,
      InvalidDurationCount: 1,
      AverageCloseDays: 2
    },
    {
      ScopeKey: "branches",
      ScopeLabel: "סניפים",
      ScopeOrder: 2,
      EventCount: 2,
      ClosedCount: 1,
      EligibleDurationCount: 1,
      InvalidDurationCount: 0,
      AverageCloseDays: 4
    }
  ],
  category: [
    { ScopeKey: "headquarters", ScopeLabel: "מטה", ScopeOrder: 1, CategoryName: "אחזקה", EventCount: 3 },
    { ScopeKey: "branches", ScopeLabel: "סניפים", ScopeOrder: 2, CategoryName: "ניקיון", EventCount: 2 }
  ],
  closure: [
    {
      ScopeKey: "headquarters",
      ScopeLabel: "מטה",
      ScopeOrder: 1,
      CategoryName: "אחזקה",
      ClosedCount: 2,
      EligibleDurationCount: 1,
      InvalidDurationCount: 1,
      AverageCloseDays: 2
    },
    {
      ScopeKey: "branches",
      ScopeLabel: "סניפים",
      ScopeOrder: 2,
      CategoryName: "ניקיון",
      ClosedCount: 1,
      EligibleDurationCount: 1,
      InvalidDurationCount: 0,
      AverageCloseDays: 4
    }
  ]
};

test("MilgamDashboardByMonth maps exact fields and chooses latest available period", () => {
  const periods = mapPeriods(raw.periods);
  assert.deepEqual(periods[0], {
    year: 2025,
    month: 12,
    label: "12/25",
    eventCount: 7,
    available: true
  });
  assert.deepEqual(selectLatestPeriod(periods), periods[1]);
  assert.deepEqual(selectLatestPeriod(periods, 2025), periods[0]);
  assert.deepEqual(yearsFromPeriods(periods), [2026, 2025]);
});

test("MilgamDashboardByDivision maps exact fields and sorts counts descending", () => {
  assert.deepEqual(mapDivision(raw.division), [
    { label: "חטיבה א", count: 3 },
    { label: "חטיבה ב", count: 2 }
  ]);
});

test("MilgamDashboardSummary maps visible metrics and retains duration validation counts", () => {
  const summary = mapSummary(raw.summary);
  assert.deepEqual(summary[0], {
    key: "headquarters",
    label: "מטה",
    order: 1,
    eventCount: 3,
    closedCount: 2,
    eligibleDurationCount: 1,
    invalidDurationCount: 1,
    averageCloseDays: 2
  });
  assert.equal(summary[1].key, "branches");
});

test("MilgamDashboardByCategory filters exact ScopeKey values into both category charts", () => {
  const category = mapCategory(raw.category);
  assert.deepEqual(category.headquarters[0], {
    key: "headquarters",
    scopeLabel: "מטה",
    order: 1,
    label: "אחזקה",
    count: 3
  });
  assert.deepEqual(category.branches[0], {
    key: "branches",
    scopeLabel: "סניפים",
    order: 2,
    label: "ניקיון",
    count: 2
  });
});

test("MilgamDashboardClosureByCategory filters scopes and retains all reconciliation counts", () => {
  const closure = mapClosure(raw.closure);
  assert.deepEqual(closure.headquarters[0], {
    key: "headquarters",
    scopeLabel: "מטה",
    order: 1,
    label: "אחזקה",
    closedCount: 2,
    eligibleDurationCount: 1,
    invalidDurationCount: 1,
    averageCloseDays: 2
  });
  assert.equal(closure.branches[0].averageCloseDays, 4);
});

test("dashboard mapping reconciles division, summary, category, and weighted closure totals", () => {
  const mapped = mapDashboardDatasets(raw);
  assert.equal(mapped.isEmpty, false);
  assert.equal(validateReconciliation(mapped), true);
});

test("valid empty selected-month datasets map to an empty dashboard without fabricating data", () => {
  const empty = mapDashboardDatasets({
    division: [],
    summary: [
      {
        ScopeKey: "headquarters", ScopeLabel: "מטה", ScopeOrder: 1, EventCount: 0,
        ClosedCount: 0, EligibleDurationCount: 0, InvalidDurationCount: 0, AverageCloseDays: null
      },
      {
        ScopeKey: "branches", ScopeLabel: "סניפים", ScopeOrder: 2, EventCount: 0,
        ClosedCount: 0, EligibleDurationCount: 0, InvalidDurationCount: 0, AverageCloseDays: null
      }
    ],
    category: [],
    closure: []
  });

  assert.equal(empty.isEmpty, true);
  assert.deepEqual(empty.division, []);
  assert.deepEqual(empty.category, { headquarters: [], branches: [] });
  assert.deepEqual(empty.closure, { headquarters: [], branches: [] });
  assert.equal(empty.summary[0].averageCloseDays, null);
});

test("missing scopes, invalid fields, and reconciliation mismatches are rejected dataset-specifically", () => {
  assert.throws(() => mapSummary(raw.summary.slice(0, 1)), DatasetValidationError);
  assert.deepEqual(mapDivision([{ DivisionName: "x", EventCount: "3" }]), [{ label: "x", count: 3 }]);
  assert.throws(() => mapDivision([{ DivisionName: "x", EventCount: "not-a-number" }]), DatasetValidationError);
  assert.throws(() => mapCategory([{ ...raw.category[0], ScopeKey: "other" }]), DatasetValidationError);
  assert.throws(() => mapDashboardDatasets({
    ...raw,
    division: [{ DivisionName: "חטיבה א", EventCount: 99 }]
  }), (error) => error instanceof DatasetValidationError && error.dataset === "reconciliation");
  assert.throws(() => mapDashboardDatasets({
    ...raw,
    category: [{ ...raw.category[0], EventCount: 2 }, raw.category[1]]
  }), (error) => error instanceof DatasetValidationError && error.dataset === "reconciliation");
  assert.throws(() => mapDashboardDatasets({
    ...raw,
    closure: [{ ...raw.closure[0], AverageCloseDays: 9 }, raw.closure[1]]
  }), (error) => error instanceof DatasetValidationError && error.dataset === "reconciliation");
});

test("null closure averages are retained and never coerced to zero", () => {
  const closure = mapClosure([{
    ScopeKey: "headquarters",
    ScopeLabel: "מטה",
    ScopeOrder: 1,
    CategoryName: "ללא משך",
    ClosedCount: 1,
    EligibleDurationCount: 0,
    InvalidDurationCount: 1,
    AverageCloseDays: null
  }]);
  assert.equal(closure.headquarters[0].averageCloseDays, null);
});
