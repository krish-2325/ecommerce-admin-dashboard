import EditProductForm from "@/components/EditProductForm";
import { connectDB } from "@/lib/db";
import Product from "@/models/product";
import mongoose from "mongoose";
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
    return <p className="p-4">Product not found</p>;
  }

  return (
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
  );
}
