import { NextFunction, Request, Response } from "express";

import { verifyToken } from "../utils/auth.utils";
import { NotAuthorizedError } from "../utils/error-handler";
import { ERROR_MESSAGES } from "../utils/response-messages";

export const authRequired = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    throw new NotAuthorizedError(ERROR_MESSAGES.UNAUTHORIZED_ACCESS);
  }

  try {
    const decoded = verifyToken(token);
    req.user = decoded || undefined;
    next();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    throw new NotAuthorizedError(ERROR_MESSAGES.UNAUTHORIZED_ACCESS);
  }
};
