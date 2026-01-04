"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

/* ================= TYPES ================= */
type Product = {
  _id: string;
  name: string;
  price: number;
  stock: number;
  category: string;
  image?: string;
};

type SortKey = "name" | "price" | "stock" | "category";
type SortOrder = "asc" | "desc";

type ColumnKey =
  | "product"
  | "category"
  | "price"
  | "stock"
  | "actions";

/* ================= COMPONENT ================= */
export default function ProductTable({
  products,
  loading = false,
}: {
  products: Product[];
  loading?: boolean;
}) {
  const router = useRouter();

  /* ---------- STATE ---------- */
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [sortKey, setSortKey] = useState<SortKey>("name");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [toast, setToast] = useState<string | null>(null);
  const [dark, setDark] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [visibleCols, setVisibleCols] = useState<Record<ColumnKey, boolean>>({
    product: true,
    category: true,
    price: true,
    stock: true,
    actions: true,
  });

  /* ---------- DARK MODE ---------- */
  useEffect(() => {
    setDark(localStorage.getItem("admin-dark") === "true");
  }, []);

  useEffect(() => {
    localStorage.setItem("admin-dark", String(dark));
  }, [dark]);

  /* ---------- TOAST ---------- */
  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  }

  /* ---------- DELETE ---------- */
  async function handleDelete(id: string) {
    if (!confirm("Delete this product permanently?")) return;

    setDeletingId(id);

    try {
      const res = await fetch(`/api/products/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        showToast("❌ Failed to delete product");
        return;
      }

      showToast("✅ Product deleted");
      router.refresh();
    } finally {
      setDeletingId(null);
    }
  }

  /* ---------- FILTER OPTIONS ---------- */
  const categories = useMemo(
    () => ["all", ...new Set(products.map((p) => p.category))],
    [products]
  );

  /* ---------- FILTER + SORT ---------- */
  const filtered = useMemo(() => {
    return [...products]
      .filter((p) =>
        `${p.name} ${p.category}`
          .toLowerCase()
          .includes(search.toLowerCase())
      )
      .filter((p) => category === "all" || p.category === category)
      .sort((a, b) => {
        const aVal = a[sortKey];
        const bVal = b[sortKey];
        if (aVal < bVal) return sortOrder === "asc" ? -1 : 1;
        if (aVal > bVal) return sortOrder === "asc" ? 1 : -1;
        return 0;
      });
  }, [products, search, category, sortKey, sortOrder]);

  /* ---------- PAGINATION ---------- */
  const totalPages = Math.max(1, Math.ceil(filtered.length / rowsPerPage));
  const paginated = filtered.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  function toggleSort(key: SortKey) {
    if (sortKey === key) {
      setSortOrder((o) => (o === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortOrder("asc");
    }
  }

  /* ---------- LOADING ---------- */
  if (loading) {
    return (
      <div className="space-y-2">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="h-12 rounded bg-gray-200 animate-pulse"
          />
        ))}
      </div>
    );
  }

  /* ---------- EMPTY ---------- */
  if (filtered.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-8 text-center">
        <p className="text-gray-500 text-sm mb-3">
          No products found.
        </p>
        <button
          onClick={() => router.push("/products/new")}
          className="text-sm text-blue-600 hover:underline"
        >
          + Add your first product
        </button>
      </div>
    );
  }

  /* ================= UI ================= */
  return (
    <div className={dark ? "dark" : ""}>
      <div className="bg-white rounded-lg shadow overflow-hidden relative">
        {/* TOAST */}
        {toast && (
          <div className="absolute top-4 right-4 bg-black text-white px-4 py-2 rounded text-sm z-50">
            {toast}
          </div>
        )}

        {/* HEADER */}
        <div className="p-4 border-b flex flex-wrap gap-4 justify-between">
          <input
            placeholder="Search products…"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="border rounded px-3 py-2 text-sm w-full md:w-64"
          />

          <div className="flex gap-2 flex-wrap">
            <select
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
                setPage(1);
              }}
              className="border rounded px-2 py-2 text-sm"
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c === "all" ? "All Categories" : c}
                </option>
              ))}
            </select>

            <select
              value={rowsPerPage}
              onChange={(e) => {
                setRowsPerPage(Number(e.target.value));
                setPage(1);
              }}
              className="border rounded px-2 py-2 text-sm"
            >
              {[10, 25, 50].map((n) => (
                <option key={n} value={n}>
                  {n} / page
                </option>
              ))}
            </select>

            <button
              onClick={() => setDark((d) => !d)}
              className="border rounded px-3 py-2 text-sm"
            >
              {dark ? "☀ Light" : "🌙 Dark"}
            </button>
          </div>
        </div>
        {/* COLUMN TOGGLE */}
        <div className="px-4 py-3 border-b bg-gray-50 flex flex-wrap gap-4 text-xs">
          <span className="font-semibold text-gray-600 mr-2">
            Toggle Columns:
          </span>

          {(Object.keys(visibleCols) as ColumnKey[]).map((key) => (
            <label
              key={key}
              className="flex items-center gap-1 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={visibleCols[key]}
                onChange={() =>
                  setVisibleCols((prev) => ({
                    ...prev,
                    [key]: !prev[key],
                  }))
                }
                className="accent-blue-600"
              />
              <span className="capitalize">
                    {key === "product" ? "Product Info" : key}
              </span>
            </label>
          ))}
        </div>

        {/* TABLE */}
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              {visibleCols.product && (
                <Th label="Product" onClick={() => toggleSort("name")} />
              )}
              {visibleCols.category && (
                <Th label="Category" onClick={() => toggleSort("category")} />
              )}
              {visibleCols.price && (
                <Th label="Price" onClick={() => toggleSort("price")} />
              )}
              {visibleCols.stock && (
                <Th label="Stock" onClick={() => toggleSort("stock")} />
              )}
              {visibleCols.actions && (
                <th className="p-4 text-right">Actions</th>
              )}
            </tr>
          </thead>

          <tbody className="divide-y">
            {paginated.map((p) => (
              <tr key={p._id} className="hover:bg-gray-50">
                {visibleCols.product && (
                <td className="p-4 flex items-center gap-3">
                  <div className="h-12 w-12 relative rounded border overflow-hidden">
                    <Image
                      src={p.image && p.image.trim() ? p.image : "/fallback.png"}
                      alt={p.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-medium">{p.name}</p>
                    <p className="text-xs text-gray-500">
                      ID: {p._id.slice(0, 8)}…
                    </p>
                  </div>
                </td>
                )}
                {visibleCols.category && (
                <td className="p-4">
                  <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs">
                    {p.category}
                  </span>
                </td>
                )}
                {visibleCols.price && (
                <td className="p-4 font-medium">
                  ₹{p.price.toLocaleString()}
                </td>
                )}
                {visibleCols.stock && ( 
                <td className="p-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs ${
                      p.stock > 20
                        ? "bg-green-100 text-green-700"
                        : p.stock > 0
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {p.stock > 0 ? `${p.stock} in stock` : "Out of stock"}
                  </span>
                </td>
                )}
                {visibleCols.actions && (
                <td className="p-4 text-right space-x-2">
                  <button
                    onClick={() =>
                      router.push(`/products/${p._id}/edit`)
                    }
                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1.5 rounded text-xs"
                  >
                    Edit
                  </button>
                  <button
                    disabled={deletingId === p._id}
                    onClick={() => handleDelete(p._id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded text-xs disabled:opacity-50"
                  >
                    {deletingId === p._id ? "Deleting…" : "Delete"}
                  </button>
                </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>

        {/* PAGINATION */}
        <div className="p-4 border-t flex justify-between items-center text-sm">
          <span>
            Page {page} of {totalPages}
          </span>
          <div className="space-x-2">
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
              className="px-3 py-1 border rounded disabled:opacity-40"
            >
              Prev
            </button>
            <button
              disabled={page === totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="px-3 py-1 border rounded disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ================= SORTABLE HEADER ================= */
function Th({
  label,
  onClick,
}: {
  label: string;
  onClick?: () => void;
}) {
  return (
    <th
      onClick={onClick}
      className={`p-4 text-left ${
        onClick ? "cursor-pointer hover:text-blue-600" : ""
      }`}
    >
      {label}
    </th>
  );
}
