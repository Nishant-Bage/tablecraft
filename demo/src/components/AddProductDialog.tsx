import { useRef, useState, type FormEvent } from "react";
import type { Product } from "../data/products";
export function AddProductDialog({
  onAdd,
  skus,
}: {
  onAdd: (product: Product) => void;
  skus: string[];
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [error, setError] = useState("");
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const values = new FormData(form);
    const name = String(values.get("name")).trim();
    const sku = String(values.get("sku")).trim().toUpperCase();
    const price = Number(values.get("price"));
    const stock = Number(values.get("stock"));
    if (
      !name ||
      !sku ||
      skus.includes(sku) ||
      !Number.isFinite(price) ||
      price <= 0 ||
      !Number.isInteger(stock) ||
      stock < 0
    ) {
      setError(
        "Enter a name, unique SKU, positive price, and non-negative whole-number stock.",
      );
      return;
    }
    onAdd({
      id: crypto.randomUUID(),
      name,
      sku,
      category: String(values.get("category")),
      price: Math.round(price * 100) / 100,
      stock,
      reorder: 10,
      supplier: String(values.get("supplier")).trim() || "Unassigned",
      updated: new Date().toISOString().slice(0, 10),
    });
    dialog.current?.close();
    form.reset();
  }
  return (
    <>
      <button
        className="primary"
        onClick={() => {
          setError("");
          dialog.current?.showModal();
        }}
      >
        ＋ Add product
      </button>
      <dialog ref={dialog} aria-labelledby="add-title">
        <form onSubmit={submit}>
          <div className="dialog-heading">
            <div>
              <span className="eyebrow">GROW YOUR CATALOG</span>
              <h2 id="add-title">Add a product</h2>
            </div>
            <button
              type="button"
              className="quiet"
              onClick={() => dialog.current?.close()}
            >
              Close ✕
            </button>
          </div>
          <label>
            Product name
            <input name="name" required maxLength={80} />
          </label>
          <div className="form-grid">
            <label>
              SKU
              <input name="sku" required maxLength={30} />
            </label>
            <label>
              Category
              <select name="category">
                <option>Accessories</option>
                <option>Audio</option>
                <option>Office</option>
              </select>
            </label>
            <label>
              Unit price (USD)
              <input
                name="price"
                type="number"
                min="0.01"
                step="0.01"
                max="1000000"
                required
              />
            </label>
            <label>
              Stock
              <input
                name="stock"
                type="number"
                min="0"
                max="1000000"
                step="1"
                required
              />
            </label>
          </div>
          <label>
            Supplier
            <input name="supplier" maxLength={80} />
          </label>
          <p className="muted">
            New products use a low-stock threshold of 10 units.
          </p>
          {error && (
            <p role="alert" className="error">
              {error}
            </p>
          )}
          <button className="primary" type="submit">
            Save product
          </button>
        </form>
      </dialog>
    </>
  );
}
