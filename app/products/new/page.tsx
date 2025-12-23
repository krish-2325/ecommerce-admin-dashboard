"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function NewProductPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    price: "",
    stock: "",
    category: "",
  });

  const [step, setStep] = useState<1 | 2>(1);
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  /* ---------------- IMAGE PREVIEW (SAFE CLEANUP) ---------------- */
  useEffect(() => {
    if (!image) {
      setPreview(null);
      return;
    }
    const url = URL.createObjectURL(image);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [image]);

  /* ---------------- STEP HANDLERS ---------------- */
  function nextStep() {
    const newErrors: Record<string, string[]> = {};

    if (!form.name) newErrors.name = ["Name is required"];
    if (!form.category) newErrors.category = ["Category is required"];

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setStep(2);
  }

  function prevStep() {
    setStep(1);
  }

  /* ---------------- INPUT CHANGE ---------------- */
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;

    setErrors((prev) => {
      const copy = { ...prev };
      delete copy[name];
      return copy;
    });

    setForm({ ...form, [name]: value });
  }

  /* ---------------- SUBMIT ---------------- */
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

    const res = await fetch("/api/products", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      if (data.errors) setErrors(data.errors);
      else alert("Failed to add product");
      return;
    }

    router.push("/products");
    router.refresh();
  }

  /* ---------------- UI ---------------- */
  return (
    <div className="bg-gray-100 min-h-screen p-6 flex justify-center">
      <div className="w-full max-w-xl">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Add New Product</h1>
          <p className="text-sm text-gray-500">
            Create a product in two simple steps
          </p>
        </div>

        {/* Card */}
        <div className="relative bg-white rounded-lg shadow p-6">
          {loading && (
            <div className="absolute inset-0 bg-white/70 flex items-center justify-center rounded-lg z-10">
              <p className="text-sm text-gray-600">Saving product…</p>
            </div>
          )}

          <Link
            href="/products"
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            ← Back to Products
          </Link>

          {/* Step Indicator */}
          <div className="flex items-center gap-3 mt-4 mb-6">
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                step === 1
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              Step 1: Basic Info
            </span>
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                step === 2
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              Step 2: Pricing & Image
            </span>
          </div>

          {/* Form */}
          <form
            onSubmit={step === 2 ? handleSubmit : (e) => e.preventDefault()}
            onKeyDown={(e) => {
              if (e.key === "Enter" && step === 1) e.preventDefault();
            }}
            className={`space-y-4 ${
              loading ? "opacity-60 pointer-events-none" : ""
            }`}
          >
            {/* STEP 1 */}
            {step === 1 && (
              <>
                <div>
                  <label className="block text-sm font-medium">Name</label>
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    className="mt-1 w-full rounded-md border p-2 focus:ring-2 focus:ring-blue-500"
                  />
                  {errors.name && (
                    <p className="text-red-500 text-sm">{errors.name[0]}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium">Category</label>
                  <input
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    className="mt-1 w-full rounded-md border p-2 focus:ring-2 focus:ring-blue-500"
                  />
                  {errors.category && (
                    <p className="text-red-500 text-sm">
                      {errors.category[0]}
                    </p>
                  )}
                </div>

                <button
                  type="button"
                  onClick={nextStep}
                  disabled={!form.name || !form.category}
                  className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
                >
                  Next →
                </button>
              </>
            )}

            {/* STEP 2 */}
            {step === 2 && (
              <>
                <div>
                  <label className="block text-sm font-medium">Price</label>
                  <input
                    type="number"
                    name="price"
                    value={form.price}
                    onChange={handleChange}
                    className="mt-1 w-full rounded-md border p-2 focus:ring-2 focus:ring-blue-500"
                  />
                  {errors.price && (
                    <p className="text-red-500 text-sm">{errors.price[0]}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium">Stock</label>
                  <input
                    type="number"
                    name="stock"
                    value={form.stock}
                    onChange={handleChange}
                    className="mt-1 w-full rounded-md border p-2 focus:ring-2 focus:ring-blue-500"
                  />
                  {errors.stock && (
                    <p className="text-red-500 text-sm">{errors.stock[0]}</p>
                  )}
                </div>

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
                    JPG / PNG • Max 5MB
                  </p>

                  {preview && (
                    <img
                      src={preview}
                      alt="Preview"
                      className="mt-3 h-24 rounded border object-cover"
                    />
                  )}

                  {errors.image && (
                    <p className="text-red-500 text-sm">{errors.image[0]}</p>
                  )}
                </div>

                <div className="flex justify-between">
                  <button
                    type="button"
                    onClick={prevStep}
                    className="bg-gray-300 px-4 py-2 rounded"
                  >
                    ← Back
                  </button>

                  <button
                    type="submit"
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                  >
                    {loading ? "Adding…" : "Add Product"}
                  </button>
                </div>
              </>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
