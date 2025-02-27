import { Application } from "express";

import { config } from "./utils/config";
import { userRouter } from "./features/users/user.routes";

export default (app: Application) => {
  const routes = () => {
    app.use(config.basePath, userRouter);
  };

  routes();
};
