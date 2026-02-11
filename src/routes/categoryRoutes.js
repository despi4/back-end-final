import { Router } from "express";

import { createCategory, getCategories } from "../controllers/categoryController.js";
import { auth } from "../middleware/authMiddleware.js";
import { requirePermission } from "../middleware/roleMiddleware.js";
import { PERMISSIONS } from "../rbac/permissions.js";
import { validate } from "../middleware/validate.js";
import { createCategorySchema } from "../validators/categoryValidators.js";

export const categoryRoutes = Router();

categoryRoutes.get("/", getCategories);
categoryRoutes.post("/", auth, requirePermission(PERMISSIONS.CATEGORY_CREATE), validate(createCategorySchema), createCategory);
