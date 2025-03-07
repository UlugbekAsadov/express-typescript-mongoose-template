import express from "express";

import { authRequired } from "../../middlewares/auth-required.middleware";
import { requireRole } from "../../middlewares/role-required.middleware";
import { validate } from "../../middlewares/validator.middleware";
import { UserRoles } from "../users/utils/user.enum";
import { cancelOrder, createOrder, getOrderById, getOrders, getShopOrders, updateOrderStatus } from "./order.controller";
import { createOrderSchema, updateOrderStatusSchema } from "./order.dto";

const ordersRouter = express.Router();

// 🛒 Create Order (User)
ordersRouter.post("/order/", authRequired, validate(createOrderSchema), createOrder);

// 📦 Get All Orders (User)
ordersRouter.get("/orders/", authRequired, getOrders);

// 📦 Get Single Order (User)
ordersRouter.get("/order/:id", authRequired, getOrderById);

// 📦 Get All Orders (Shop Owner)
ordersRouter.get("/orders-shop/", authRequired, requireRole(UserRoles.STORE_OWNER), getShopOrders);

// 🚚 Update Order Status (Shop Owner)
ordersRouter.put(
  "/order/:id/status",
  authRequired,
  requireRole(UserRoles.STORE_OWNER),
  validate(updateOrderStatusSchema),
  updateOrderStatus,
);

// ❌ Cancel Order (User)
ordersRouter.put("/order/:id/cancel", authRequired, cancelOrder);

export { ordersRouter };
