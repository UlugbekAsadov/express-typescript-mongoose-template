import Joi from "joi";

export const createCategorySchema = Joi.object({
  title: Joi.string().min(3).max(50).required(),
  description: Joi.string().allow(null, "").optional(),
  is_banner: Joi.boolean().default(false),
  is_active: Joi.boolean(),
  image: Joi.string().uri().allow(null).optional(),
});

export const updateCategorySchema = Joi.object({
  title: Joi.string().min(3).max(50).optional(),
  description: Joi.string().allow(null, "").optional(),
  is_banner: Joi.boolean().optional(),
  is_active: Joi.boolean().optional(),
  image: Joi.string().uri().allow(null).optional(),
});
