import mongoose from "mongoose";

interface IDonation extends mongoose.Document {
  product: mongoose.Types.ObjectId;
  owner: mongoose.Types.ObjectId;
  receiver: mongoose.Types.ObjectId;
  confirmedAt: Date;
}

const DonationSchema = new mongoose.Schema<IDonation>({
  product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  receiver: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  confirmedAt: { type: Date, default: Date.now },
});

export const Donation = mongoose.model<IDonation>("Donation", DonationSchema);
