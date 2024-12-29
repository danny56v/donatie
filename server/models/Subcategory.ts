import mongoose, { Schema } from "mongoose";

export interface ISubcategory {
  name: string;
}

const subcategorySchema = new Schema<ISubcategory>({
  name: { type: String, required: true },
});

export const Subcategory = mongoose.model<ISubcategory>("Subcategory", subcategorySchema);
