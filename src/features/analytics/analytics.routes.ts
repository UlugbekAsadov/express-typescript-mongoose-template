import { Router } from "express";

import { authRequired } from "../../middlewares/auth-required.middleware";
import { requireRole } from "../../middlewares/role-required.middleware";
import { UserRoles } from "../users/utils/user.enum";
import { getShopAnalytics, getShopAnalyticsCurrentMonth, getShopCustomers } from "./analytics.controller";

const analyticsRouter = Router();

analyticsRouter.get("/analytics/basic/total", authRequired, requireRole(UserRoles.STORE_OWNER), getShopAnalytics);
analyticsRouter.get("/analytics/basic/current-month", authRequired, requireRole(UserRoles.STORE_OWNER), getShopAnalyticsCurrentMonth);
analyticsRouter.get("/analytics/customers", authRequired, requireRole(UserRoles.STORE_OWNER), getShopCustomers);

export default analyticsRouter;
