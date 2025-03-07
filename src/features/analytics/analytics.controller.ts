import { Request, Response } from "express";
import { ObjectId } from "mongoose";

import { asyncWrapper } from "../../middlewares/async-wrapper.middleware";
import { Order } from "../orders/order.schema";
import { IShop } from "../shops/shop.schema";
import { User } from "../users/user.schema";
import { getAllTimeShopAnalytics, getMonthlyShopAnalytics } from "./analytics.service";

export const getShopAnalytics = asyncWrapper(async (req: Request, res: Response) => {
  const shop = req.shop as IShop;

  const shopId = shop._id as ObjectId;

  const analytics = await getAllTimeShopAnalytics(shopId.toString());

  res.status(200).json(analytics);
});

export const getShopAnalyticsCurrentMonth = asyncWrapper(async (req: Request, res: Response) => {
  const shop = req.shop as IShop;

  const shopId = shop._id as ObjectId;

  const analytics = await getMonthlyShopAnalytics(shopId.toString());

  res.status(200).json({
    success: true,
    data: analytics,
  });
});

export const getShopCustomers = asyncWrapper(async (req: Request, res: Response) => {
  const shop = req.shop!;

  const shopId = shop._id;

  const customerIds = await Order.distinct("user", { shop: shopId });

  const customers = await User.find({ _id: { $in: customerIds } }).select("_id full_name email");

  res.status(200).json({
    success: true,
    data: customers,
  });
});
