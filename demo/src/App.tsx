import { useState } from "react";
import { InventoryTable } from "./components/InventoryTable";
import { AddProductDialog } from "./components/AddProductDialog";
import { initialProducts, usd, exportCsv } from "./data/products";
export default function App() {
  const [products, setProducts] = useState(initialProducts);
  const [selected, setSelected] = useState<string[]>([]);
  const [category, setCategory] = useState("");
  const [view, setView] = useState("all");
  const [notice, setNotice] = useState("");
  const low = products.filter(
    (p) => p.stock > 0 && p.stock <= p.reorder,
  ).length;
  const out = products.filter((p) => p.stock === 0).length;
  const filtered =
    view === "low"
      ? products.filter((p) => p.stock > 0 && p.stock <= p.reorder)
      : view === "out"
        ? products.filter((p) => p.stock === 0)
        : products;
  function download() {
    const rows = products.filter((p) => selected.includes(p.id));
    const url = URL.createObjectURL(
      new Blob([exportCsv(rows)], { type: "text/csv;charset=utf-8" }),
    );
    const a = document.createElement("a");
    a.href = url;
    a.download = "tablecraft-selected-products.csv";
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    setNotice(`Exported ${rows.length} selected products.`);
  }
  function restock() {
    setProducts(
      products.map((p) =>
        selected.includes(p.id) ? { ...p, stock: p.stock + 10 } : p,
      ),
    );
    setNotice(
      `Added 10 units to each of ${selected.length} selected products.`,
    );
    setSelected([]);
  }
  return (
    <div className="app">
      <a className="skip" href="#main">
        Skip to inventory
      </a>
      <aside>
        <a className="brand" href="#main">
          <span>▦</span>tablecraft<span className="brand-dot">.</span>
        </a>
        <div className="workspace-switch">
          <span className="workspace-icon">S</span>
          <div>
            Studio supply<small>Demo workspace</small>
          </div>
          <span>⌄</span>
        </div>
        <p className="nav-label">WORKSPACE</p>
        <a className="nav-link active" href="#main">
          ▦ <span>Inventory</span>
          <b>{products.length}</b>
        </a>
        <a className="nav-link" href="#stock-overview">
          ◴ <span>Stock overview</span>
        </a>
        <a className="nav-link" href="#package">
          ⌘ <span>About the package</span>
        </a>
        <div className="sidebar-note">
          <span>BUILT TO BE REUSED</span>
          <p>
            One table.
            <br />
            Your next great interface.
          </p>
          <small>React + TypeScript</small>
        </div>
        <div className="profile">
          <span>NB</span>
          <div>
            Nishant Bage<small>Personal workspace</small>
          </div>
        </div>
      </aside>
      <div className="content">
        <header>
          <span>
            Workspace <b>/</b> <strong>Inventory</strong>
          </span>
          <div>
            <span className="local-pill">● Local demo</span>
            <span className="avatar">NB</span>
          </div>
        </header>
        <main id="main">
          <div className="title-row">
            <div>
              <span className="eyebrow">A LITTLE ORDER GOES A LONG WAY</span>
              <h1>Inventory</h1>
              <p>
                A clear view of your products, stock, and what needs attention.
              </p>
            </div>
            <AddProductDialog
              skus={products.map((p) => p.sku)}
              onAdd={(p) => {
                setProducts([...products, p]);
                setNotice(`${p.name} added to this session.`);
              }}
            />
          </div>
          <div className="sample-note">
            <span>✦</span> Illustrative catalog · Changes last for this session.
            Reloading resets the demo.
          </div>
          <section
            id="stock-overview"
            className="metrics"
            aria-label="Stock overview"
          >
            <article>
              <span>
                Total products <b>▦</b>
              </span>
              <strong>{products.length}</strong>
              <small>Across 3 categories</small>
            </article>
            <article>
              <span>
                Inventory value <b>◇</b>
              </span>
              <strong>
                {usd(products.reduce((sum, p) => sum + p.stock * p.price, 0))}
              </strong>
              <small>At current unit prices · USD</small>
            </article>
            <article>
              <span>
                Low stock <b className="amber">◷</b>
              </span>
              <strong>{low.toString().padStart(2, "0")}</strong>
              <small>At or below reorder threshold</small>
            </article>
            <article>
              <span>
                Out of stock <b className="rose">⊘</b>
              </span>
              <strong>{out.toString().padStart(2, "0")}</strong>
              <small>Ready for replenishment</small>
            </article>
          </section>
          <section className="inventory-panel">
            <div className="panel-heading">
              <div>
                <h2>
                  Product catalog <span>{products.length}</span>
                </h2>
                <p>Keep the details in sight. Keep the work moving.</p>
              </div>
              <div className="bulk-actions">
                <button disabled={!selected.length} onClick={restock}>
                  ＋ Restock selected
                </button>
                <button disabled={!selected.length} onClick={download}>
                  Export selected ↓
                </button>
              </div>
            </div>
            <div className="tabs" aria-label="Stock filters">
              {[
                ["all", "All products", products.length],
                ["low", "Low stock", low],
                ["out", "Out of stock", out],
              ].map(([value, label, count]) => (
                <button
                  key={value}
                  aria-pressed={view === value}
                  className={view === value ? "selected" : ""}
                  onClick={() => setView(String(value))}
                >
                  {label} <span>{count}</span>
                </button>
              ))}
            </div>
            {notice && (
              <div className="notice" role="status">
                {notice}
                <button
                  onClick={() => setNotice("")}
                  aria-label="Dismiss notification"
                >
                  ×
                </button>
              </div>
            )}
            <InventoryTable
              products={filtered}
              category={category}
              onCategory={setCategory}
              selected={selected}
              onSelect={setSelected}
            />
          </section>
          <section id="package" className="package-note">
            <span className="package-icon">⌘</span>
            <div>
              <strong>A working demo. A reusable foundation.</strong>
              <p>
                This inventory view is powered by the local Tablecraft package:
                typed columns, sorting, search, pagination, selection, and
                visibility.
              </p>
            </div>
            <span className="version">v0.1.0 · Unpublished</span>
          </section>
          <footer>
            Crafted with care. Built with React.
            <span>Tablecraft · Inventory example</span>
          </footer>
        </main>
      </div>
    </div>
  );
}
