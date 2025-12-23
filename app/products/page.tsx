import ProductTable from "@/components/producttable";
import Product from "@/models/product";
import { connectDB } from "@/lib/db";
import Link from "next/link";
import ProductCharts from "@/components/ProductCharts";
export const dynamic = "force-dynamic";
import StatsCards from "@/components/StatsCards";
export default async function ProductsPage() {
  await connectDB();
  const productsFromDB = await Product.find().lean<{ 
  _id: any;
  name: string;
  price: number;
  stock: number;
  category: string;
  image: string;
}[]>();
  const products = productsFromDB.map((p) => ({
    _id: p._id.toString(),
    name: p.name,
    price: p.price,
    stock: p.stock,
    category: p.category,
    image: p.image,
  }));
  const totalStock = products.reduce((sum, p) => sum + p.stock, 0);
  const avgPrice =
    products.length > 0
      ? products.reduce((sum, p) => sum + p.price, 0) / products.length
      : 0;
  return (
    <div className="bg-gray-100 min-h-screen p-6">
      <div className="flex items-center justify-between mb-8">
    <div>
      <h1 className="text-3xl font-bold">Products Dashboard</h1>
      <p className="text-gray-500 mt-1">
        Manage products, pricing, stock and categories
      </p>
    </div>

    <Link
      href="/products/new"
      className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg shadow"
    >
      + Add Product
    </Link>
    </div>
    <StatsCards
      totalProducts={products.length}
      totalStock={totalStock}
      avgPrice={avgPrice}
    />
      <div className="mb-10">
        <h2 className="text-xl font-semibold mb-4">Analytics</h2>
        <ProductCharts products={products} />
      </div>
      <div>
        <h2 className="text-xl font-semibold mb-4">Product List</h2>
        <ProductTable products={products} />
      </div>
    </div>
  );
}
  