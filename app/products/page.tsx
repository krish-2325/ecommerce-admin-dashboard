import ProductTable from "@/components/producttable";
import { Product } from "@/models/product";
import { connectDB } from "@/lib/db";
import Link from "next/link";
export default async function ProductsPage() {
  await connectDB();
  const products = await Product.find().lean();
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Products</h1>
      <p className="mb-2 text-gray-600">
        Total Products: {products.length}
      </p>
      <Link
        href="/products/new"
        className="inline-block mb-4 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
      >
        + Add Product
      </Link>
      <ProductTable products={products} />
    </div>
  );
}
  