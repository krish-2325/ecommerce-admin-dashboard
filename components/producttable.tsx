"use client";
import { useRouter } from "next/navigation";  
type Product = {
  _id: string;
  name: string;
  price: number;
  stock: number;
  category: string;
  image: string;
};

export default function ProductTable({ products }: { products: Product[] }) {
   const router = useRouter();
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) {
      return;
    }

    try {
      const res = await fetch(`/api/products/${id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Failed to delete product");
        return;
      }

      // Simple refresh (safe for now)
      router.refresh();
    } catch (error) {
      alert("Network error. Please try again.");
      console.error(error);
    }
  };

  return (
    <div className="overflow-x-auto bg-white rounded shadow">
      <table className="min-w-full border">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-3 border">Name</th>
            <th className="p-3 border">Price</th>
            <th className="p-3 border">Stock</th>
            <th className="p-3 border">Category</th>
            <th className="p-3 border">Image</th>
            <th className="p-3 border">Actions</th>
          </tr>
        </thead>

        <tbody>
          {products.map((p) => (
            <tr
              key={p._id}
              className="text-center hover:bg-gray-50 transition"
            >
              <td className="p-3 border">{p.name}</td>
              <td className="p-3 border">₹{p.price}</td>
              <td className="p-3 border">{p.stock}</td>
              <td className="p-3 border">{p.category}</td>
              <td className="p-3 border">
                <img
                  src={p.image || "/placeholder.png"}
                  alt={p.name}
                  className="w-12 h-12 object-cover rounded"
                />
              </td>
              <td className="p-3 border">
                <button
                  onClick={() => handleDelete(p._id)}
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Delete
                </button>
                <button
                onClick={()=> router.push(`/products/${p._id}/edit`)}
                className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 mr-2"
                >
                  Edit
                </button>
              </td>
            </tr>
          ))}

          {products.length === 0 && (
            <tr>
              <td colSpan={6} className="p-4 text-gray-500 text-center">
                No products found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
