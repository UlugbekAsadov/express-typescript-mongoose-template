import { Order } from "./order.schema";

export const getOrder = async () =>
  await Order.aggregate([
    {
      $unwind: "$products", // Unwind products array to work with individual items
    },
    {
      $lookup: {
        from: "products", // The collection name for products
        localField: "products.product_id",
        foreignField: "_id",
        as: "productDetails",
      },
    },
    {
      $unwind: "$productDetails", // Unwind productDetails array
    },
    {
      $addFields: {
        "products.name": "$productDetails.title",
        "products.price": "$productDetails.price",
      },
    },
    {
      $group: {
        _id: "$_id", // Group back by order ID
        products: { $push: "$products" }, // Reconstruct the products array
        total_price: { $sum: { $multiply: ["$products.quantity", "$productDetails.price"] } }, // Calculate total price
        customer: { $first: "$customer" }, // Keep other fields
        status: { $first: "$status" },
        createdAt: { $first: "$createdAt" },
      },
    },
  ]);
