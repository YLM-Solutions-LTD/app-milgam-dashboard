# Milgam Dashboard Entity-Report Procedure Contract

## 1. Purpose and ownership

This document defines the external data contract required by the `milgam-dashboard` hosted mini-app.

It is an implementation specification for a separate SimplyLog/database workstream. The mini-app workstream assumes these reports exist and must not create or modify them.

Required reports:

1. `dbo.Report_ByEntity_MilgamDashboardByMonth`
2. `dbo.Report_ByEntity_MilgamDashboardByDivision`
3. `dbo.Report_ByEntity_MilgamDashboardSummary`
4. `dbo.Report_ByEntity_MilgamDashboardByCategory`
5. `dbo.Report_ByEntity_MilgamDashboardClosureByCategory`

## 2. Entity endpoint naming convention

For:

`dbo.Report_ByEntity_<EntityName>`

the mini-app calls:

`POST {ApiAddress}/api/Entity/<EntityName>/Search`

The URL omits `dbo.` and `Report_ByEntity_`.

| Procedure | Exact endpoint |
| --- | --- |
| `dbo.Report_ByEntity_MilgamDashboardByMonth` | `POST /api/Entity/MilgamDashboardByMonth/Search` |
| `dbo.Report_ByEntity_MilgamDashboardByDivision` | `POST /api/Entity/MilgamDashboardByDivision/Search` |
| `dbo.Report_ByEntity_MilgamDashboardSummary` | `POST /api/Entity/MilgamDashboardSummary/Search` |
| `dbo.Report_ByEntity_MilgamDashboardByCategory` | `POST /api/Entity/MilgamDashboardByCategory/Search` |
| `dbo.Report_ByEntity_MilgamDashboardClosureByCategory` | `POST /api/Entity/MilgamDashboardClosureByCategory/Search` |

No endpoint contains `Report_ByEntity_` or `*`.

## 3. Common logical inputs

All reports consume the date/status inputs delivered by the existing dynamic entity-search mechanism:

- `FromDate`: inclusive start date/time;
- `ToDate`: inclusive end date/time;
- `ItemStatus`: `0` for active records.

The selected-month request body is:

```json
{
  "PageIndex": 1,
  "StartIndex": 0,
  "PageSize": 1000,
  "Filter": null,
  "OrderBy": null,
  "SortDirection": null,
  "OrderBySecondary": null,
  "SortDirectionSecondary": null,
  "ItemStatus": 0,
  "FromDate": "2026-08-01T00:00:00",
  "ToDate": "2026-08-31T23:59:59"
}
```

The client does not send username, location path, API key, or database parameters. Authenticated-user scoping is a server concern and must use the same trusted identity/location scope as SimplyLog.

## 4. Common data rules

Unless a report section overrides a rule:

- base table/view concept: SimplyLog events;
- active population: `RowStatus = 0`;
- date field: `StartTime`;
- date predicate: `StartTime >= FromDate AND StartTime <= ToDate`;
- count grain: distinct event ID;
- authenticated location scope: required;
- headquarters: resolved root `SiteGeoGroupId = 4`;
- branches: all other events, including unresolved site geo group;
- category: `CategoryLevel0`;
- division: `LocationLevel0`;
- null/blank labels: `לא משויך`;
- closed event: `Status = 2`;
- valid closure duration: `CloseTime IS NOT NULL AND CloseTime >= StartTime`;
- average close days: `AVG(DATEDIFF(minute, StartTime, CloseTime)) / 1440.0`;
- average values: decimal numbers, never formatted strings;
- no eligible durations: return `null` average.

The report implementation must resolve the site geo group through the event location hierarchy. It must not assume that an event location entity is itself a Site.

## 5. Common API response envelope

The existing entity-search layer wraps result rows:

```json
{
  "Items": [],
  "IsPaged": true,
  "StartIndex": 0,
  "PageIndex": 1,
  "PageSize": 1000,
  "TotalCount": 0
}
```

Procedure result-column names must be returned exactly as defined below so they appear unchanged inside `Items`.

Aggregate result sets must contain at most 1,000 rows.

## 6. Report: MilgamDashboardByMonth

### Purpose

Populate the year/month selectors and determine the latest period containing active scoped events.

### Endpoint

`POST /api/Entity/MilgamDashboardByMonth/Search`

### Date range

The mini-app initially sends:

- `FromDate = 2000-01-01T00:00:00`
- `ToDate = final day of the current month at 23:59:59`

### Result grain

One row per calendar year/month containing at least one event.

### Required columns

| Column | Type | Null | Meaning |
| --- | --- | --- | --- |
| `Year` | Int32 | No | Four-digit StartTime year |
| `Month` | Int32 | No | StartTime month, 1–12 |
| `Label` | String | No | `M/YY`, for example `8/26` |
| `EventCount` | Int64 | No | Distinct active scoped events in the month |

### Expected Items example

```json
[
  {
    "Year": 2026,
    "Month": 8,
    "Label": "8/26",
    "EventCount": 42
  }
]
```

### Ordering

`Year ASC, Month ASC`.

### UI mapping

- `Year` and `Month`: selector values.
- `Label`: diagnostic/accessible period label.
- `EventCount`: determines whether a period is available; it is not used to calculate another panel.

## 7. Report: MilgamDashboardByDivision

### Purpose

Supply the `חלוקה לפי חטיבות` pie/donut.

### Endpoint

`POST /api/Entity/MilgamDashboardByDivision/Search`

### Result grain

One row per normalized `LocationLevel0`.

### Required columns

| Column | Type | Null | Meaning |
| --- | --- | --- | --- |
| `DivisionName` | String | No | LocationLevel0 or `לא משויך` |
| `EventCount` | Int64 | No | Distinct active scoped events |

### Expected Items example

```json
[
  {
    "DivisionName": "חטיבת אחזקה",
    "EventCount": 350
  },
  {
    "DivisionName": "חטיבת תפעול",
    "EventCount": 230
  }
]
```

### Ordering

`EventCount DESC, DivisionName ASC`.

### UI mapping

- `DivisionName -> pie label`
- `EventCount -> count`
- percentage is calculated by the mini-app over the sum of `EventCount`.

## 8. Report: MilgamDashboardSummary

### Purpose

Supply:

- headquarters-versus-branches event volume;
- headquarters closed-count and average-close-days cards;
- branches closed-count and average-close-days cards.

### Endpoint

`POST /api/Entity/MilgamDashboardSummary/Search`

### Result grain

Exactly one row for each `ScopeKey`: two rows total for a valid request, including zero-count rows.

### Required columns

| Column | Type | Null | Meaning |
| --- | --- | --- | --- |
| `ScopeKey` | String | No | Exactly `headquarters` or `branches` |
| `ScopeLabel` | String | No | `מטה` or `סניפים` |
| `ScopeOrder` | Int32 | No | Headquarters 1, branches 2 |
| `EventCount` | Int64 | No | All active events in the scope |
| `ClosedCount` | Int64 | No | Scope events where Status = 2 |
| `EligibleDurationCount` | Int64 | No | Closed events included in the average |
| `InvalidDurationCount` | Int64 | No | ClosedCount minus EligibleDurationCount |
| `AverageCloseDays` | Decimal | Yes | Average valid duration in days |

### Expected Items example

```json
[
  {
    "ScopeKey": "headquarters",
    "ScopeLabel": "מטה",
    "ScopeOrder": 1,
    "EventCount": 400,
    "ClosedCount": 90,
    "EligibleDurationCount": 88,
    "InvalidDurationCount": 2,
    "AverageCloseDays": 2.4
  },
  {
    "ScopeKey": "branches",
    "ScopeLabel": "סניפים",
    "ScopeOrder": 2,
    "EventCount": 600,
    "ClosedCount": 140,
    "EligibleDurationCount": 137,
    "InvalidDurationCount": 3,
    "AverageCloseDays": 3.1
  }
]
```

### Ordering

`ScopeOrder ASC`.

### UI mapping

- stacked bar: `ScopeKey`, `ScopeLabel`, `EventCount`;
- matching KPI cards: `ClosedCount`, `AverageCloseDays`;
- `EligibleDurationCount` and `InvalidDurationCount`: reconciliation/quality checks, not additional visible cards.

## 9. Report: MilgamDashboardByCategory

### Purpose

Supply both horizontal category-mix charts.

### Endpoint

`POST /api/Entity/MilgamDashboardByCategory/Search`

### Result grain

One row per `ScopeKey + CategoryName`.

### Required columns

| Column | Type | Null | Meaning |
| --- | --- | --- | --- |
| `ScopeKey` | String | No | `headquarters` or `branches` |
| `ScopeLabel` | String | No | `מטה` or `סניפים` |
| `ScopeOrder` | Int32 | No | 1 or 2 |
| `CategoryName` | String | No | CategoryLevel0 or `לא משויך` |
| `EventCount` | Int64 | No | Distinct active events |

### Expected Items example

```json
[
  {
    "ScopeKey": "headquarters",
    "ScopeLabel": "מטה",
    "ScopeOrder": 1,
    "CategoryName": "אחזקה",
    "EventCount": 120
  },
  {
    "ScopeKey": "branches",
    "ScopeLabel": "סניפים",
    "ScopeOrder": 2,
    "CategoryName": "ניקיון",
    "EventCount": 210
  }
]
```

### Ordering

`ScopeOrder ASC, EventCount DESC, CategoryName ASC`.

### UI mapping

- filter `ScopeKey = headquarters` for `תמהיל קריאות מטה`;
- filter `ScopeKey = branches` for `תמהיל קריאות סניפים`;
- `CategoryName -> bar label`;
- `EventCount -> bar value`.

## 10. Report: MilgamDashboardClosureByCategory

### Purpose

Supply the category average-close-days tables beneath the headquarters and branch KPI cards.

### Endpoint

`POST /api/Entity/MilgamDashboardClosureByCategory/Search`

### Result grain

One row per `ScopeKey + CategoryName` with at least one closed event.

### Required columns

| Column | Type | Null | Meaning |
| --- | --- | --- | --- |
| `ScopeKey` | String | No | `headquarters` or `branches` |
| `ScopeLabel` | String | No | `מטה` or `סניפים` |
| `ScopeOrder` | Int32 | No | 1 or 2 |
| `CategoryName` | String | No | CategoryLevel0 or `לא משויך` |
| `ClosedCount` | Int64 | No | Closed events in the category |
| `EligibleDurationCount` | Int64 | No | Category rows included in average |
| `InvalidDurationCount` | Int64 | No | ClosedCount minus EligibleDurationCount |
| `AverageCloseDays` | Decimal | Yes | Average valid closure duration in days |

### Expected Items example

```json
[
  {
    "ScopeKey": "headquarters",
    "ScopeLabel": "מטה",
    "ScopeOrder": 1,
    "CategoryName": "אחזקה",
    "ClosedCount": 32,
    "EligibleDurationCount": 30,
    "InvalidDurationCount": 2,
    "AverageCloseDays": 2.8
  },
  {
    "ScopeKey": "branches",
    "ScopeLabel": "סניפים",
    "ScopeOrder": 2,
    "CategoryName": "ניקיון",
    "ClosedCount": 51,
    "EligibleDurationCount": 50,
    "InvalidDurationCount": 1,
    "AverageCloseDays": 3.5
  }
]
```

### Ordering

`ScopeOrder ASC, AverageCloseDays DESC, CategoryName ASC`, with null averages last.

### UI mapping

- filter by `ScopeKey` for the corresponding table;
- `CategoryName -> קטגוריה`;
- `AverageCloseDays -> ממוצע זמן סגירה (ימים)`;
- count fields are used for reconciliation and are not visible table columns in version one.

## 11. Response-to-UI mapping matrix

| UI component | Entity | Rows | Fields |
| --- | --- | --- | --- |
| Year/month selectors | `MilgamDashboardByMonth` | All | `Year`, `Month`, `Label`, `EventCount` |
| Division pie | `MilgamDashboardByDivision` | All | `DivisionName`, `EventCount` |
| HQ vs branches | `MilgamDashboardSummary` | Both scopes | `ScopeKey`, `ScopeLabel`, `EventCount` |
| HQ category mix | `MilgamDashboardByCategory` | `headquarters` | `CategoryName`, `EventCount` |
| Branch category mix | `MilgamDashboardByCategory` | `branches` | `CategoryName`, `EventCount` |
| HQ KPI cards | `MilgamDashboardSummary` | `headquarters` | `ClosedCount`, `AverageCloseDays` |
| HQ closure table | `MilgamDashboardClosureByCategory` | `headquarters` | `CategoryName`, `AverageCloseDays` |
| Branch KPI cards | `MilgamDashboardSummary` | `branches` | `ClosedCount`, `AverageCloseDays` |
| Branch closure table | `MilgamDashboardClosureByCategory` | `branches` | `CategoryName`, `AverageCloseDays` |

## 12. Reconciliation requirements

For the same selected month and authenticated scope:

1. Sum of `MilgamDashboardByDivision.EventCount` equals sum of `MilgamDashboardSummary.EventCount`.
2. For each scope, sum of `MilgamDashboardByCategory.EventCount` equals the matching summary `EventCount`.
3. For each scope:

   `ClosedCount = EligibleDurationCount + InvalidDurationCount`

4. For each scope, sums of closure-by-category count fields equal matching summary count fields.
5. The summary `AverageCloseDays` equals the weighted category result:

   `SUM(AverageCloseDays * EligibleDurationCount) / SUM(EligibleDurationCount)`

   Small differences caused by returned decimal rounding are acceptable.
6. Headquarters and branches are mutually exclusive and exhaustive.
7. No event is counted more than once within one report aggregate.

## 13. Empty-result requirements

- `ByMonth`: no rows when no period contains data.
- `ByDivision`: empty rows for a valid selected period with no events.
- `Summary`: always return the two scope rows, with zero counts and null averages.
- `ByCategory`: empty rows when no events exist.
- `ClosureByCategory`: empty rows when no closed events exist.

Returning an empty `Items` array is valid. Omitting `Items` is invalid at the API-contract level.

## 14. Contract validation checklist

- All procedure names match section 1 exactly.
- All result aliases match required column names exactly, including casing.
- All numeric values are JSON numbers rather than formatted strings.
- Counts are non-negative integers.
- `Month` is 1–12 and `Year` is four digits.
- `ScopeKey` contains only `headquarters` or `branches`.
- Summary returns exactly one row for each scope.
- Date filtering uses `StartTime`.
- Authenticated location scoping cannot be overridden by request body.
- Result sets do not exceed 1,000 rows.
- Reconciliation rules pass on seeded test data.
- No token, username, or sensitive value is returned as a result column.

## 15. Change control

The mini-app depends on exact entity names and result aliases. Any incompatible change requires updating both:

- `docs/milgam-dashboard-procedures.spec.md`
- the mini-app response validators/mappers

Adding extra result columns is allowed if existing columns and meanings remain unchanged. Renaming, removing, changing type, or changing metric semantics is a breaking change.
