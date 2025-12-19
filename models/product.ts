import mongoose, { Schema, models } from "mongoose";

const ProductSchema = new Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    stock: { type: Number, required: true },
    category: { type: String, required: true },
  },
  { timestamps: true }
);

export const Product =
  models.Product || mongoose.model("Product", ProductSchema);
