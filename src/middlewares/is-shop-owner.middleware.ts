import { NextFunction, Request, Response } from "express";

import { Shop } from "../features/shops/shop.schema";
import { UserRoles } from "../features/users/utils/user.enum";
import { BadRequestError, NotFoundError } from "../utils/error-handler";
import { ERROR_MESSAGES } from "../utils/response-messages";

export const shopOwnershipRequired = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userShopId = req.user?.shop_id;
    const userRole = req.user?.role;

    if (!userShopId) {
      throw new BadRequestError(ERROR_MESSAGES.UNAUTHORIZED_ACCESS);
    }

    const shop = await Shop.findById(userShopId);

    if (!shop) {
      throw new NotFoundError(ERROR_MESSAGES.SHOP_NOT_FOUND);
    }

    if (userRole !== UserRoles.STORE_OWNER) {
      throw new BadRequestError(ERROR_MESSAGES.THIS_SHOP_IS_NOT_BELONG_TO_YOU);
    }

    req.shop = shop;

    next();
  } catch (error) {
    next(error);
  }
};
