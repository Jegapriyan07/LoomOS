import "dotenv/config";
import fs from "node:fs";
import path from "node:path";
import { defineConfig } from "prisma/config";

const localDir =
  process.env.LOOMOS_DATA_DIR ||
  path.join(
    process.env.LOCALAPPDATA || process.env.HOME || process.cwd(),
    "LoomOS",
  );
fs.mkdirSync(localDir, { recursive: true });
const dbFile = path.join(localDir, "dev.db").replace(/\\/g, "/");
const url = process.env.DATABASE_URL?.includes("AppData")
  ? process.env.DATABASE_URL
  : `file:${dbFile}`;

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url,
  },
});
