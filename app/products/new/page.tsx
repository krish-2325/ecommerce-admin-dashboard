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
const [step, setStep] = useState<1 | 2>(1);
const [errors, setErrors] = useState<Record<string, string[]>>({});
const [loading, setLoading] = useState(false);
const [image,setImage]=useState<File | null>(null);
function nextStep() {
  const newErrors: Record<string, string[]> = {};

  if (!form.name) {
    newErrors.name = ["Name is required"];
  }
  if (!form.category) {
    newErrors.category = ["Category is required"];
  }

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
function handleChange(e:React.ChangeEvent<HTMLInputElement>)
{
    const { name, value } = e.target;

  setErrors((prev) => {
    const copy = { ...prev };
    delete copy[name];
    return copy;
  });

  setform({ ...form, [name]: value });
}
async function handleSubmit(e: React.FormEvent) {
  e.preventDefault();
  setErrors({});
  setLoading(true);

  const formData = new FormData();
  formData.append("name", form.name);
  formData.append("price", form.price);
  formData.append("stock", form.stock);
  formData.append("category", form.category);

  if (image) {
  formData.append("image", image);
  }

  const res = await fetch("/api/products", {
  method: "POST",
  body: formData,
  });

  const data = await res.json();
  setLoading(false);

  if (!res.ok) {
    if (data.errors) {
      setErrors(data.errors);
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
        <form onSubmit={step === 2 ? handleSubmit : (e) => e.preventDefault()} className="space-y-4">
          {step===1&&(
            <> 
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
            <button
                type="button"
                onClick={nextStep}
                className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
                disabled={!form.name || !form.category}
            >
                Next →
            </button>
        </>
          )}
          {step===2&&(
            <>
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
            <input type="file" accept="image/*" onChange={(e)=>setImage(e.target.files?.[0]||null)} className="mt-1 block w-full"/>
            {errors.image && (
            <p className="text-red-500 text-sm mt-1">
                {errors.image[0]}
            </p>
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
            <button type="submit" disabled={loading} className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded disabled:opacity-50">
                {loading ? "Adding..." : "Add Product"}
            </button>
            </div>
            </>
          )}
        </form>
    </div>
);
}