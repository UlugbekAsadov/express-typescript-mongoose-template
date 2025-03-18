import { Request, Response } from "express";

import { asyncWrapper } from "../../middlewares/async-wrapper.middleware";
import { BadRequestError, NotFoundError } from "../../utils/error-handler";
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from "../../utils/response-messages";
import { Category } from "./category.schema";
import { getAllCategories } from "./category.service";

export const createCategory = asyncWrapper(async (req: Request, res: Response) => {
  const { title, description, is_banner, image, is_active } = req.body;
  const shopId = req.shop?.id;

  if (!shopId) {
    throw new BadRequestError(ERROR_MESSAGES.UNAUTHORIZED_ACCESS);
  }

  const category = await Category.create({ title, description, is_banner, image, is_active, shop: shopId });

  res.status(201).json({ success: true, category });
});

export const getCategories = asyncWrapper(async (req: Request, res: Response) => {
  const shopId = req.shop?.id;

  if (!shopId) {
    throw new BadRequestError(ERROR_MESSAGES.UNAUTHORIZED_ACCESS);
  }

  const categories = await getAllCategories(shopId);

  res.status(200).json({ success: true, data: categories });
});

export const updateCategory = asyncWrapper(async (req: Request, res: Response) => {
  const { id } = req.params;
  const shopId = req.shop?.id;

  const category = await Category.findOneAndUpdate({ _id: id, shop: shopId }, req.body, { new: true, runValidators: true }).populate(
    "shop",
    "_id, name",
  );

  if (!category) {
    throw new NotFoundError(ERROR_MESSAGES.CATEGORY_NOT_FOUND);
  }

  res.status(200).json({ success: true, category });
});

export const deleteCategory = asyncWrapper(async (req: Request, res: Response) => {
  const { id } = req.params;
  const shopId = req.shop?.id;

  const category = await Category.findOneAndDelete({ _id: id, shop: shopId });

  if (!category) {
    throw new NotFoundError(ERROR_MESSAGES.CATEGORY_NOT_FOUND);
  }

  res.status(200).json({ success: true, message: SUCCESS_MESSAGES.CATEGORY_DELETED_SUCCESSFULLY });
});
