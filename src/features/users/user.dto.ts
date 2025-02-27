import Joi from "joi";
import { UserRoles } from "./utils/user.enum";

export const registerSchema = Joi.object({
  full_name: Joi.string().min(3).max(50).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  role: Joi.string()
    .valid(...Object.values(UserRoles))
    .required(),
  shop_name: Joi.alternatives().conditional("role", {
    is: UserRoles.STORE_OWNER,
    then: Joi.string().min(3).max(50).required(),
    otherwise: Joi.allow(null),
  }),
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});
