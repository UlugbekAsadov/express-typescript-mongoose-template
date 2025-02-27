import { Router } from "express";

import { authRequired } from "../../../middlewares/auth-required.middleware";
import { isSuperAdmin } from "../../../middlewares/roles.middleware";
import { validate } from "../../../middlewares/validator.middleware";
import { createShop, deleteShop, getShopById, getShops, updateShop } from "../shop.controller";
import { shopSchema } from "../shop.dto";

const superAdminShopRouter = Router();

superAdminShopRouter.post("/shop", authRequired, isSuperAdmin, validate(shopSchema), createShop);
superAdminShopRouter.get("/shops", authRequired, isSuperAdmin, getShops);
superAdminShopRouter.get("/shop/:id", authRequired, isSuperAdmin, getShopById);
superAdminShopRouter.put("/shop/:id", authRequired, isSuperAdmin, validate(shopSchema), updateShop);
superAdminShopRouter.delete("/shop/:id", authRequired, isSuperAdmin, deleteShop);

export { superAdminShopRouter };
