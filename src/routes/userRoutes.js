import { Router } from "express";

import { getProfile, updateProfile } from "../controllers/userController.js";
import { auth } from "../middleware/authMiddleware.js";
import { validate } from "../middleware/validate.js";
import { updateProfileSchema } from "../validators/userValidators.js";

export const userRoutes = Router();

userRoutes.get("/profile", auth, getProfile);
userRoutes.put("/profile", auth, validate(updateProfileSchema), updateProfile);
