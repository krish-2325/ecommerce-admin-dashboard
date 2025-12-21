"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

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
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [loading, setLoading] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setErrors({});
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

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
      setErrors(data.errors || {});
      return;
    }

    router.push("/products");
    router.refresh();
  }

  return (
    <div className="max-w-md p-4">
      <h1 className="text-2xl font-bold mb-4">Edit Product</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="name" value={form.name} onChange={handleChange} className="border p-2 w-full" />
        <input name="price" type="number" value={form.price} onChange={handleChange} className="border p-2 w-full" />
        <input name="stock" type="number" value={form.stock} onChange={handleChange} className="border p-2 w-full" />
        <input name="category" value={form.category} onChange={handleChange} className="border p-2 w-full" />

        <img src={product.image} className="w-20 h-20 object-cover rounded" />

        <input type="file" onChange={(e) => setImage(e.target.files?.[0] || null)} />

        <button
          disabled={loading}
          className="bg-green-600 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          {loading ? "Updating..." : "Update Product"}
        </button>
      </form>
    </div>
  );
}
