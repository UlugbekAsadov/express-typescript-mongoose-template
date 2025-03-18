import mongoose, { Document, Schema } from "mongoose";

export interface ICategory extends Document {
  title: string;
  description?: string;
  shop: mongoose.Schema.Types.ObjectId;
  is_banner: boolean;
  image?: string;
  is_active: boolean;
}

const CategorySchema = new Schema<ICategory>(
  {
    title: { type: String, required: true },
    description: { type: String },
    shop: { type: Schema.Types.ObjectId, ref: "Shop", required: true },
    is_banner: { type: Boolean, default: false },
    image: { type: String },
    is_active: { type: Boolean, default: false },
  },
  { timestamps: true },
);

export const Category = mongoose.model<ICategory>("Category", CategorySchema);
