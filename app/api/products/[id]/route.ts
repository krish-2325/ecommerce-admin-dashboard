import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/db";
import Product from "@/models/product";
import cloudinary from "@/lib/cloudinary";
import { productSchema } from "@/lib/validators/product";

export async function DELETE(
  _: Request,
  { params }: { params: Promise<{ id: string }> }
) {
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

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await connectDB();

    const formData = await req.formData();

    const parsed = productSchema.safeParse({
      name: formData.get("name"),
      price: Number(formData.get("price")),
      stock: Number(formData.get("stock")),
      category: formData.get("category"),
    });

    if (!parsed.success) {
      return NextResponse.json(
        { errors: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const updateData: any = parsed.data;

    const image = formData.get("image") as File | null;
    if (image) {
      const bytes = await image.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const upload: any = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          { folder: "products" },
          (err, result) => {
            if (err) reject(err);
            resolve(result);
          }
        ).end(buffer);
      });

      updateData.image = upload.secure_url;
    }

    const updated = await Product.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );

    if (!updated) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}

