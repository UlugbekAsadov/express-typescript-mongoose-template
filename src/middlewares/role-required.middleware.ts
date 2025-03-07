import { NextFunction, Request, Response } from "express";

import { Shop } from "../features/shops/shop.schema";
import { UserRoles } from "../features/users/utils/user.enum";
import { BadRequestError } from "../utils/error-handler";
import { ERROR_MESSAGES } from "../utils/response-messages";

const rolePriority: Record<UserRoles, number> = {
  [UserRoles.USER]: 1,
  [UserRoles.STAFF]: 2,
  [UserRoles.STORE_OWNER]: 3,
  [UserRoles.SUPER_ADMIN]: 4,
};

export const requireRole = (requiredRole: UserRoles) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const userRole = req.user?.role;
    const userShopId = req.user?.shop_id;

    if (!userRole) return next(new BadRequestError(ERROR_MESSAGES.UNAUTHORIZED_ACCESS));

    const hasPermission = rolePriority[userRole] >= rolePriority[requiredRole];

    if (!hasPermission) return next(new BadRequestError(ERROR_MESSAGES.UNAUTHORIZED_ACCESS));

    // Fetch shop only for STAFF or STORE_OWNER
    if (userRole === UserRoles.STAFF || userRole === UserRoles.STORE_OWNER) {
      const shop = await Shop.findById(userShopId);
      if (!shop) return next(new BadRequestError(ERROR_MESSAGES.SHOP_NOT_FOUND));

      req.shop = shop;
    }

    next();
  };
};
