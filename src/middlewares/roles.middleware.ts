import { NextFunction, Request, Response } from "express";

import { UserRoles } from "../features/users/utils/user.enum";
import { BadRequestError, NotAuthorizedError } from "../utils/error-handler";
import { ERROR_MESSAGES } from "../utils/response-messages";

export const roleMiddleware = (allowedRoles: UserRoles[]) => (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    throw new NotAuthorizedError(ERROR_MESSAGES.UNAUTHORIZED_ACCESS);
  }

  if (!allowedRoles.includes(req.user.role)) {
    throw new BadRequestError(ERROR_MESSAGES.NO_ACCESS);
  }

  next();
};
