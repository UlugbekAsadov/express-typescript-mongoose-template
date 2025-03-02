import mongoose, { Document, Schema } from "mongoose";

import { ICategory } from "../categories/category.schema";
import { IShop } from "../shops/shop.schema";

export interface IVariant {
  name: string;
  id: string;
  price: number;
  compare_price?: number | null;
  image?: string | null;
}

export interface IProduct extends Document {
  title: string;
  description?: string | null;
  is_available: boolean;
  image?: string | null;
  price: number;
  compare_price?: number | null;
  variants: IVariant[];
  shop: mongoose.Schema.Types.ObjectId | IShop;
  category: mongoose.Schema.Types.ObjectId | ICategory;
}

const VariantSchema = new Schema<IVariant>(
  {
    name: { type: String, required: true },
    id: { type: String, required: true, unique: true },
    price: { type: Number, required: true },
    compare_price: { type: Number, default: null },
    image: { type: String, default: null },
  },
  { _id: false },
);

const ProductSchema = new Schema<IProduct>(
  {
    title: { type: String, required: true },
    description: { type: String, default: null },
    is_available: { type: Boolean, default: true },
    image: { type: String, default: null },
    price: { type: Number, required: true },
    compare_price: { type: Number, default: null },
    variants: { type: [VariantSchema], default: [] },
    shop: { type: Schema.Types.ObjectId, ref: "Shop", required: true },
    category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
  },
  { timestamps: true },
);

export const Product = mongoose.model<IProduct>("Product", ProductSchema);
