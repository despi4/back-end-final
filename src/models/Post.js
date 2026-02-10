import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, minlength: 3 },
    content: { type: String, required: true, minlength: 10 },
    tags: [{ type: String, trim: true }],
    isPublished: { type: Boolean, default: false },
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

export const Post = mongoose.model("Post", postSchema);
