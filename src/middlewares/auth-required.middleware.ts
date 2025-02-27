import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { config } from "../utils/config";
import { NotAuthorizedError } from "../utils/error-handler";
import { ERROR_MESSAGES } from "../utils/response-messages";
import { verifyToken } from "../utils/auth.utils";

export const authRequired = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    throw new NotAuthorizedError(ERROR_MESSAGES.UNAUTHORIZED_ACCESS);
  }

  try {
    const decoded = verifyToken(token);
    req.user = decoded || undefined;
    next();
  } catch (error) {
    throw new NotAuthorizedError(ERROR_MESSAGES.UNAUTHORIZED_ACCESS);
  }
};
