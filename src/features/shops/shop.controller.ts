import { Request, Response } from "express";

import { asyncWrapper } from "../../middlewares/async-wrapper.middleware";
import { NotFoundError } from "../../utils/error-handler";
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from "../../utils/response-messages";
import { User } from "../users/user.schema";
import { UserRoles } from "../users/utils/user.enum";
import { Shop } from "./shop.schema";

export const createShop = asyncWrapper(async (req: Request, res: Response) => {
  const { name, owner, description, location, opens_at, closes_at, image, banner } = req.body;

  const userExists = await User.findById(owner);

  if (!userExists) {
    throw new NotFoundError(ERROR_MESSAGES.USER_NOT_FOUND);
  }

  const shop = await Shop.create({ name, owner, location, description, opens_at, closes_at, image, banner });

  userExists.role = UserRoles.STORE_OWNER;
  userExists.shop = shop._id as string;

  await userExists.save();

  res.status(201).json({ message: SUCCESS_MESSAGES.SHOP_CREATED_SUCCESSFULLY, shop });
});

export const getShops = asyncWrapper(async (req: Request, res: Response) => {
  const shops = await Shop.find().populate("owner", "full_name email");
  res.json(shops);
});

export const getShopById = asyncWrapper(async (req: Request, res: Response) => {
  const { id } = req.params;
  const shop = await Shop.findById(id).populate("owner", "full_name email");

  if (!shop) {
    throw new NotFoundError(ERROR_MESSAGES.SHOP_NOT_FOUND);
  }

  res.json(shop);
});

export const getMyShop = asyncWrapper(async (req: Request, res: Response) => {
  const userId = req.user?.id;

  const shop = await Shop.findOne({ owner: userId }).populate("owner", "full_name email");

  if (!shop) {
    throw new NotFoundError(ERROR_MESSAGES.SHOP_NOT_FOUND);
  }

  res.json(shop);
});

export const updateShop = asyncWrapper(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, description, location, opens_at, closes_at, image, banner } = req.body;

  const shop = await Shop.findById(id);

  if (!shop) {
    throw new NotFoundError(ERROR_MESSAGES.SHOP_NOT_FOUND);
  }

  shop.name = name || shop.name;
  shop.location = location || shop.location;
  shop.description = description || shop?.description;
  shop.opens_at = opens_at || shop?.opens_at;
  shop.closes_at = closes_at || shop?.closes_at;
  shop.image = image || shop?.image;
  shop.banner = banner || shop?.banner;

  await shop.save();

  res.json({ message: SUCCESS_MESSAGES.SHOP_UPDATED_SUCCESSFULLY, shop });
});

export const deleteShop = asyncWrapper(async (req: Request, res: Response) => {
  const { id } = req.params;

  const shop = await Shop.findByIdAndDelete(id);

  if (!shop) {
    throw new NotFoundError(ERROR_MESSAGES.SHOP_NOT_FOUND);
  }

  res.json({ message: SUCCESS_MESSAGES.SHOP_DELETED_SUCCESSFULLY });
});
