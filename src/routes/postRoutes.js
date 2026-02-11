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
import { requireAnyPermission, requirePermission } from "../middleware/roleMiddleware.js";
import { PERMISSIONS } from "../rbac/permissions.js";
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

postRoutes.post("/", auth, requirePermission(PERMISSIONS.POST_CREATE), validate(createPostSchema), createPost);
postRoutes.get(
  "/",
  auth,
  requireAnyPermission(PERMISSIONS.POST_READ_OWN, PERMISSIONS.POST_READ_ANY),
  getMyPosts
);
postRoutes.get(
  "/:id",
  auth,
  requireAnyPermission(PERMISSIONS.POST_READ_OWN, PERMISSIONS.POST_READ_ANY),
  validate(postIdParamsSchema, "params"),
  getPostById
);
postRoutes.put(
  "/:id",
  auth,
  requireAnyPermission(PERMISSIONS.POST_UPDATE_OWN, PERMISSIONS.POST_UPDATE_ANY),
  validate(postIdParamsSchema, "params"),
  validate(updatePostSchema),
  updatePost
);
postRoutes.delete(
  "/:id",
  auth,
  requireAnyPermission(PERMISSIONS.POST_DELETE_OWN, PERMISSIONS.POST_DELETE_ANY),
  validate(postIdParamsSchema, "params"),
  deletePost
);

postRoutes.get("/:id/comments", authOptional, validate(postIdParamsSchema, "params"), getCommentsByPost);
postRoutes.post(
  "/:id/comments",
  auth,
  requirePermission(PERMISSIONS.COMMENT_CREATE),
  validate(postIdParamsSchema, "params"),
  validate(createPostCommentSchema),
  createComment
);
postRoutes.delete(
  "/:id/comments/:commentId",
  auth,
  requireAnyPermission(PERMISSIONS.COMMENT_DELETE_OWN, PERMISSIONS.COMMENT_DELETE_ANY),
  validate(postIdCommentIdParamsSchema, "params"),
  deleteComment
);
