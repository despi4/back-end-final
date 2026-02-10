import { createApp } from "./app.js";
import { connectDB } from "./config/db.js";
import { ENV } from "./config/env.js";

async function start() {
  await connectDB();

  const app = createApp();
  app.listen(ENV.PORT, () => {
    console.log(`Server running on :${ENV.PORT}`);
  });
}

start().catch((error) => {
  console.error("Failed to start server:", error);
  process.exit(1);
});
