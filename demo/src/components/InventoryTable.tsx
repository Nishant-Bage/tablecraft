import { useMemo } from "react";
import { DataTable, type Column } from "@nishant-bage/tablecraft";
import { stockStatus, usd, type Product } from "../data/products";
const columns: Column<Product>[] = [
  {
    id: "name",
    header: "Product",
    value: (p) => p.name,
    hideable: false,
    render: (p) => (
      <div className="product">
        <span className={`product-icon ${p.category.toLowerCase()}`}>
          {p.category === "Audio" ? "◉" : p.category === "Office" ? "▱" : "⌘"}
        </span>
        <div>
          <strong>{p.name}</strong>
          <small>{p.sku}</small>
        </div>
      </div>
    ),
  },
  { id: "sku", header: "SKU", value: (p) => p.sku },
  {
    id: "category",
    header: "Category",
    value: (p) => p.category,
    render: (p) => <span className="category-tag">{p.category}</span>,
  },
  {
    id: "price",
    header: "Unit price",
    value: (p) => p.price,
    align: "right",
    render: (p) => <strong>{usd(p.price)}</strong>,
  },
  {
    id: "stock",
    header: "Stock",
    value: (p) => p.stock,
    align: "right",
    render: (p) => (
      <span className={p.stock <= p.reorder ? "stock-low" : ""}>
        {p.stock} <small>units</small>
      </span>
    ),
  },
  {
    id: "status",
    header: "Status",
    value: stockStatus,
    render: (p) => (
      <span
        className={`badge ${p.stock === 0 ? "out" : p.stock <= p.reorder ? "low" : "available"}`}
      >
        {stockStatus(p)}
      </span>
    ),
  },
  { id: "supplier", header: "Supplier", value: (p) => p.supplier },
];
export function InventoryTable({
  products,
  category,
  onCategory,
  selected,
  onSelect,
}: {
  products: Product[];
  category: string;
  onCategory: (value: string) => void;
  selected: string[];
  onSelect: (ids: string[]) => void;
}) {
  const rows = useMemo(
    () => products.filter((p) => !category || p.category === category),
    [products, category],
  );
  return (
    <DataTable
      data={rows}
      columns={columns}
      getRowId={(p) => p.id}
      getRowLabel={(p) => p.name}
      caption="Inventory"
      initialPageSize={5}
      selection={{ ids: selected, onChange: onSelect }}
      toolbar={
        <label>
          <span className="sr-only">Filter category</span>
          <select
            value={category}
            onChange={(event) => onCategory(event.target.value)}
          >
            <option value="">All categories</option>
            <option>Accessories</option>
            <option>Audio</option>
            <option>Office</option>
          </select>
        </label>
      }
    />
  );
}
