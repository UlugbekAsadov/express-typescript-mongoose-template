import { Application } from "express";

import { shopRouter } from "./features/shops/shop.routes";
import { userRouter } from "./features/users/user.routes";
import { config } from "./utils/config";

export const userRoutes = (app: Application) => {
  app.use(config.basePath, userRouter);
  app.use(config.basePath, shopRouter);
};
