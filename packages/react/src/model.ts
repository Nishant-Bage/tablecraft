export type CellValue = string | number | boolean | null | undefined;
export type Sort = { id: string; direction: "asc" | "desc" } | null;
export type Accessor<T> = {
  id: string;
  value: (row: T) => CellValue;
  searchable?: boolean;
  compare?: (a: T, b: T) => number;
};
const collator = new Intl.Collator("en", {
  numeric: true,
  sensitivity: "base",
});
export function deriveRows<T>(
  rows: readonly T[],
  columns: readonly Accessor<T>[],
  query: string,
  sort: Sort,
): T[] {
  const term = query.trim().toLocaleLowerCase();
  const filtered = rows.filter(
    (row) =>
      !term ||
      columns.some(
        (col) =>
          col.searchable !== false &&
          String(col.value(row) ?? "")
            .toLocaleLowerCase()
            .includes(term),
      ),
  );
  const column = columns.find((col) => col.id === sort?.id);
  if (!sort || !column) return filtered;
  return filtered.sort((a, b) => {
    const av = column.value(a),
      bv = column.value(b);
    // Missing values stay at the end in either direction.
    if (av == null) return bv == null ? 0 : 1;
    if (bv == null) return -1;
    const order = column.compare
      ? column.compare(a, b)
      : typeof av === "number" && typeof bv === "number"
        ? av - bv
        : collator.compare(String(av), String(bv));
    return sort.direction === "asc" ? order : -order;
  });
}
export function pageRows<T>(
  rows: readonly T[],
  requestedPage: number,
  pageSize: number,
) {
  const size = Math.max(1, Math.floor(pageSize) || 1);
  const pages = Math.max(1, Math.ceil(rows.length / size));
  const page = Math.min(pages, Math.max(1, Math.floor(requestedPage) || 1));
  return {
    rows: rows.slice((page - 1) * size, page * size),
    page,
    pages,
    start: rows.length ? (page - 1) * size + 1 : 0,
    end: Math.min(page * size, rows.length),
  };
}
export function togglePageSelection(
  selected: readonly string[],
  pageIds: readonly string[],
  checked: boolean,
) {
  const next = new Set(selected);
  for (const id of pageIds) {
    if (checked) next.add(id);
    else next.delete(id);
  }
  return [...next];
}
