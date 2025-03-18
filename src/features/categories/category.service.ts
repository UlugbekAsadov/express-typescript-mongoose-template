import mongoose from "mongoose";

import { Category } from "./category.schema";

export const getAllCategories = async (shopId: string) =>
  await Category.aggregate([
    {
      $match: { shop: new mongoose.Types.ObjectId(shopId) },
    },
    {
      $lookup: {
        from: "products",
        localField: "_id",
        foreignField: "category",
        as: "products",
      },
    },
    {
      $addFields: {
        product_count: { $size: "$products" },
      },
    },
    {
      $project: {
        products: 0, // Exclude products array to keep response lightweight
      },
    },
  ]);
