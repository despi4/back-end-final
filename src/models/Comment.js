import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    post: { type: mongoose.Schema.Types.ObjectId, ref: "Post", required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    content: { type: String, required: true, minlength: 1, maxlength: 2000 },
  },
  { timestamps: true }
);

export const Comment = mongoose.model("Comment", commentSchema);
