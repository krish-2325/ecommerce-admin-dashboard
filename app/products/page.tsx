import ProductTable from "@/components/producttable";
import { Product } from "@/models/product";
import { connectDB } from "@/lib/db";
export default async function ProductsPage() {
  await connectDB();
  const products = await Product.find().lean();
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Products</h1>
      <p className="mb-2 text-gray-600">
        Total Products: {products.length}
      </p>
      <ProductTable products={products} />
    </div>
  );
}
