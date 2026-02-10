import { User } from "../models/User.js";

export async function getProfile(req, res) {
  return res.json({
    id: req.user._id,
    username: req.user.username,
    email: req.user.email,
    role: req.user.role,
    createdAt: req.user.createdAt,
    updatedAt: req.user.updatedAt,
  });
}

export async function updateProfile(req, res, next) {
  try {
    const { username, email } = req.body;

    if (email && email !== req.user.email) {
      const emailInUse = await User.findOne({
        email,
        _id: { $ne: req.user._id },
      });

      if (emailInUse) {
        return res.status(409).json({ message: "Email already used" });
      }
    }

    if (username) {
      req.user.username = username;
    }

    if (email) {
      req.user.email = email;
    }

    await req.user.save();

    return res.json({
      id: req.user._id,
      username: req.user.username,
      email: req.user.email,
      role: req.user.role,
      createdAt: req.user.createdAt,
      updatedAt: req.user.updatedAt,
    });
  } catch (error) {
    return next(error);
  }
}
