export const ANALYTICAL_PAGE_SIZE = 10;

export function pageWindow(rows, page, pageSize = ANALYTICAL_PAGE_SIZE) {
  const items = Array.isArray(rows) ? rows : [];
  const size = Number.isSafeInteger(pageSize) && pageSize > 0 ? pageSize : ANALYTICAL_PAGE_SIZE;
  const pageCount = Math.max(1, Math.ceil(items.length / size));
  const index = Math.min(Math.max(Number.isSafeInteger(page) ? page : 0, 0), pageCount - 1);
  const start = index * size;
  const end = Math.min(start + size, items.length);
  return {
    items: items.slice(start, end),
    page: index,
    pageCount,
    start,
    end,
    total: items.length,
    hasPrevious: index > 0,
    hasNext: index + 1 < pageCount
  };
}
