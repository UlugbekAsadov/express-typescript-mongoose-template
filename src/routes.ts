import { Application } from "express";

import { superAdminShopRouter } from "./features/shops/routes/super-admin-shop.routes";
import { userRouter } from "./features/users/user.routes";
import { config } from "./utils/config";

export const userRoutes = (app: Application) => {
  app.use(config.basePath, userRouter);
};

export const superAdminRoutes = (app: Application) => {
  app.use(config.basePath + "/admin", superAdminShopRouter);
};
