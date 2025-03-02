import { NextFunction, Request, Response } from "express";

import { Shop } from "../features/shops/shop.schema";
import { BadRequestError, NotFoundError } from "../utils/error-handler";
import { ERROR_MESSAGES } from "../utils/response-messages";

export const shopOwnershipRequired = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;
    const host = req.hostname;
    const subdomain = host.split(".")[0];

    if (!userId) {
      throw new BadRequestError(ERROR_MESSAGES.UNAUTHORIZED_ACCESS);
    }

    const shop = await Shop.findOne({ owner: userId });

    if (!shop) {
      throw new NotFoundError(ERROR_MESSAGES.SHOP_NOT_FOUND);
    }

    if (shop.subdomain !== subdomain) {
      throw new BadRequestError(ERROR_MESSAGES.THIS_SHOP_IS_NOT_BELONG_TO_YOU);
    }

    req.shop = shop;

    next();
  } catch (error) {
    next(error);
  }
};
