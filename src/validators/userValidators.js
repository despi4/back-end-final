import Joi from "joi";

export const updateProfileSchema = Joi.object({
  username: Joi.string().min(3).max(50),
  email: Joi.string().email(),
}).min(1);
