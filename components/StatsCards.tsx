type Props = {
  totalProducts: number;
  totalStock: number;
  avgPrice: number;
};

function formatNumber(value: number) {
  return new Intl.NumberFormat("en-IN").format(value);
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

export default function StatsCards({
  totalProducts,
  totalStock,
  avgPrice,
}: Props) {
  return (
    <section
      aria-label="Product statistics"
      className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
    >
      {/* TOTAL PRODUCTS */}
      <div className="bg-white rounded-xl shadow-sm p-5 transition hover:shadow-md hover:-translate-y-0.5">
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">Total Products</p>
          <span className="text-blue-600 bg-blue-100 px-2 py-1 rounded text-xs font-medium">
            Inventory
          </span>
        </div>
        <h3 className="text-3xl font-bold mt-2 text-gray-900">
          {formatNumber(totalProducts)}
        </h3>
        <p className="text-xs text-gray-400 mt-1">
          All listed products
        </p>
      </div>

      {/* TOTAL STOCK */}
      <div className="bg-white rounded-xl shadow-sm p-5 transition hover:shadow-md hover:-translate-y-0.5">
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">Total Stock</p>
          <span className="text-green-600 bg-green-100 px-2 py-1 rounded text-xs font-medium">
            Units
          </span>
        </div>
        <h3 className="text-3xl font-bold mt-2 text-gray-900">
          {formatNumber(totalStock)}
        </h3>
        <p className="text-xs text-gray-400 mt-1">
          Available across all products
        </p>
      </div>

      {/* AVERAGE PRICE */}
      <div className="bg-white rounded-xl shadow-sm p-5 transition hover:shadow-md hover:-translate-y-0.5">
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">Average Price</p>
          <span className="text-purple-600 bg-purple-100 px-2 py-1 rounded text-xs font-medium">
            Pricing
          </span>
        </div>
        <h3 className="text-3xl font-bold mt-2 text-gray-900">
          {formatCurrency(avgPrice)}
        </h3>
        <p className="text-xs text-gray-400 mt-1">
          Mean product value
        </p>
      </div>
    </section>
  );
}
