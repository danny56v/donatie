import mongoose, { Schema } from "mongoose";

interface IProduct {
  name: string;
  description: string;
  imageUrls: string[];
  used: boolean;
  category: string;
  userId: mongoose.Types.ObjectId;
}

const productSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    imageUrls: [{ type: String, required: false }],
    used: { type: Boolean, required: true },
    category: { type: String, required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

export const Product = mongoose.model<IProduct>("Product", productSchema);
