import bcrypt from "bcrypt";
import { Request, Response } from "express";

import { asyncWrapper } from "../../middlewares/async-wrapper.middleware";
import { generateToken, hashPassword } from "../../utils/auth.utils";
import { BadRequestError, NotAuthorizedError, NotFoundError } from "../../utils/error-handler";
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from "../../utils/response-messages";
import { User } from "./user.schema";
import { UserRoles } from "./utils/user.enum";

export const loginUser = asyncWrapper(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    throw new NotFoundError(ERROR_MESSAGES.USER_NOT_FOUND);
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new BadRequestError(ERROR_MESSAGES.INVALID_CREDENTIALS);
  }

  const token = generateToken(user.id, user.role);

  res.json({ token, user: { full_name: user.full_name, email: user.email, role: user.role } });
});

export const registerUser = asyncWrapper(async (req: Request, res: Response) => {
  const { full_name, email, password, role, shop_name } = req.body;

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new BadRequestError(ERROR_MESSAGES.EMAIL_ALREADY_EXIST);
  }

  const hashedPassword = await hashPassword(password);

  const user = new User({
    full_name,
    email,
    password: hashedPassword,
    role: role || UserRoles.USER,
    shop_name: role === UserRoles.STORE_OWNER ? shop_name : null,
  });

  await user.save();
  res.status(201).json({ message: SUCCESS_MESSAGES.USER_SUCCESSFULLY_REGISTERED });
});

export const getMe = asyncWrapper(async (req: Request, res: Response) => {
  if (!req?.user) {
    throw new NotAuthorizedError(ERROR_MESSAGES.UNAUTHORIZED_ACCESS);
  }

  const user = await User.findById(req.user.id).select("-password");

  if (!user) {
    throw new NotFoundError(ERROR_MESSAGES.USER_NOT_FOUND);
  }

  res.json({ user });
});
