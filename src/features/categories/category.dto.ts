import Joi from "joi";

export const createCategorySchema = Joi.object({
  title: Joi.string().min(3).max(50).required(),
  description: Joi.string().allow(null, "").optional(),
});

export const updateCategorySchema = Joi.object({
  title: Joi.string().min(3).max(50).optional(),
  description: Joi.string().allow(null, "").optional(),
});
