import { Router } from "express";
import { validate } from "../../middlewares/validator.middleware";
import { loginSchema, registerSchema } from "./user.dto";
import { getMe, loginUser, registerUser } from "./user.controller";
import { authRequired } from "../../middlewares/auth-required.middleware";

const userRouter = Router();

userRouter.post("/user/register", validate(registerSchema), registerUser);
userRouter.post("/user/login", validate(loginSchema), loginUser);
userRouter.get("/user/me", authRequired, getMe);

export { userRouter };
