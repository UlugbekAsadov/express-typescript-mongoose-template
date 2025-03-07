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

  const token = generateToken(user.id, user.role, user.shop);

  res.cookie(`at`, token, {
    httpOnly: process.env.NODE_ENV === "production", // Secure against XSS
    secure: process.env.NODE_ENV === "production", // Only HTTPS in production
    sameSite: "strict", // Prevent CSRF attacks
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  res.json({ token, user: { full_name: user.full_name, email: user.email, role: user.role } });
});

export const registerUser = asyncWrapper(async (req: Request, res: Response) => {
  const { full_name, email, password, role } = req.body;

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
  });

  await user.save();
  res.status(201).json({ message: SUCCESS_MESSAGES.USER_SUCCESSFULLY_REGISTERED });
});

export const getMe = asyncWrapper(async (req: Request, res: Response) => {
  if (!req?.user) {
    throw new NotAuthorizedError(ERROR_MESSAGES.UNAUTHORIZED_ACCESS);
  }

  const user = await User.findById(req.user.id).select("-password").populate("shop", "_id, name");

  if (!user) {
    throw new NotFoundError(ERROR_MESSAGES.USER_NOT_FOUND);
  }

  res.json(user);
});
