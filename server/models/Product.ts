import mongoose, { Document, Schema } from "mongoose";

export interface IProduct extends Document {
  name: string;
  description: string;
  imageUrls: string[];
  condition: string;
  region: string;
  city: string;
  address: string;
  phone: number;
  category: mongoose.Types.ObjectId;
  subcategory: mongoose.Types.ObjectId;
  owner: mongoose.Types.ObjectId;
  reservedBy: mongoose.Types.ObjectId | null;
  status: "disponibil" | "rezervat" | "finalizat";
  donationConfirmedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const productSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    imageUrls: [{ type: String, required: false }],
    condition: { type: String, required: true },
    region: { type: String, required: true },
    city: { type: String, required: true },
    address: { type: String, required: true },
    phone: { type: Number, required: true },
    category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
    subcategory: { type: Schema.Types.ObjectId, ref: "Subcategory", required: true },
    owner: { type: Schema.Types.ObjectId, ref: "User", required: true },
    reservedBy: { type: Schema.Types.ObjectId, ref: "User", default: null },
    status: { type: String, enum: ["disponibil", "rezervat", "finalizat"], default: "disponibil" },
    donationConfirmedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

export const Product = mongoose.model<IProduct>("Product", productSchema);
