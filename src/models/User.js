import mongoose from "mongoose";
import { ROLE_VALUES, ROLES } from "../rbac/roles.js";

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, trim: true, minlength: 3 },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ROLE_VALUES, default: ROLES.USER },
  },
  { timestamps: true }
);

export const User = mongoose.model("User", userSchema);
