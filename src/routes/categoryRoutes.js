import { Router } from "express";

import { createCategory, getCategories } from "../controllers/categoryController.js";
import { auth } from "../middleware/authMiddleware.js";
import { requireRole } from "../middleware/roleMiddleware.js";
import { validate } from "../middleware/validate.js";
import { createCategorySchema } from "../validators/categoryValidators.js";

export const categoryRoutes = Router();

categoryRoutes.get("/", getCategories);
categoryRoutes.post("/", auth, requireRole("admin"), validate(createCategorySchema), createCategory);
