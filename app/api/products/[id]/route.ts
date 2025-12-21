import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/db";
import Product from "@/models/product";

export async function DELETE(
  _: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  // 🔥 THIS LINE FIXES EVERYTHING
  const { id } = await params;

  await connectDB();

  const deleted = await Product.findByIdAndDelete(
    new mongoose.Types.ObjectId(id)
  );

  if (!deleted) {
    return NextResponse.json(
      { error: "Product not found" },
      { status: 404 }
    );
  }

  return NextResponse.json({ success: true });
}
