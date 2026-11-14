export type Product = {
  id: string;
  name: string;
  sku: string;
  category: string;
  price: number;
  stock: number;
  reorder: number;
  supplier: string;
  updated: string;
};
export const initialProducts: Product[] = [
  [
    "1",
    "Studio wireless headphones",
    "AU-001",
    "Audio",
    129,
    42,
    10,
    "Soundworks",
  ],
  ["2", "Mechanical keyboard", "AC-002", "Accessories", 89, 8, 10, "Keyline"],
  ["3", "Desk lamp · Sand", "OF-003", "Office", 49, 32, 8, "Forma"],
  ["4", "Portable speaker", "AU-004", "Audio", 79, 0, 10, "Soundworks"],
  ["5", "USB-C hub · 7 port", "AC-005", "Accessories", 59, 64, 15, "Dockside"],
  ["6", "Monitor stand", "OF-006", "Office", 45, 19, 8, "Forma"],
  ["7", "Webcam · 4K", "AC-007", "Accessories", 119, 6, 10, "Optik"],
  ["8", "Notebook set", "OF-008", "Office", 18, 120, 20, "Paper & Co"],
  ["9", "Wireless mouse", "AC-009", "Accessories", 39, 55, 12, "Keyline"],
  ["10", "Ceramic desk tray", "OF-010", "Office", 24, 27, 8, "Forma"],
  ["11", "Lavalier microphone", "AU-011", "Audio", 65, 11, 5, "Soundworks"],
  ["12", "Laptop sleeve", "AC-012", "Accessories", 29, 0, 10, "Thread"],
  ["13", "Desk mat · Slate", "OF-013", "Office", 32, 46, 10, "Thread"],
  ["14", "Audio interface", "AU-014", "Audio", 179, 5, 6, "Soundworks"],
  ["15", "Cable organizer", "AC-015", "Accessories", 12, 83, 20, "Dockside"],
  ["16", "Ergonomic footrest", "OF-016", "Office", 55, 14, 5, "Forma"],
  ["17", "Charging pad", "AC-017", "Accessories", 35, 31, 10, "Dockside"],
  ["18", "Acoustic panels · Pair", "AU-018", "Audio", 69, 18, 6, "Soundworks"],
].map(([id, name, sku, category, price, stock, reorder, supplier]) => ({
  id: String(id),
  name: String(name),
  sku: String(sku),
  category: String(category),
  price: Number(price),
  stock: Number(stock),
  reorder: Number(reorder),
  supplier: String(supplier),
  updated: "2026-11-14",
}));
export const stockStatus = (p: Product) =>
  p.stock === 0
    ? "Out of stock"
    : p.stock <= p.reorder
      ? "Low stock"
      : "In stock";
export const usd = (amount: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(
    amount,
  );
// Protect spreadsheet consumers from formula interpretation, and quote CSV fields.
export function csvCell(value: string | number) {
  let text = String(value);
  if (/^[\s]*[=+@-]/.test(text)) text = `'${text}`;
  return `"${text.replaceAll('"', '""')}"`;
}
export function exportCsv(products: Product[]) {
  return [
    "Name,SKU,Category,Unit price,Stock,Supplier",
    ...products.map((p) =>
      [p.name, p.sku, p.category, p.price, p.stock, p.supplier]
        .map(csvCell)
        .join(","),
    ),
  ].join("\r\n");
}
