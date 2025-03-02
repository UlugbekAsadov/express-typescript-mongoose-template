import mongoose, { Document, Schema } from "mongoose";

export interface ICategory extends Document {
  title: string;
  description?: string;
  shop: mongoose.Schema.Types.ObjectId;
}

const CategorySchema = new Schema<ICategory>(
  {
    title: { type: String, required: true },
    description: { type: String },
    shop: { type: Schema.Types.ObjectId, ref: "Shop", required: true },
  },
  { timestamps: true },
);

export const Category = mongoose.model<ICategory>("Category", CategorySchema);
