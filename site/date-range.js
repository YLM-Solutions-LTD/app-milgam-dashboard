const pad2 = (value) => String(value).padStart(2, "0");

export function buildDateRange(fromDate, toDate) {
  assertCalendarDate(fromDate);
  assertCalendarDate(toDate);
  if (fromDate > toDate) throw new RangeError("Start date must not follow end date");
  // The existing reports bind SQL datetime and compare StartTime <= @ToDate.
  // .997 is its last representable instant; .999 would round into the next day.
  // Preserve the existing API's timezone-less calendar representation.
  return { FromDate: `${fromDate}T00:00:00`, ToDate: `${toDate}T23:59:59.997` };
}

export function calendarRangeForMonth(year, month) {
  assertYearMonth(year, month);
  const prefix = `${year}-${pad2(month)}`;
  return { fromDate: `${prefix}-01`, toDate: `${prefix}-${pad2(daysInMonth(year, month))}` };
}

function assertCalendarDate(value) {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) throw new RangeError("A calendar date is required");
  const [year, month, day] = value.split("-").map(Number);
  if (year < 1753 || year > 9999 || month < 1 || month > 12 || day < 1 || day > daysInMonth(year, month)) {
    throw new RangeError("Calendar date is outside the report's supported range");
  }
}

export function daysInMonth(year, month) {
  assertYearMonth(year, month);
  return new Date(Date.UTC(year, month, 0)).getUTCDate();
}

export function buildMonthRange(year, month) {
  const range = calendarRangeForMonth(year, month);
  return buildDateRange(range.fromDate, range.toDate);
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
