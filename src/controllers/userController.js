import { User } from "../models/User.js";

function toUserPayload(user) {
  return {
    id: user._id,
    username: user.username,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

export async function getProfile(req, res) {
  return res.json(toUserPayload(req.user));
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

    return res.json(toUserPayload(req.user));
  } catch (error) {
    return next(error);
  }
}

export async function listUsers(req, res, next) {
  try {
    const users = await User.find()
      .select("_id username email role createdAt updatedAt")
      .sort({ createdAt: -1 });

    return res.json(users.map((user) => toUserPayload(user)));
  } catch (error) {
    return next(error);
  }
}

export async function updateUserRole(req, res, next) {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (id === req.user._id.toString()) {
      return res.status(400).json({ message: "You cannot change your own role" });
    }

    const user = await User.findById(id).select("_id username email role createdAt updatedAt");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.role = role;
    await user.save();

    return res.json(toUserPayload(user));
  } catch (error) {
    return next(error);
  }
}
