import mongoose, { Document, Schema } from "mongoose";

export interface IShop extends Document {
  name: string;
  description: string | null;
  owner: mongoose.Schema.Types.ObjectId;
  location: number[];
  opens_at: string | null;
  closes_at: string | null;
  image: string | null;
  banner: string | null;
}

const ShopSchema = new Schema<IShop>(
  {
    name: { type: String, required: true },
    owner: { type: Schema.Types.ObjectId, ref: "User", required: true },
    location: { type: [Number], required: true },
    description: { type: String },
    opens_at: { type: String, default: null },
    closes_at: { type: String, default: null },
    image: { type: String, default: null },
    banner: { type: String, default: null },
  },
  { timestamps: true },
);

export const Shop = mongoose.model<IShop>("Shop", ShopSchema);
