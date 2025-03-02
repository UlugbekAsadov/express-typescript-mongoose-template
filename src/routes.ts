import { Application } from "express";

import { categoriesRouter } from "./features/categories/category.routes";
import { ordersRouter } from "./features/orders/order.route";
import { productRouter } from "./features/products/product.routes";
import { shopRouter } from "./features/shops/shop.routes";
import { userRouter } from "./features/users/user.routes";
import { config } from "./utils/config";

export const userRoutes = (app: Application) => {
  app.use(config.basePath, userRouter);
  app.use(config.basePath, shopRouter);
  app.use(config.basePath, productRouter);
  app.use(config.basePath, categoriesRouter);
  app.use(config.basePath, ordersRouter);
};
