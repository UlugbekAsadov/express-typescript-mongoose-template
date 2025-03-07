import { Router } from "express";

import { authRequired } from "../../middlewares/auth-required.middleware";
import { requireRole } from "../../middlewares/role-required.middleware";
import { validate } from "../../middlewares/validator.middleware";
import { UserRoles } from "../users/utils/user.enum";
import { createProduct, deleteProduct, getAllProducts, getProductById, updateProduct } from "./product.controller";
import { createProductSchema, updateProductSchema } from "./product.dto";

const productRouter = Router();

productRouter.post("/product/", authRequired, requireRole(UserRoles.STORE_OWNER), validate(createProductSchema), createProduct);
productRouter.get("/products/", authRequired, requireRole(UserRoles.STORE_OWNER), getAllProducts);
productRouter.get("/product/:id", getProductById);
productRouter.put("/product/:id", authRequired, requireRole(UserRoles.STORE_OWNER), validate(updateProductSchema), updateProduct);
productRouter.delete("/product/:id", authRequired, requireRole(UserRoles.STORE_OWNER), deleteProduct);

export { productRouter };
