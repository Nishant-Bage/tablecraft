# Tablecraft

A reusable React + TypeScript table package with an inventory dashboard demonstrating it. Local-only and unpublished.

## Run

Requires Node.js 22.17 or newer (developed with Node 24).

```sh
npm ci
npm run build:package
npm run dev
```

The first build creates the workspace package's exported files. After changing package source, rebuild it; Vite reloads changes to the demo automatically.

```sh
npm test
npm run build
npm pack --workspace @nishant-bage/tablecraft --dry-run
```

`build` emits the package with declarations to `packages/react/dist` and the static demo to `demo-dist`. Nothing is uploaded by these commands. `npm pack --workspace @nishant-bage/tablecraft` creates a local tarball for testing in another React project; it does not publish to npm.

## Demo behavior

The inventory demo uses an illustrative 18-product catalog. It supports stock/category filters, typed table search and sorting, pagination, page and row selection, column visibility, adding a product, bulk restocking (+10 units per selected product), and selected-row CSV export. Selected IDs persist across pages and filters, and the selection banner explicitly explains this scope.

The catalog is in memory and resets on reload. Sample prices are fictional USD amounts. No inventory backend, supplier integration, live prices, authentication, or database is implied. Inventory value means stock quantity multiplied by current sample unit price, not sales or profit.

CSV export quotes fields and prefixes formula-like text so spreadsheet software does not treat that text as a formula.

## Structure

| Location                                   | Responsibility                                      |
| ------------------------------------------ | --------------------------------------------------- |
| `packages/react/src/DataTable.tsx`         | Reusable table interface and state                  |
| `packages/react/src/model.ts`              | Pure sorting, search, pagination, selection helpers |
| `packages/react/src/types.ts`              | Public generic TypeScript API                       |
| `packages/react/src/styles.css`            | Namespaced package styles                           |
| `demo/src/components/InventoryTable.tsx`   | Product columns and category filter                 |
| `demo/src/components/AddProductDialog.tsx` | Native dialog with validated form                   |
| `demo/src/App.tsx`                         | Demo workspace, stock filters, bulk actions         |
| `demo/src/data/products.ts`                | Explicit sample data and CSV export                 |

See [the package README](packages/react/README.md) for usage and API details.

## Verification

Tests cover numeric/natural sorting, missing values, page clamping, mixed checkbox state, selection across pages, keyboard sorting, search empty states, column visibility, stock thresholds, and CSV escaping. The demo uses the built package through a workspace dependency rather than importing its source. Tests are not an accessibility certification or a performance benchmark.

Browser checks also covered adding a product, searching for it, bulk restocking, updated summary totals, and resetting the sample catalog on reload. The package contents were inspected with `npm pack --dry-run`. At creation, the dependency audit reported no known vulnerabilities.

## Design reference

The table uses semantic HTML and sortable header buttons following the [W3C sortable table guidance](https://www.w3.org/WAI/ARIA/apg/patterns/table/examples/sortable-table/). No grid keyboard model is claimed.

## Before publishing

Choose a license and confirm package-name availability, then test the packed tarball in your intended consumer applications. This project has not been published or deployed.
