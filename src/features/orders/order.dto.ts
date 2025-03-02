import Joi from "joi";

import { OrderStatus } from "./utils/order.enum";

export const createOrderSchema = Joi.object({
  products: Joi.array()
    .items(
      Joi.object({
        product_id: Joi.string().required(),
        variant_id: Joi.string().optional(),
        quantity: Joi.number().min(1).required(),
      }),
    )
    .min(1)
    .required(),
});

export const updateOrderStatusSchema = Joi.object({
  status: Joi.string()
    .valid(...Object.values(OrderStatus))
    .required(),
});
