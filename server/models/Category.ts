import mongoose, { Schema } from "mongoose";


interface ICategory {
  name: string;
  subcategories: mongoose.Types.ObjectId[];
}

const categorySchema = new Schema<ICategory>({
  name: { type: String, required: true },
  subcategories: [{ type: Schema.Types.ObjectId, ref: "Subcategory" }],
});

export const Category = mongoose.model<ICategory>("Category", categorySchema);
