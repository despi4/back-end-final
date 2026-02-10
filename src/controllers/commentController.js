import { Comment } from "../models/Comment.js";
import { Post } from "../models/Post.js";

function canAccessPost(user, post) {
  if (post.isPublished) {
    return true;
  }

  if (!user) {
    return false;
  }

  if (user.role === "admin") {
    return true;
  }

  return post.author.toString() === user._id.toString();
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

    const isAdmin = req.user.role === "admin";
    const isOwner = comment.author.toString() === req.user._id.toString();

    if (!isAdmin && !isOwner) {
      return res.status(403).json({ message: "Forbidden" });
    }

    await comment.deleteOne();
    return res.json({ message: "Deleted" });
  } catch (error) {
    return next(error);
  }
}
