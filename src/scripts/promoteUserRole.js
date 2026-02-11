import "dotenv/config";
import mongoose from "mongoose";

import { ENV } from "../config/env.js";
import { User } from "../models/User.js";
import { ROLE_VALUES } from "../rbac/roles.js";

async function main() {
  const emailArg = process.argv[2];
  const roleArg = (process.argv[3] || "admin").toLowerCase();

  if (!emailArg) {
    console.error("Usage: npm run rbac:promote -- <email> [role]");
    process.exit(1);
  }

  if (!ROLE_VALUES.includes(roleArg)) {
    console.error(`Invalid role: ${roleArg}. Allowed roles: ${ROLE_VALUES.join(", ")}`);
    process.exit(1);
  }

  if (!ENV.MONGO_URI) {
    console.error("MONGO_URI is missing in .env");
    process.exit(1);
  }

  const email = emailArg.toLowerCase().trim();

  await mongoose.connect(ENV.MONGO_URI);
  try {
    const user = await User.findOne({ email });
    if (!user) {
      console.error(`User with email '${email}' not found`);
      process.exitCode = 1;
      return;
    }

    user.role = roleArg;
    await user.save();
    console.log(`Role updated: ${user.email} -> ${user.role}`);
  } finally {
    await mongoose.disconnect();
  }
}

main().catch((error) => {
  console.error("Failed to promote user:", error.message);
  process.exit(1);
});
