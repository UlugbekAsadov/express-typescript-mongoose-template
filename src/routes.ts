import { Application } from "express";

import { userRouter } from "./features/users/user.routes";
import { config } from "./utils/config";

export default (app: Application) => {
  const routes = () => {
    app.use(config.basePath, userRouter);
  };

  routes();
};
