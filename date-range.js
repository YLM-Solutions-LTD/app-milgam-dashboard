const pad2 = (value) => String(value).padStart(2, "0");

export function daysInMonth(year, month) {
  assertYearMonth(year, month);
  return new Date(Date.UTC(year, month, 0)).getUTCDate();
}

export function buildMonthRange(year, month) {
  assertYearMonth(year, month);
  const prefix = `${year}-${pad2(month)}`;
  return {
    FromDate: `${prefix}-01T00:00:00`,
    ToDate: `${prefix}-${pad2(daysInMonth(year, month))}T23:59:59`
  };
}

export function buildPeriodDiscoveryRange(now = new Date()) {
  if (!(now instanceof Date) || Number.isNaN(now.getTime())) {
    throw new TypeError("A valid current date is required");
  }

  return {
    FromDate: "2000-01-01T00:00:00",
    ToDate: buildMonthRange(now.getFullYear(), now.getMonth() + 1).ToDate
  };
}

export function buildSearchBody(range) {
  if (!range || typeof range.FromDate !== "string" || typeof range.ToDate !== "string") {
    throw new TypeError("A valid date range is required");
  }

  return {
    PageIndex: 1,
    StartIndex: 0,
    PageSize: 1000,
    Filter: null,
    OrderBy: null,
    SortDirection: null,
    OrderBySecondary: null,
    SortDirectionSecondary: null,
    ItemStatus: 0,
    FromDate: range.FromDate,
    ToDate: range.ToDate
  };
}

function assertYearMonth(year, month) {
  if (!Number.isInteger(year) || year < 1000 || year > 9999) {
    throw new RangeError("Year must be a four-digit integer");
  }
  if (!Number.isInteger(month) || month < 1 || month > 12) {
    throw new RangeError("Month must be an integer from 1 through 12");
  }
}
