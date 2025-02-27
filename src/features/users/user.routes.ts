import { Router } from "express";

import { authRequired } from "../../middlewares/auth-required.middleware";
import { validate } from "../../middlewares/validator.middleware";
import { getMe, loginUser, registerUser } from "./user.controller";
import { loginSchema, registerSchema } from "./user.dto";

const userRouter = Router();

userRouter.post("/user/register", validate(registerSchema), registerUser);
userRouter.post("/user/login", validate(loginSchema), loginUser);
userRouter.get("/user/me", authRequired, getMe);

export { userRouter };
