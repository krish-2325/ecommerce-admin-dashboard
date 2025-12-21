"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
export default function NewProductPage() {
const router=useRouter();
const [form, setform] = useState({
  name: "",
  price: "",
  stock: "",
  category: "",
});
const [errors, setErrors] = useState<Record<string, string[]>>({});
const [loading, setLoading] = useState(false);
function handleChange(e:React.ChangeEvent<HTMLInputElement>)
{
    setErrors({});
    setform({...form,[e.target.name]:e.target.value});
}
async function handleSubmit(e: React.FormEvent) {
  e.preventDefault();
  setErrors({});
  setLoading(true);

  const res = await fetch("/api/products", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: form.name,
      price: Number(form.price),
      stock: Number(form.stock),
      category: form.category,
    }),
  });

  const data = await res.json();
  setLoading(false);

  if (!res.ok) {
    if (data.errors) {
      setErrors(data.errors); // 🔥 Zod errors from backend
    } else {
      alert("Failed to add product");
    }
    return;
  }

  router.push("/products");
  router.refresh();
}
return (
    <div className="max-w-md">
        <h1 className="text-2xl font-bold mb-4">Add Product</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                <input
                    type="text"
                    id="name"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                />
                {errors.name && (
                <p className="text-red-500 text-sm mt-1">
                    {errors.name[0]}
                </p>
                )}
            </div>
            <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-700">Price</label>
                <input
                    type="number"
                    id="price"
                    name="price"
                    value={form.price}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                />
                {errors.price && (
                <p className="text-red-500 text-sm mt-1">
                    {errors.price[0]}
                </p>
                )}
            </div>
            <div>
                <label htmlFor="stock" className="block text-sm font-medium text-gray-700">Stock</label>
                <input
                    type="number"
                    id="stock"
                    name="stock"
                    value={form.stock}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                />
                {errors.stock && (
                <p className="text-red-500 text-sm mt-1">
                    {errors.stock[0]}
                </p>
                )}
            </div>
            <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
                <input
                    type="text"
                    id="category"
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                />
                {errors.category && (
                <p className="text-red-500 text-sm mt-1">
                    {errors.category[0]}
                </p>
                )}
            </div>
            <button type="submit" disabled={loading} className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded disabled:opacity-50">
                {loading ? "Adding..." : "Add Product"}
            </button>
        </form>
    </div>
);
}