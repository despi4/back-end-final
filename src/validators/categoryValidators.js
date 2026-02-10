import Joi from "joi";

export const createCategorySchema = Joi.object({
  name: Joi.string().min(2).max(80).required(),
  slug: Joi.string().min(2).max(120).optional(),
});
