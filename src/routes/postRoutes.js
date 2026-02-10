import { Router } from "express";

import {
  createPost,
  deletePost,
  getMyPosts,
  getPostById,
  getPublishedPosts,
  updatePost,
} from "../controllers/postController.js";
import {
  createComment,
  deleteComment,
  getCommentsByPost,
} from "../controllers/commentController.js";
import { auth, authOptional } from "../middleware/authMiddleware.js";
import { validate } from "../middleware/validate.js";
import {
  createPostSchema,
  createPostCommentSchema,
  postIdCommentIdParamsSchema,
  postIdParamsSchema,
  updatePostSchema,
} from "../validators/postValidators.js";

export const postRoutes = Router();

postRoutes.get("/public", getPublishedPosts);

postRoutes.post("/", auth, validate(createPostSchema), createPost);
postRoutes.get("/", auth, getMyPosts);
postRoutes.get("/:id", auth, validate(postIdParamsSchema, "params"), getPostById);
postRoutes.put("/:id", auth, validate(postIdParamsSchema, "params"), validate(updatePostSchema), updatePost);
postRoutes.delete("/:id", auth, validate(postIdParamsSchema, "params"), deletePost);

postRoutes.get("/:id/comments", authOptional, validate(postIdParamsSchema, "params"), getCommentsByPost);
postRoutes.post(
  "/:id/comments",
  auth,
  validate(postIdParamsSchema, "params"),
  validate(createPostCommentSchema),
  createComment
);
postRoutes.delete(
  "/:id/comments/:commentId",
  auth,
  validate(postIdCommentIdParamsSchema, "params"),
  deleteComment
);
