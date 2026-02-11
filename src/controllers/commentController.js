import { Comment } from "../models/Comment.js";
import { Post } from "../models/Post.js";
import { can, PERMISSIONS } from "../rbac/permissions.js";

function canAccessPost(user, post) {
  if (post.isPublished) {
    return true;
  }

  if (!user) {
    return false;
  }

  if (can(user.role, PERMISSIONS.POST_READ_ANY)) {
    return true;
  }

  return can(user.role, PERMISSIONS.POST_READ_OWN) && post.author.toString() === user._id.toString();
}

export async function createComment(req, res, next) {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (!canAccessPost(req.user, post)) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const comment = await Comment.create({
      post: post._id,
      author: req.user._id,
      content: req.body.content,
    });

    const populatedComment = await Comment.findById(comment._id).populate("author", "_id username role");

    return res.status(201).json(populatedComment);
  } catch (error) {
    return next(error);
  }
}

export async function getCommentsByPost(req, res, next) {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (!canAccessPost(req.user, post)) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const comments = await Comment.find({ post: post._id })
      .populate("author", "_id username role")
      .sort({ createdAt: -1 });

    return res.json(comments);
  } catch (error) {
    return next(error);
  }
}

export async function deleteComment(req, res, next) {
  try {
    const comment = await Comment.findOne({
      _id: req.params.commentId,
      post: req.params.id,
    });

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    const canDeleteAny = can(req.user.role, PERMISSIONS.COMMENT_DELETE_ANY);
    const canDeleteOwn = can(req.user.role, PERMISSIONS.COMMENT_DELETE_OWN);
    const isOwner = comment.author.toString() === req.user._id.toString();

    if (!canDeleteAny && !(canDeleteOwn && isOwner)) {
      return res.status(403).json({ message: "Forbidden" });
    }

    await comment.deleteOne();
    return res.json({ message: "Deleted" });
  } catch (error) {
    return next(error);
  }
}
