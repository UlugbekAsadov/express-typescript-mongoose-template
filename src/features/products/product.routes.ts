import { Router } from "express";

import { authRequired } from "../../middlewares/auth-required.middleware";
import { shopOwnershipRequired } from "../../middlewares/is-shop-owner.middleware";
import { validate } from "../../middlewares/validator.middleware";
import { createProduct, deleteProduct, getAllProducts, getProductById, updateProduct } from "./product.controller";
import { createProductSchema, updateProductSchema } from "./product.dto";

const productRouter = Router();

productRouter.post("/product/", authRequired, shopOwnershipRequired, validate(createProductSchema), createProduct);
productRouter.get("/products/", authRequired, shopOwnershipRequired, getAllProducts);
productRouter.get("/product/:id", getProductById);
productRouter.put("/product/:id", authRequired, shopOwnershipRequired, validate(updateProductSchema), updateProduct);
productRouter.delete("/product/:id", authRequired, shopOwnershipRequired, deleteProduct);

export { productRouter };
