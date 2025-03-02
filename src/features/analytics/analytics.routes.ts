import { Router } from "express";

import { authRequired } from "../../middlewares/auth-required.middleware";
import { shopOwnershipRequired } from "../../middlewares/is-shop-owner.middleware";
import { getShopAnalytics, getShopAnalyticsCurrentMonth, getShopCustomers } from "./analytics.controller";

const analyticsRouter = Router();

analyticsRouter.get("/analytics/basic/total", authRequired, shopOwnershipRequired, getShopAnalytics);
analyticsRouter.get("/analytics/basic/current-month", authRequired, shopOwnershipRequired, getShopAnalyticsCurrentMonth);
analyticsRouter.get("/analytics/customers", authRequired, shopOwnershipRequired, getShopCustomers);

export default analyticsRouter;
