import mongoose from "mongoose";

import { Order } from "../orders/order.schema";
import { OrderStatus } from "../orders/utils/order.enum";

export const getAllTimeShopAnalytics = async (shopId: string) => {
  const orderStatuses = Object.values(OrderStatus); // ["PENDING", "DELIVERING", "DELIVERED", "CANCELLED"]

  const [ordersByStatus, totalSales, totalCustomers, totalOrders] = await Promise.all([
    Order.aggregate([
      { $match: { shop: new mongoose.Types.ObjectId(shopId) } },
      { $group: { _id: "$status", count: { $sum: 1 } } },
      {
        $group: {
          _id: null,
          statuses: { $push: { k: "$_id", v: "$count" } },
        },
      },
      {
        $project: {
          _id: 0,
          ordersByStatus: {
            $mergeObjects: [
              Object.fromEntries(orderStatuses.map((status) => [status, 0])), // Default 0 for missing statuses
              { $arrayToObject: "$statuses" },
            ],
          },
        },
      },
    ]),

    Order.aggregate([
      {
        $match: {
          shop: new mongoose.Types.ObjectId(shopId),
          status: OrderStatus.Delivered, // Only delivered orders count as sales
        },
      },
      { $group: { _id: null, totalSales: { $sum: "$total_price" } } },
    ]),

    Order.distinct("user", { shop: new mongoose.Types.ObjectId(shopId) }), // Get unique customers

    Order.countDocuments({ shop: new mongoose.Types.ObjectId(shopId) }), // Get total number of orders
  ]);

  return {
    totalOrders: totalOrders || 0,
    totalSales: totalSales[0]?.totalSales || 0,
    totalCustomers: totalCustomers.length || 0,
    ordersByStatus: ordersByStatus[0]?.ordersByStatus || Object.fromEntries(orderStatuses.map((status) => [status, 0])),
  };
};

export const getMonthlyShopAnalytics = async (shopId: string) => {
  const orderStatuses = Object.values(OrderStatus); // ["PENDING", "DELIVERING", "DELIVERED", "CANCELLED"]

  // Get the first and last date of the current month
  const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
  const endOfMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0, 23, 59, 59);

  const [ordersByStatus, totalSales, totalCustomers, totalOrders] = await Promise.all([
    Order.aggregate([
      {
        $match: {
          shop: new mongoose.Types.ObjectId(shopId),
          createdAt: { $gte: startOfMonth, $lte: endOfMonth },
        },
      },
      { $group: { _id: "$status", count: { $sum: 1 } } },
      {
        $group: {
          _id: null,
          statuses: { $push: { k: "$_id", v: "$count" } },
        },
      },
      {
        $project: {
          _id: 0,
          ordersByStatus: {
            $mergeObjects: [
              Object.fromEntries(orderStatuses.map((status) => [status, 0])), // Default 0 for missing statuses
              { $arrayToObject: "$statuses" },
            ],
          },
        },
      },
    ]),

    Order.aggregate([
      {
        $match: {
          shop: new mongoose.Types.ObjectId(shopId),
          status: OrderStatus.Delivered, // Only delivered orders count as sales
          createdAt: { $gte: startOfMonth, $lte: endOfMonth },
        },
      },
      { $group: { _id: null, totalSales: { $sum: "$total_price" } } },
    ]),

    Order.distinct("user", {
      shop: new mongoose.Types.ObjectId(shopId),
      createdAt: { $gte: startOfMonth, $lte: endOfMonth },
    }), // Get unique customers for the month

    Order.countDocuments({
      shop: new mongoose.Types.ObjectId(shopId),
      createdAt: { $gte: startOfMonth, $lte: endOfMonth },
    }), // Get total number of orders for the month
  ]);

  return {
    totalOrders: totalOrders || 0,
    totalSales: totalSales[0]?.totalSales || 0,
    totalCustomers: totalCustomers.length || 0,
    ordersByStatus: ordersByStatus[0]?.ordersByStatus || Object.fromEntries(orderStatuses.map((status) => [status, 0])),
  };
};
