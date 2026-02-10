import jwt from "jsonwebtoken";

import { ENV } from "../config/env.js";
import { User } from "../models/User.js";

export async function auth(req, res, next) {
  try {
    const header = req.headers.authorization;
    if (!header || !header.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token" });
    }

    if (!ENV.JWT_SECRET) {
      return res.status(500).json({ message: "JWT secret is not configured" });
    }

    const token = header.split(" ")[1];
    const payload = jwt.verify(token, ENV.JWT_SECRET);

    const user = await User.findById(payload.userId).select("_id username email role createdAt updatedAt");
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = user;
    return next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
}

export async function authOptional(req, res, next) {
  try {
    const header = req.headers.authorization;
    if (!header || !header.startsWith("Bearer ")) {
      return next();
    }

    if (!ENV.JWT_SECRET) {
      return next();
    }

    const token = header.split(" ")[1];
    const payload = jwt.verify(token, ENV.JWT_SECRET);
    const user = await User.findById(payload.userId).select("_id username email role createdAt updatedAt");

    if (user) {
      req.user = user;
    }

    return next();
  } catch (error) {
    return next();
  }
}
