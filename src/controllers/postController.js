import { Category } from "../models/Category.js";
import { Comment } from "../models/Comment.js";
import { Post } from "../models/Post.js";
import { PostCategory } from "../models/PostCategory.js";

function isOwner(user, ownerId) {
  return ownerId.toString() === user._id.toString();
}

async function resolveCategories(categoryIds) {
  if (!categoryIds || categoryIds.length === 0) {
    return [];
  }

  const uniqueIds = [...new Set(categoryIds.map((id) => id.toString()))];
  const categories = await Category.find({ _id: { $in: uniqueIds } }).select("_id name slug");

  if (categories.length !== uniqueIds.length) {
    const error = new Error("One or more categories were not found");
    error.statusCode = 400;
    throw error;
  }

  return categories;
}

async function attachCategoriesToPost(postDoc) {
  const links = await PostCategory.find({ post: postDoc._id }).populate("category", "_id name slug").lean();

  const categories = links
    .map((link) => link.category)
    .filter(Boolean)
    .map((category) => ({
      id: category._id,
      name: category.name,
      slug: category.slug,
    }));

  return {
    ...postDoc.toObject(),
    categories,
  };
}

async function attachCategoriesToPosts(postDocs) {
  if (postDocs.length === 0) {
    return [];
  }

  const postIds = postDocs.map((post) => post._id);
  const links = await PostCategory.find({ post: { $in: postIds } }).populate("category", "_id name slug").lean();

  const categoryMap = new Map();
  for (const post of postDocs) {
    categoryMap.set(post._id.toString(), []);
  }

  for (const link of links) {
    if (!link.category) {
      continue;
    }

    const key = link.post.toString();
    const current = categoryMap.get(key);
    if (!current) {
      continue;
    }

    current.push({
      id: link.category._id,
      name: link.category.name,
      slug: link.category.slug,
    });
  }

  return postDocs.map((post) => ({
    ...post.toObject(),
    categories: categoryMap.get(post._id.toString()) || [],
  }));
}

async function replacePostCategories(postId, categoryIds) {
  await PostCategory.deleteMany({ post: postId });

  if (!categoryIds || categoryIds.length === 0) {
    return;
  }

  const uniqueIds = [...new Set(categoryIds.map((id) => id.toString()))];
  const records = uniqueIds.map((categoryId) => ({
    post: postId,
    category: categoryId,
  }));

  await PostCategory.insertMany(records, { ordered: false });
}

export async function createPost(req, res, next) {
  try {
    const { title, content, tags, isPublished, categoryIds = [] } = req.body;

    await resolveCategories(categoryIds);

    const post = await Post.create({
      title,
      content,
      tags,
      isPublished,
      author: req.user._id,
    });

    await replacePostCategories(post._id, categoryIds);

    const payload = await attachCategoriesToPost(post);
    return res.status(201).json(payload);
  } catch (error) {
    return next(error);
  }
}

export async function getPublishedPosts(req, res, next) {
  try {
    const posts = await Post.find({ isPublished: true })
      .populate("author", "_id username")
      .sort({ createdAt: -1 });

    const payload = await attachCategoriesToPosts(posts);
    return res.json(payload);
  } catch (error) {
    return next(error);
  }
}

export async function getMyPosts(req, res, next) {
  try {
    const posts = await Post.find({ author: req.user._id }).sort({ createdAt: -1 });
    const payload = await attachCategoriesToPosts(posts);
    return res.json(payload);
  } catch (error) {
    return next(error);
  }
}

export async function getPostById(req, res, next) {
  try {
    const post = await Post.findById(req.params.id).populate("author", "_id username role");
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (req.user.role !== "admin" && !isOwner(req.user, post.author._id)) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const payload = await attachCategoriesToPost(post);
    return res.json(payload);
  } catch (error) {
    return next(error);
  }
}

export async function updatePost(req, res, next) {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (req.user.role !== "admin" && !isOwner(req.user, post.author)) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const { categoryIds, ...postData } = req.body;

    if (categoryIds) {
      await resolveCategories(categoryIds);
    }

    Object.assign(post, postData);
    await post.save();

    if (categoryIds) {
      await replacePostCategories(post._id, categoryIds);
    }

    const payload = await attachCategoriesToPost(post);
    return res.json(payload);
  } catch (error) {
    return next(error);
  }
}

export async function deletePost(req, res, next) {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (req.user.role !== "admin" && !isOwner(req.user, post.author)) {
      return res.status(403).json({ message: "Forbidden" });
    }

    await Promise.all([
      PostCategory.deleteMany({ post: post._id }),
      Comment.deleteMany({ post: post._id }),
      post.deleteOne(),
    ]);

    return res.json({ message: "Deleted" });
  } catch (error) {
    return next(error);
  }
}
