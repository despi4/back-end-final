import mongoose from "mongoose";
import { ENV } from "./env.js";

export async function connectDB() {
  if (!ENV.MONGO_URI) throw new Error("MONGO_URI is missing in .env");
  await mongoose.connect(ENV.MONGO_URI);
  console.log("MongoDB connected");
}
