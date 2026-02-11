import { Router } from "express";

import {
  getProfile,
  listUsers,
  updateProfile,
  updateUserRole,
} from "../controllers/userController.js";
import { auth } from "../middleware/authMiddleware.js";
import { requirePermission } from "../middleware/roleMiddleware.js";
import { PERMISSIONS } from "../rbac/permissions.js";
import { validate } from "../middleware/validate.js";
import {
  updateProfileSchema,
  updateUserRoleSchema,
  userIdParamsSchema,
} from "../validators/userValidators.js";

export const userRoutes = Router();

userRoutes.get("/profile", auth, requirePermission(PERMISSIONS.PROFILE_READ_SELF), getProfile);
userRoutes.put(
  "/profile",
  auth,
  requirePermission(PERMISSIONS.PROFILE_UPDATE_SELF),
  validate(updateProfileSchema),
  updateProfile
);

userRoutes.get("/", auth, requirePermission(PERMISSIONS.USER_READ_ANY), listUsers);
userRoutes.patch(
  "/:id/role",
  auth,
  requirePermission(PERMISSIONS.USER_ROLE_UPDATE_ANY),
  validate(userIdParamsSchema, "params"),
  validate(updateUserRoleSchema),
  updateUserRole
);
