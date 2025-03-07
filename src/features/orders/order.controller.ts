import { Request, Response } from "express";

import { asyncWrapper } from "../../middlewares/async-wrapper.middleware";
import { BadRequestError, NotFoundError } from "../../utils/error-handler";
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from "../../utils/response-messages";
import { Product } from "../products/product.schema";
import { Shop } from "../shops/shop.schema";
import { Order } from "./order.schema";
import { OrderStatus } from "./utils/order.enum";

// Create Order
export const createOrder = asyncWrapper(async (req: Request, res: Response) => {
  const { products } = req.body;
  const userId = req.user?.id;
  const subdomain = req.hostname.split(".")[0];

  const shop = await Shop.findOne({ subdomain });

  if (!shop) {
    throw new NotFoundError(ERROR_MESSAGES.SHOP_NOT_FOUND);
  }

  if (!products || !Array.isArray(products) || products.length === 0) {
    throw new BadRequestError(ERROR_MESSAGES.INVALID_ORDER_PRODUCTS);
  }

  let total_price = 0;

  for (const item of products) {
    const product = await Product.findById(item.product_id);
    if (!product) throw new NotFoundError(ERROR_MESSAGES.PRODUCT_NOT_FOUND);

    if (item?.variant_id) {
      const productVariant = product.variants.find((variant) => variant.id === item.variant_id);
      if (!productVariant) {
        throw new NotFoundError(ERROR_MESSAGES.PRODUCT_VARIANT_NOT_FOUND);
      }
      total_price += productVariant.price * item.quantity;

      item.title = productVariant.name;
      item.price = productVariant.price;
      item.compare_price = productVariant.compare_price;
    } else {
      total_price += product.price * item.quantity;

      item.title = product.title;
      item.price = product.price;
      item.compare_price = product.compare_price;
    }
  }

  const order = await Order.create({ user: userId, shop: shop._id, products, total_price, status: OrderStatus.Pending });

  res.status(201).json({ success: true, order });
});

// Get All Orders for User
export const getOrders = asyncWrapper(async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const orders = await Order.find({ user: userId }).populate([
    { path: "shop", select: "_id name" },
    { path: "user", select: "_id full_name" },
  ]);

  res.status(200).json({ success: true, orders });
});

// Get All Orders for Shop Owner
export const getShopOrders = asyncWrapper(async (req: Request, res: Response) => {
  const shopId = req.shop?._id;

  const orders = await Order.find({ shop: shopId }).populate([
    { path: "shop", select: "_id name" },
    { path: "user", select: "_id full_name" },
  ]);

  res.status(200).json({ success: true, data: orders });
});

// Get Single Order
export const getOrderById = asyncWrapper(async (req: Request, res: Response) => {
  const order = await Order.findById(req.params.id).populate([
    { path: "shop", select: "_id name" },
    { path: "user", select: "_id full_name" },
  ]);

  if (!order) throw new NotFoundError(ERROR_MESSAGES.ORDER_NOT_FOUND);
  res.status(200).json({ success: true, data: order });
});

// Update Order Status (Admin/Shop Owner)
export const updateOrderStatus = asyncWrapper(async (req: Request, res: Response) => {
  const { status } = req.body;
  if (!Object.values(OrderStatus).includes(status)) {
    throw new BadRequestError(ERROR_MESSAGES.INVALID_ORDER_STATUS);
  }

  const order = await Order.findById(req.params.id);
  if (!order) throw new NotFoundError(ERROR_MESSAGES.ORDER_NOT_FOUND);

  order.status = status;
  await order.save();

  res.status(200).json({ success: true, order });
});

// Cancel Order
export const cancelOrder = asyncWrapper(async (req: Request, res: Response) => {
  const order = await Order.findById(req.params.id);
  const userId = req.user?.id as string;
  if (!order) throw new NotFoundError(ERROR_MESSAGES.ORDER_NOT_FOUND);

  const isOrderBelongToUser = order.user.toString() === userId;

  if (!isOrderBelongToUser) {
    throw new BadRequestError(ERROR_MESSAGES.THIS_ORDER_IS_NOT_BELONG_TO_YOU);
  }

  order.status = OrderStatus.Cancelled;

  await order.save();

  res.status(200).json({ success: true, message: SUCCESS_MESSAGES.ORDER_CANCELLED_SUCCESSFULLY });
});
