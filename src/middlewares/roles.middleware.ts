import { NextFunction, Request, Response } from "express";

import { UserRoles } from "../features/users/utils/user.enum";
import { NotAuthorizedError } from "../utils/error-handler";
import { ERROR_MESSAGES } from "../utils/response-messages";

export const isSuperAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user || req.user.role !== UserRoles.SUPER_ADMIN) {
    throw new NotAuthorizedError(ERROR_MESSAGES.UNAUTHORIZED_ACCESS);
  }
  next();
};
