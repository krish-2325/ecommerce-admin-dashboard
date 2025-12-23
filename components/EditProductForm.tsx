"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type Product = {
  _id: string;
  name: string;
  price: number;
  stock: number;
  category: string;
  image: string;
};

export default function EditProductForm({ product }: { product: Product }) {
  const router = useRouter();

  const [form, setForm] = useState({
    name: product.name,
    price: product.price.toString(),
    stock: product.stock.toString(),
    category: product.category,
  });

  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(product.image);
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [loading, setLoading] = useState(false);

  /* ---------------- IMAGE PREVIEW (CLEANUP SAFE) ---------------- */
  useEffect(() => {
    if (!image) return;

    const url = URL.createObjectURL(image);
    setPreview(url);

    return () => URL.revokeObjectURL(url);
  }, [image]);

  /* ---------------- CHANGE HANDLER ---------------- */
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;

    setErrors((prev) => {
      const copy = { ...prev };
      delete copy[name];
      return copy;
    });

    setForm({ ...form, [name]: value });
  }

  /* ---------------- FORM SUBMIT ---------------- */
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("price", form.price);
    formData.append("stock", form.stock);
    formData.append("category", form.category);
    if (image) formData.append("image", image);

    const res = await fetch(`/api/products/${product._id}`, {
      method: "PUT",
      body: formData,
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      if (data.errors) setErrors(data.errors);
      else alert("Failed to update product");
      return;
    }

    alert("Product updated successfully!");
    router.push("/products");
    router.refresh();
  }

  /* ---------------- PREVENT USELESS UPDATE ---------------- */
  const isUnchanged =
    form.name === product.name &&
    form.category === product.category &&
    form.price === product.price.toString() &&
    form.stock === product.stock.toString() &&
    !image;

  /* ---------------- UI ---------------- */
  return (
    <div className="bg-gray-100 min-h-screen p-6 flex justify-center">
      <div className="w-full max-w-xl">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Edit Product</h1>
          <p className="text-sm text-gray-500">
            Update product details and image
          </p>
        </div>

        <div className="relative bg-white rounded-lg shadow p-6">
          {loading && (
            <div className="absolute inset-0 bg-white/70 flex items-center justify-center rounded-lg z-10">
              <p className="text-sm text-gray-600">Updating product…</p>
            </div>
          )}

          <Link
            href="/products"
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            ← Back to Products
          </Link>

          <form
            onSubmit={handleSubmit}
            className={`space-y-4 mt-4 ${
              loading ? "opacity-60 pointer-events-none" : ""
            }`}
          >
            {/* Name */}
            <div>
              <label className="block text-sm font-medium">
                Name <span className="text-red-500">*</span>
              </label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                className="mt-1 w-full rounded-md border p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.name && (
                <p className="text-red-500 text-sm">{errors.name[0]}</p>
              )}
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium">
                Category <span className="text-red-500">*</span>
              </label>
              <input
                name="category"
                value={form.category}
                onChange={handleChange}
                className="mt-1 w-full rounded-md border p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.category && (
                <p className="text-red-500 text-sm">
                  {errors.category[0]}
                </p>
              )}
            </div>

            {/* Price */}
            <div>
              <label className="block text-sm font-medium">
                Price <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="price"
                value={form.price}
                onChange={handleChange}
                className="mt-1 w-full rounded-md border p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.price && (
                <p className="text-red-500 text-sm">{errors.price[0]}</p>
              )}
            </div>

            {/* Stock */}
            <div>
              <label className="block text-sm font-medium">
                Stock <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="stock"
                value={form.stock}
                onChange={handleChange}
                className="mt-1 w-full rounded-md border p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.stock && (
                <p className="text-red-500 text-sm">{errors.stock[0]}</p>
              )}
            </div>

            {/* Image */}
            <div>
              <label className="block text-sm font-medium">
                Product Image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setImage(e.target.files?.[0] || null)
                }
                className="mt-1 block w-full text-sm"
              />
              <p className="text-xs text-gray-500">
                Upload a new image to replace the current one
              </p>

              {preview && (
                <div className="mt-3 inline-block rounded border p-1">
                  <img
                    src={preview}
                    alt="Preview"
                    className="h-24 rounded object-cover"
                  />
                </div>
              )}

              {errors.image && (
                <p className="text-red-500 text-sm">
                  {errors.image[0]}
                </p>
              )}
            </div>

            {/* Actions */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading || isUnchanged}
                className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded disabled:opacity-50"
              >
                {loading ? "Updating…" : "Update Product"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}