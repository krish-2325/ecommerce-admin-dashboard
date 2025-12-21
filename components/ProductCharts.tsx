"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

type Product = {
  category: string;
  price: number;
  stock: number;
};

const COLORS = ["#2563eb", "#16a34a", "#f97316", "#dc2626"];

export default function ProductCharts({ products }: { products: Product[] }) {
  const stockData = Object.values(
    products.reduce((acc: any, p) => {
      acc[p.category] = acc[p.category] || {
        category: p.category,
        stock: 0,
      };
      acc[p.category].stock += p.stock;
      return acc;
    }, {})
  );
  const priceData = products.map((p) => ({
    name: p.category,
    value: p.price,
  }));

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      {/* Stock Bar Chart */}
      <div className="bg-white p-4 rounded shadow">
        <h2 className="font-semibold mb-4">Stock per Category</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={stockData}>
            <XAxis dataKey="category" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="stock" fill="#2563eb" />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="bg-white p-4 rounded shadow">
        <h2 className="font-semibold mb-4">Price Distribution</h2>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={priceData}
              dataKey="value"
              nameKey="name"
              outerRadius={100}
              label
            >
              {priceData.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
