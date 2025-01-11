import mongoose, { Schema } from "mongoose";

interface IProduct {
  name: string;
  description: string;
  imageUrls: string[];
  condition: string;
  category: mongoose.Types.ObjectId;
  subcategory: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
}

const productSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    imageUrls: [{ type: String, required: false }],
    condition: { type: String, required: true },
    category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
    subcategory: { type: Schema.Types.ObjectId, ref: "Subcategory", required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

export const Product = mongoose.model<IProduct>("Product", productSchema);
