import mongoose, { Document, Schema } from "mongoose";

export interface IShop extends Document {
  name: string;
  description: string | null;
  owner: mongoose.Schema.Types.ObjectId;
  location: string;
  createdAt: Date;
}

const ShopSchema = new Schema<IShop>(
  {
    name: { type: String, required: true, unique: true },
    description: { type: String, required: false },
    owner: { type: Schema.Types.ObjectId, ref: "User", required: true },
    location: { type: String, required: true },
  },
  { timestamps: true },
);

export const Shop = mongoose.model<IShop>("Store", ShopSchema);
