import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";

import { notFound } from "./middleware/notFound.js";
import { errorHandler } from "./middleware/errorMiddleware.js";
import { authRoutes } from "./routes/authRoutes.js";
import { userRoutes } from "./routes/userRoutes.js";
import { postRoutes } from "./routes/postRoutes.js";
import { categoryRoutes } from "./routes/categoryRoutes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function createApp() {
  const app = express();

  app.use(helmet());
  app.use(cors());
  app.use(express.json());
  app.use(morgan("dev"));

  app.use(express.static(path.join(__dirname, "../public")));

  app.get("/health", (req, res) => {
    res.json({ status: "ok" });
  });

  app.use("/", authRoutes);
  app.use("/auth", authRoutes);
  app.use("/users", userRoutes);
  app.use("/posts", postRoutes);
  app.use("/categories", categoryRoutes);

  app.use(notFound);
  app.use(errorHandler);

  return app;
}
