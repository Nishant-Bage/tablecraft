import { useEffect, useId, useMemo, useRef, useState } from "react";
import {
  deriveRows,
  pageRows,
  togglePageSelection,
  type Sort,
} from "./model.js";
import type { DataTableProps } from "./types.js";

function SelectPage({
  checked,
  mixed,
  onChange,
}: {
  checked: boolean;
  mixed: boolean;
  onChange: (checked: boolean) => void;
}) {
  const ref = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (ref.current) ref.current.indeterminate = mixed;
  }, [mixed]);
  return (
    <input
      ref={ref}
      type="checkbox"
      aria-label="Select current page"
      checked={checked}
      onChange={(event) => onChange(event.target.checked)}
    />
  );
}
export function DataTable<T>({
  data,
  columns,
  getRowId,
  getRowLabel = getRowId,
  caption,
  initialPageSize = 10,
  selection,
  toolbar,
  emptyMessage = "No rows match your filters.",
}: DataTableProps<T>) {
  const id = useId();
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<Sort>(null);
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(
    Math.max(1, Math.floor(initialPageSize) || 10),
  );
  const [hidden, setHidden] = useState<string[]>([]);
  const shown = columns.filter((col) => !hidden.includes(col.id));
  const filtered = useMemo(
    () => deriveRows(data, columns, query, sort),
    [data, columns, query, sort],
  );
  const pagination = pageRows(filtered, page, size);
  const selected = new Set(selection?.ids ?? []);
  const pageIds = pagination.rows.map(getRowId);
  const selectedOnPage = pageIds.filter((rowId) => selected.has(rowId)).length;
  const pageSizes = [...new Set([5, 10, 25, 50, size])].sort((a, b) => a - b);
  function toggleColumn(columnId: string) {
    if (hidden.includes(columnId)) {
      setHidden(hidden.filter((value) => value !== columnId));
      return;
    }
    if (shown.length === 1) return;
    setHidden([...hidden, columnId]);
    if (sort?.id === columnId) setSort(null);
  }
  return (
    <div className="tc">
      <div className="tc-toolbar">
        <label className="tc-search">
          <span className="tc-sr">Search {caption}</span>
          <input
            type="search"
            value={query}
            placeholder="Search all columns…"
            onChange={(event) => {
              setQuery(event.target.value);
              setPage(1);
            }}
          />
        </label>
        {toolbar}
        <details className="tc-columns">
          <summary>
            Columns <span aria-hidden="true">▤</span>
          </summary>
          <fieldset>
            <legend>Visible columns</legend>
            {columns.map((col) => (
              <label key={col.id}>
                <input
                  type="checkbox"
                  checked={!hidden.includes(col.id)}
                  disabled={
                    col.hideable === false ||
                    (!hidden.includes(col.id) && shown.length === 1)
                  }
                  onChange={() => toggleColumn(col.id)}
                />
                {col.header}
              </label>
            ))}
          </fieldset>
        </details>
      </div>
      {selection && selection.ids.length > 0 && (
        <div className="tc-selection" role="status">
          {selection.ids.length} selected across pages and filters
          <button onClick={() => selection.onChange([])}>
            Clear selection
          </button>
        </div>
      )}
      <div
        className="tc-scroll"
        role="region"
        aria-label={`${caption} table`}
        tabIndex={0}
      >
        <table>
          <caption className="tc-sr">
            {caption}. Use column header buttons to sort. Tab to controls; Enter
            or Space activates them.
          </caption>
          <thead>
            <tr>
              {selection && (
                <th scope="col" className="tc-check">
                  {pageIds.length > 0 && (
                    <SelectPage
                      checked={selectedOnPage === pageIds.length}
                      mixed={
                        selectedOnPage > 0 && selectedOnPage < pageIds.length
                      }
                      onChange={(checked) =>
                        selection.onChange(
                          togglePageSelection(selection.ids, pageIds, checked),
                        )
                      }
                    />
                  )}
                </th>
              )}
              {shown.map((col) => (
                <th
                  key={col.id}
                  scope="col"
                  style={{ textAlign: col.align }}
                  aria-sort={
                    sort?.id === col.id
                      ? sort.direction === "asc"
                        ? "ascending"
                        : "descending"
                      : undefined
                  }
                >
                  {col.sortable !== false ? (
                    <button
                      className="tc-sort"
                      onClick={() => {
                        setSort(
                          sort?.id === col.id
                            ? sort.direction === "asc"
                              ? { id: col.id, direction: "desc" }
                              : null
                            : { id: col.id, direction: "asc" },
                        );
                        setPage(1);
                      }}
                    >
                      {col.header}
                      <span aria-hidden="true">
                        {sort?.id === col.id
                          ? sort.direction === "asc"
                            ? "↑"
                            : "↓"
                          : "↕"}
                      </span>
                    </button>
                  ) : (
                    col.header
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {pagination.rows.map((row) => (
              <tr
                key={getRowId(row)}
                data-selected={selected.has(getRowId(row)) || undefined}
              >
                {selection && (
                  <td className="tc-check">
                    <input
                      type="checkbox"
                      aria-label={`Select ${getRowLabel(row)}`}
                      checked={selected.has(getRowId(row))}
                      onChange={(event) =>
                        selection.onChange(
                          togglePageSelection(
                            selection.ids,
                            [getRowId(row)],
                            event.target.checked,
                          ),
                        )
                      }
                    />
                  </td>
                )}
                {shown.map((col) => (
                  <td key={col.id} style={{ textAlign: col.align }}>
                    {col.render
                      ? col.render(row)
                      : String(col.value(row) ?? "—")}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        {!pagination.rows.length && (
          <div className="tc-empty">
            {emptyMessage}
            <button
              onClick={() => {
                setQuery("");
                setSort(null);
                setPage(1);
              }}
            >
              Reset search and sort
            </button>
          </div>
        )}
      </div>
      <div className="tc-footer">
        <span id={`${id}-count`} role="status">
          Showing {pagination.start}–{pagination.end} of {filtered.length} rows
        </span>
        <div>
          <label>
            Rows per page{" "}
            <select
              value={size}
              onChange={(event) => {
                setSize(Number(event.target.value));
                setPage(1);
              }}
            >
              {pageSizes.map((value) => (
                <option key={value}>{value}</option>
              ))}
            </select>
          </label>
          <nav aria-label={`${caption} pagination`}>
            <button
              aria-label="Previous page"
              disabled={pagination.page === 1}
              onClick={() => setPage(pagination.page - 1)}
            >
              ‹
            </button>
            <span>
              Page {pagination.page} of {pagination.pages}
            </span>
            <button
              aria-label="Next page"
              disabled={pagination.page === pagination.pages}
              onClick={() => setPage(pagination.page + 1)}
            >
              ›
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
}
