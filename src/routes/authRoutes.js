import { Router } from "express";

import { login, register } from "../controllers/authController.js";
import { validate } from "../middleware/validate.js";
import { loginSchema, registerSchema } from "../validators/authValidators.js";

export const authRoutes = Router();

authRoutes.post("/register", validate(registerSchema), register);
authRoutes.post("/login", validate(loginSchema), login);
