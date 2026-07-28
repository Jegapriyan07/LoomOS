import dotenv from "dotenv";
import path from "node:path";
import { defineConfig } from "prisma/config";

// Always load project-root .env (Prisma CLI cwd can vary on Windows)
dotenv.config({ path: path.join(process.cwd(), ".env"), override: true });

const raw = process.env.DATABASE_URL?.trim() ?? "";
const url =
  raw && !raw.startsWith("file:")
    ? raw
    : "postgresql://postgres:postgres@localhost:5432/loomos?sslmode=disable";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url,
  },
});
