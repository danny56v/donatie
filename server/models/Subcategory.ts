import mongoose, { Schema } from "mongoose";

export interface ISubcategory {
  name: string;
  products: mongoose.Types.ObjectId[];
}

const subcategorySchema = new Schema<ISubcategory>({
  name: { type: String, required: true },
  products: [{ type: mongoose.Types.ObjectId, ref: "Product" }],
});

export const Subcategory = mongoose.model<ISubcategory>("Subcategory", subcategorySchema);
