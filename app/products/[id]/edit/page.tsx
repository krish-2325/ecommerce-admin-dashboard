import EditProductForm from "@/components/EditProductForm";
import { connectDB } from "@/lib/db";
import Product from "@/models/product";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  await connectDB();

  const product = await Product.findById(id).lean<{
    _id: any;
    name: string;
    price: number;
    stock: number;
    category: string;
    image: string;
  }>();

  if (!product) {
    return (
      <div className="bg-gray-100 min-h-screen p-6">
        <div className="bg-white rounded-lg shadow p-6 max-w-xl">
          <p className="text-red-500 font-medium">Product not found</p>
          <Link
            href="/products"
            className="inline-block mt-4 text-blue-600 hover:underline"
          >
            ← Back to Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen p-6">
      {/* Header */}
      <div className="mb-6">
        <Link
          href="/products"
          className="text-sm text-gray-500 hover:text-gray-700"
        >
          ← Back to Products
        </Link>

        <h1 className="text-3xl font-bold mt-2">Edit Product</h1>
        <p className="text-sm text-gray-500">
          Update product details and save changes
        </p>
      </div>
      <div className="bg-white rounded-lg shadow p-6 max-w-2xl">
        <EditProductForm
          product={{
            _id: product._id.toString(),
            name: product.name,
            price: product.price,
            stock: product.stock,
            category: product.category,
            image: product.image,
          }}
        />
      </div>
    </div>
  );
}
