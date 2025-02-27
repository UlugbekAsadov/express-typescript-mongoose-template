import { Request, Response, NextFunction } from "express";
import Joi from "joi";
import { ERROR_MESSAGES } from "../utils/response-messages";

export const validate = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.body, { abortEarly: false });

    if (error) {
      res.status(400).json({
        message: ERROR_MESSAGES.VALIDATION_ERROR,
        errors: error.details.map((err) => err.message),
      });

      return;
    }
    next();
  };
};
