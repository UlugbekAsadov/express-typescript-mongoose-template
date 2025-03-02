import { IShop } from "./src/features/shops/shop.schema";
import { IJWTData } from "./src/utils/interfaces/jwt.interface";

declare module "express-serve-static-core" {
  interface Request {
    user: IJWTData | undefined;
    shop: IShop | undefined;
  }
}
