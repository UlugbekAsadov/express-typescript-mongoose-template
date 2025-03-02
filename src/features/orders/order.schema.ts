import mongoose, { Document, Schema } from "mongoose";

import { OrderStatus } from "./utils/order.enum";

export interface IOrder extends Document {
  user: mongoose.Schema.Types.ObjectId;
  shop: mongoose.Schema.Types.ObjectId;
  products: {
    product_id: mongoose.Schema.Types.ObjectId;
    variant_id: mongoose.Schema.Types.ObjectId;
    quantity: number;
    price: number;
    title: string;
    compare_price: number | null;
  }[];
  total_price: number;
  status: OrderStatus;
}

const OrderSchema = new Schema<IOrder>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    shop: { type: Schema.Types.ObjectId, ref: "Shop", required: true },
    products: [
      {
        product_id: { type: Schema.Types.ObjectId, ref: "Product", required: true },
        title: { type: String, required: true },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
        variant_id: { type: String },
        compare_price: { type: Number },
      },
    ],
    total_price: { type: Number, required: true },
    status: {
      type: String,
      enum: Object.values(OrderStatus),
      default: OrderStatus.Pending,
    },
  },
  { timestamps: true },
);

export const Order = mongoose.model<IOrder>("Order", OrderSchema);
