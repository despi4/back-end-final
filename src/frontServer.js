import "dotenv/config";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const publicDir = path.join(__dirname, "../public");
const frontPort = Number(process.env.FRONT_PORT || 5173);

app.use(express.static(publicDir));

app.listen(frontPort, () => {
  console.log(`Frontend running on http://localhost:${frontPort}`);
});
