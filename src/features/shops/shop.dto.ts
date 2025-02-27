import Joi from "joi";

export const shopSchema = Joi.object({
  name: Joi.string().min(3).max(50).required(),
  description: Joi.string().optional().max(250),
  subdomain: Joi.string()
    .pattern(/^(?!-)[a-z0-9-]{1,63}(?<!-)$/) // Ensures lowercase alphanumeric & hyphens, no leading/trailing hyphens
    .min(1)
    .max(63)
    .required()
    .messages({
      "string.pattern.base": "Subdomain can only contain lowercase letters, numbers, and hyphens, but cannot start or end with a hyphen.",
      "string.min": "Subdomain must be at least 3 characters long.",
      "string.max": "Subdomain cannot exceed 63 characters.",
      "any.required": "Subdomain is required.",
    }),
  owner: Joi.string().required(),
  location: Joi.array().required(),
  opens_at: Joi.string().optional().allow(null).min(3).max(50),
  closes_at: Joi.string().optional().allow(null).min(3).max(50),
  image: Joi.string().optional().allow(null).min(3).max(50),
  banner: Joi.string().optional().allow(null).min(3).max(50),
});
