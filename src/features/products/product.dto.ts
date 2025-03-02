import Joi from "joi";

const variantSchema = Joi.object({
  id: Joi.string().required(),
  name: Joi.string().trim().min(1).max(100).required(),
  price: Joi.number().min(0).required(),
  compare_price: Joi.number().min(0).optional(),
  image: Joi.string().uri().optional(),
});

export const createProductSchema = Joi.object({
  title: Joi.string().trim().min(3).max(100).required(),
  description: Joi.string().trim().allow(null, "").optional(),
  is_available: Joi.boolean().required(),
  image: Joi.string().uri().allow(null),
  price: Joi.number().min(0).required(),
  compare_price: Joi.number().min(0).optional(),
  variants: Joi.array().items(variantSchema).optional(),
  category: Joi.string().required(),
});

export const updateProductSchema = Joi.object({
  title: Joi.string().trim().min(3).max(100).optional(),
  description: Joi.string().trim().allow(null, "").optional(),
  is_available: Joi.boolean().optional(),
  image: Joi.string().uri().allow(null),
  price: Joi.number().min(0).optional(),
  compare_price: Joi.number().min(0).optional(),
  variants: Joi.array().items(variantSchema).optional(),
  category: Joi.string().optional(),
});
