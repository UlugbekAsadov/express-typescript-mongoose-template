import Joi from "joi";

export const shopSchema = Joi.object({
  name: Joi.string().min(3).max(50).required(),
  description: Joi.string().optional().max(250),
  owner: Joi.string().required(),
  location: Joi.array().required(),
  opens_at: Joi.string().optional().allow(null).min(3).max(50),
  closes_at: Joi.string().optional().allow(null).min(3).max(50),
  image: Joi.string().optional().allow(null).min(3).max(50),
  banner: Joi.string().optional().allow(null).min(3).max(50),
});
