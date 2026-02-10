import Joi from "joi";

const objectIdSchema = Joi.string().hex().length(24);

export const createPostSchema = Joi.object({
  title: Joi.string().min(3).max(200).required(),
  content: Joi.string().min(10).required(),
  tags: Joi.array().items(Joi.string().max(30)).default([]),
  isPublished: Joi.boolean().default(false),
  categoryIds: Joi.array().items(objectIdSchema).default([]),
});

export const updatePostSchema = Joi.object({
  title: Joi.string().min(3).max(200),
  content: Joi.string().min(10),
  tags: Joi.array().items(Joi.string().max(30)),
  isPublished: Joi.boolean(),
  categoryIds: Joi.array().items(objectIdSchema),
}).min(1);

export const createPostCommentSchema = Joi.object({
  content: Joi.string().min(1).max(2000).required(),
});

export const postIdParamsSchema = Joi.object({
  id: objectIdSchema.required(),
});

export const postIdCommentIdParamsSchema = Joi.object({
  id: objectIdSchema.required(),
  commentId: objectIdSchema.required(),
});
