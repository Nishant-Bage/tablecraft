# @nishant-bage/tablecraft

A small, typed React table with client-side sorting, search, pagination, controlled selection, and column visibility. This package is currently local and unpublished; npm name availability has not been checked.

## Usage

After building the package, install the locally packed tarball into a React application. Import the stylesheet once.

```tsx
import { DataTable, type Column } from "@nishant-bage/tablecraft";
import "@nishant-bage/tablecraft/styles.css";

type Item = { id: string; name: string; quantity: number };
const columns: Column<Item>[] = [
  { id: "name", header: "Name", value: (row) => row.name, hideable: false },
  {
    id: "quantity",
    header: "Quantity",
    value: (row) => row.quantity,
    align: "right",
  },
];

export function Example({ items }: { items: Item[] }) {
  return (
    <DataTable
      data={items}
      columns={columns}
      getRowId={(row) => row.id}
      caption="Items"
      initialPageSize={10}
    />
  );
}
```

## API

| Prop              | Purpose                                                       |
| ----------------- | ------------------------------------------------------------- |
| `data`            | Readonly array of rows; keep reference stable when unchanged  |
| `columns`         | Typed column definitions with unique IDs                      |
| `getRowId`        | Stable, unique string ID for each row                         |
| `getRowLabel`     | Accessible selection label; defaults to the ID                |
| `caption`         | Table name for assistive technology                           |
| `initialPageSize` | Initial rows per page; defaults to 10                         |
| `selection`       | Optional `{ ids, onChange }` controlled selection             |
| `toolbar`         | Optional React content beside search, for application filters |
| `emptyMessage`    | Custom empty-results text                                     |

A column requires `id`, `header`, and a primitive-valued `value(row)` accessor. Optional `render(row)` controls display without changing sorting/search values. Use `sortable: false`, `searchable: false`, `hideable: false`, `align`, or a custom `compare(a,b)` to customize behavior. Supply at least one column.

Sorting cycles ascending → descending → original order. Numeric values sort numerically, text uses a natural English collator, and nullish values remain last. Filtering and sorting do not mutate input data. Search considers all searchable columns, including hidden ones. Search, sort, and page-size changes reset to page one; external data changes clamp the current page to available results.

Selection is controlled by the consumer and uses row IDs. The header checkbox affects only the current page. Selection survives pagination and filtering; consumers must remove stale IDs when deleting records from their source dataset. Column visibility is internal state, and at least one column remains visible. Hiding the active sort column clears sorting.

## Keyboard and accessibility

Native HTML table, caption, column headers, and `aria-sort` are used. Tab moves between controls; Enter/Space activates sort buttons and checkboxes. The scrollable table region can receive keyboard focus. The select-page checkbox exposes its mixed state through the native indeterminate property. This is a table, not a spreadsheet grid: arrow-key cell navigation and cell editing are intentionally outside this version's scope. Automated tests do not replace screen-reader testing.

## Packaging and scope

ES modules and TypeScript declarations are emitted to `dist`. React is a peer dependency and is not bundled. Styles are namespaced under `.tc`; override `--tc-accent` and `--tc-border` to adjust the theme.

All rows are searched and sorted in memory. Only the current page is rendered. No virtualization, server pagination, resizing, grouping, or asynchronous data fetching is built in. Use for modest client-side datasets; benchmark your actual data before larger deployments. This is an original learning project, not a replacement claim for established table libraries.
