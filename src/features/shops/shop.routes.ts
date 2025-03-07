import { Router } from "express";

import { authRequired } from "../../middlewares/auth-required.middleware";
import { requireRole } from "../../middlewares/role-required.middleware";
import { validate } from "../../middlewares/validator.middleware";
import { UserRoles } from "../users/utils/user.enum";
import { createShop, deleteShop, getMyShop, getShopById, getShops, updateShop } from "./shop.controller";
import { shopSchema } from "./shop.dto";

const shopRouter = Router();

shopRouter.post("/admin/shop", authRequired, requireRole(UserRoles.SUPER_ADMIN), validate(shopSchema), createShop);
shopRouter.get("/admin/shops", authRequired, requireRole(UserRoles.SUPER_ADMIN), getShops);
shopRouter.put("/admin/shop/:id", authRequired, requireRole(UserRoles.SUPER_ADMIN), validate(shopSchema), updateShop);
shopRouter.delete("/admin/shop/:id", authRequired, requireRole(UserRoles.SUPER_ADMIN), deleteShop);

shopRouter.get("/shop", authRequired, requireRole(UserRoles.STORE_OWNER), getMyShop);
shopRouter.put("/shop", authRequired, requireRole(UserRoles.STORE_OWNER), updateShop);

shopRouter.get("/shop/:id", authRequired, getShopById);

export { shopRouter };
