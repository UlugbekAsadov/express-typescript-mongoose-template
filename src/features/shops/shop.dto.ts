import Joi from "joi";

export const shopSchema = Joi.object({
  name: Joi.string().min(3).max(50).required(),
  description: Joi.string().optional().max(250),
  owner: Joi.string().required(),
  location: Joi.string().min(3).max(100).required(),
});
