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
  CartesianGrid,
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
  const priceData = Object.values(
    products.reduce((acc: Record<string, { name: string; value: number }>, p) => {
        acc[p.category] = acc[p.category] || {
        name: p.category,
        value: 0,
        };
        acc[p.category].value += p.price;
        return acc;
    }, {})
    );

    if (products.length === 0) {
    return (
        <div className="bg-white p-4 rounded shadow mb-6">
        <p className="text-gray-500">No data available for charts</p>
        </div>
    );
    }

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
            <CartesianGrid strokeDasharray="3 3" />
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
