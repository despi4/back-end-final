import mongoose from "mongoose";

const postCategorySchema = new mongoose.Schema(
  {
    post: { type: mongoose.Schema.Types.ObjectId, ref: "Post", required: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
  },
  { timestamps: true }
);

postCategorySchema.index({ post: 1, category: 1 }, { unique: true });

export const PostCategory = mongoose.model("PostCategory", postCategorySchema);
