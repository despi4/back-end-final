import { Category } from "../models/Category.js";

function toSlug(value) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export async function getCategories(req, res, next) {
  try {
    const categories = await Category.find().sort({ name: 1 });
    return res.json(categories);
  } catch (error) {
    return next(error);
  }
}

export async function createCategory(req, res, next) {
  try {
    const { name, slug } = req.body;

    const finalSlug = slug ? toSlug(slug) : toSlug(name);

    const category = await Category.create({
      name: name.trim(),
      slug: finalSlug,
    });

    return res.status(201).json(category);
  } catch (error) {
    return next(error);
  }
}
