/* eslint-disable @typescript-eslint/no-unused-vars */
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { config } from "./config";
import { IJWTData } from "./interfaces/jwt.interface";

export const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

export const comparePassword = async (password: string, hash: string): Promise<boolean> => {
  return bcrypt.compare(password, hash);
};

export const generateToken = (userId: string, role: string): string => {
  return jwt.sign({ id: userId, role }, config.jwtSecret, { expiresIn: "7d" });
};

export const verifyToken = (token: string): IJWTData | null => {
  try {
    return jwt.verify(token, config.jwtSecret) as IJWTData;
  } catch (err) {
    return null;
  }
};
