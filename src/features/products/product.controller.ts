import { Request, Response } from "express";

import { asyncWrapper } from "../../middlewares/async-wrapper.middleware";
import { NotFoundError } from "../../utils/error-handler";
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from "../../utils/response-messages";
import { IShop } from "../shops/shop.schema";
import { Product } from "./product.schema";

export const createProduct = asyncWrapper(async (req: Request, res: Response) => {
  const { title, description, is_available, image, price, compare_price, variants, category } = req.body;
  const shop = req.shop as IShop;

  const product = new Product({
    title,
    description,
    is_available,
    image,
    price,
    compare_price,
    variants,
    shop: shop._id,
    category,
  });

  await product.save();

  res.status(201).json({ success: true, product });
});

export const getAllProducts = asyncWrapper(async (req: Request, res: Response) => {
  const shop = req.shop as IShop;

  const products = await Product.find({ shop: shop._id }).populate("shop", "_id, name").populate("category", "_id, title");

  res.status(200).json({ success: true, products });
});

export const getProductById = asyncWrapper(async (req: Request, res: Response) => {
  const product = await Product.findById(req.params.id).populate("shop", "_id, name").populate("category", "_id, title");
  if (!product) throw new NotFoundError(ERROR_MESSAGES.PRODUCT_NOT_FOUND);

  res.status(200).json({ success: true, product });
});

export const updateProduct = asyncWrapper(async (req: Request, res: Response) => {
  const { id } = req.params;
  const shop = req.shop as IShop;

  const product = await Product.findOne({ _id: id, shop: shop._id });

  if (!product) throw new NotFoundError(ERROR_MESSAGES.PRODUCT_NOT_FOUND);

  Object.assign(product, req.body);

  await product.save();

  res.status(200).json({ success: true, product });
});

export const deleteProduct = asyncWrapper(async (req: Request, res: Response) => {
  const { id } = req.params;
  const shop = req.shop as IShop;

  const product = await Product.findOne({ _id: id, shop: shop._id });
  if (!product) throw new NotFoundError(ERROR_MESSAGES.PRODUCT_NOT_FOUND);

  await product.deleteOne();
  res.status(200).json({ success: true, message: SUCCESS_MESSAGES.PRODUCT_DELETED_SUCCESSFULLY });
});
