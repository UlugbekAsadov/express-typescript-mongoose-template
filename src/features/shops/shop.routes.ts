import { Router } from "express";

import { authRequired } from "../../middlewares/auth-required.middleware";
import { shopOwnershipRequired } from "../../middlewares/is-shop-owner.middleware";
import { roleMiddleware } from "../../middlewares/roles.middleware";
import { validate } from "../../middlewares/validator.middleware";
import { UserRoles } from "../users/utils/user.enum";
import { createShop, deleteShop, getMyShop, getShopById, getShops, updateShop } from "./shop.controller";
import { shopSchema } from "./shop.dto";

const shopRouter = Router();

shopRouter.post("/admin/shop", authRequired, roleMiddleware([UserRoles.SUPER_ADMIN]), validate(shopSchema), createShop);
shopRouter.get("/admin/shops", authRequired, roleMiddleware([UserRoles.SUPER_ADMIN]), getShops);
shopRouter.put("/admin/shop/:id", authRequired, roleMiddleware([UserRoles.SUPER_ADMIN]), validate(shopSchema), updateShop);
shopRouter.delete("/admin/shop/:id", authRequired, roleMiddleware([UserRoles.SUPER_ADMIN]), deleteShop);

shopRouter.get("/shop", authRequired, shopOwnershipRequired, getMyShop);
shopRouter.put("/shop", authRequired, shopOwnershipRequired, updateShop);

shopRouter.get("/shop/:id", authRequired, getShopById);

export { shopRouter };
