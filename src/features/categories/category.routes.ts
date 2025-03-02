import express from "express";

import { authRequired } from "../../middlewares/auth-required.middleware";
import { shopOwnershipRequired } from "../../middlewares/is-shop-owner.middleware";
import { validate } from "../../middlewares/validator.middleware";
import { createCategory, deleteCategory, getCategories, updateCategory } from "./category.controller";
import { createCategorySchema, updateCategorySchema } from "./category.dto";

const categoriesRouter = express.Router();

categoriesRouter.use(authRequired);
categoriesRouter.use(shopOwnershipRequired);

categoriesRouter.post("/category/", validate(createCategorySchema), createCategory);
categoriesRouter.get("/categories/", getCategories);
categoriesRouter.put("/category/:id", validate(updateCategorySchema), updateCategory);
categoriesRouter.delete("/category/:id", deleteCategory);

export { categoriesRouter };
