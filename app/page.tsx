import StatsCards from "@/components/StatsCards";
import ProductCharts from "@/components/ProductCharts";
import Product from "@/models/product";
import { connectDB } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  await connectDB();

  const rawProducts = await Product.find().lean<{
    price: number;
    stock: number;
    category: string;
  }[]>();

  const products = rawProducts.map((p) => ({
    category: p.category,
    price: Number(p.price),
    stock: Number(p.stock),
  }));

  const totalProducts = products.length;
  const totalStock = products.reduce((sum, p) => sum + p.stock, 0);
  const avgPrice =
    totalProducts > 0
      ? products.reduce((sum, p) => sum + p.price, 0) / totalProducts
      : 0;

  return (
    <div className="space-y-8">
      {/* PAGE HEADER */}
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-gray-600 mt-1">
          Overview of your store performance
        </p>
      </div>

      {/* STATS */}
      <StatsCards
        totalProducts={totalProducts}
        totalStock={totalStock}
        avgPrice={avgPrice}
      />

      {/* CHARTS */}
      <ProductCharts products={products} />

      {/* QUICK ACTIONS */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-3">
          Quick Actions
        </h2>

        <div className="flex flex-wrap gap-3">
          <a
            href="/products"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm"
          >
            Manage Products
          </a>

          <a
            href="/products/new"
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded text-sm"
          >
            Add New Product
          </a>
        </div>
      </div>
    </div>
  );
}
