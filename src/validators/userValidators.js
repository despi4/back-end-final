import Joi from "joi";
import { ROLE_VALUES } from "../rbac/roles.js";

const objectIdSchema = Joi.string().hex().length(24);

export const updateProfileSchema = Joi.object({
  username: Joi.string().min(3).max(50),
  email: Joi.string().email(),
}).min(1);

export const userIdParamsSchema = Joi.object({
  id: objectIdSchema.required(),
});

export const updateUserRoleSchema = Joi.object({
  role: Joi.string()
    .valid(...ROLE_VALUES)
    .required(),
});
