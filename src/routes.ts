import { Application } from "express";

import { config } from "./utils/config";

export default (app: Application) => {
  const routes = () => {
    app.use(config.basePath, () => {});
  };

  routes();
};
