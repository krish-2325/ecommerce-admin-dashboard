"use client";

import { useMemo, useRef, useState } from "react";
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
  Legend,
} from "recharts";
import { toPng } from "html-to-image";

/* ================= TYPES ================= */
type Product = {
  category: string;
  price: number;
  stock: number;
  createdAt?: string; // optional (safe if missing)
};

type TimeRange = "all" | "30d";

/* ================= CONSTANTS ================= */
const COLORS = ["#2563eb", "#16a34a", "#f97316", "#dc2626"];

/* ================= COMPONENT ================= */
export default function ProductCharts({
  products,
}: {
  products: Product[];
}) {
  const [range, setRange] = useState<TimeRange>("all");
  const chartRef = useRef<HTMLDivElement>(null);

  /* ---------- TIME FILTER ---------- */
  const filteredProducts = useMemo(() => {
    if (range === "all") return products;

    const cutoff = Date.now() - 30 * 24 * 60 * 60 * 1000;
    return products.filter(
      (p) =>
        !p.createdAt ||
        new Date(p.createdAt).getTime() >= cutoff
    );
  }, [products, range]);

  /* ---------- AGGREGATION ---------- */
  const stockData = useMemo(() => {
    return Object.values(
      filteredProducts.reduce((acc: any, p) => {
        acc[p.category] ??= { category: p.category, stock: 0 };
        acc[p.category].stock += p.stock;
        return acc;
      }, {})
    );
  }, [filteredProducts]);

  const priceData = useMemo(() => {
    return Object.values(
      filteredProducts.reduce(
        (acc: Record<string, { name: string; value: number }>, p) => {
          acc[p.category] ??= { name: p.category, value: 0 };
          acc[p.category].value += p.price;
          return acc;
        },
        {}
      )
    );
  }, [filteredProducts]);

  /* ---------- EXPORT ---------- */
  async function exportChart() {
    if (!chartRef.current) return;

    const dataUrl = await toPng(chartRef.current, {
      backgroundColor: "#ffffff",
    });

    const link = document.createElement("a");
    link.download = "product-analytics.png";
    link.href = dataUrl;
    link.click();
  }

  /* ---------- EMPTY ---------- */
  if (filteredProducts.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow mb-6 text-center">
        <p className="text-gray-500 text-sm">
          No data available for selected time range.
        </p>
      </div>
    );
  }

  /* ================= UI ================= */
  return (
    <div className="mb-8">
      {/* HEADER CONTROLS */}
      <div className="flex flex-wrap gap-3 justify-between items-center mb-4">
        <div className="flex gap-2">
          <button
            onClick={() => setRange("all")}
            className={`px-3 py-1.5 rounded text-sm border ${
              range === "all"
                ? "bg-blue-500 text-white"
                : "bg-white"
            }`}
          >
            All Time
          </button>
          <button
            onClick={() => setRange("30d")}
            className={`px-3 py-1.5 rounded text-sm border ${
              range === "30d"
                ? "bg-blue-500 text-white"
                : "bg-white"
            }`}
          >
            Last 30 Days
          </button>
        </div>

        <button
          onClick={exportChart}
          className="px-3 py-1.5 rounded text-sm bg-gray-900 text-white hover:bg-gray-800"
        >
          Export PNG
        </button>
      </div>

      {/* CHARTS */}
      <div
        ref={chartRef}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        {/* STOCK CHART */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="font-semibold text-lg mb-1">
            Stock per Category
          </h2>
          <p className="text-xs text-gray-500 mb-4">
            Total inventory grouped by category
          </p>

          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={stockData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" />
              <YAxis />
              <Tooltip
                formatter={(v: number | undefined) =>
                  v !== undefined ? `₹${v.toLocaleString()}` : "N/A"
                }
              />
              <Legend />
              <Bar
                dataKey="stock"
                fill="#2563eb"
                radius={[4, 4, 0, 0]}
                isAnimationActive
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* PRICE CHART */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="font-semibold text-lg mb-1">
            Price Distribution
          </h2>
          <p className="text-xs text-gray-500 mb-4">
            Combined product value per category
          </p>

          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={priceData}
                dataKey="value"
                nameKey="name"
                outerRadius={100}
                paddingAngle={priceData.length > 1 ? 2 : 0}
                label={({ name, value }) =>
                  `${name}: ₹${value.toLocaleString()}`
                }
                isAnimationActive
              >
                {priceData.map((_, i) => (
                  <Cell
                    key={i}
                    fill={COLORS[i % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                formatter={(v: number | undefined) =>
                  v !== undefined ? `₹${v.toLocaleString()}` : "N/A"
                }
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
