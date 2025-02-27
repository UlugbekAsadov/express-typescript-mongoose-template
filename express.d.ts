import { IJWTData } from "./src/utils/interfaces/jwt.interface";

declare module "express-serve-static-core" {
  interface Request {
    user: IJWTData | undefined;
  }
}
