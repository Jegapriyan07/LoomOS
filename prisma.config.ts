import "dotenv/config";
import { defineConfig } from "prisma/config";

/** Placeholder so `prisma generate` works before a real DB is configured. */
const url =
  process.env.DATABASE_URL?.trim() &&
  !process.env.DATABASE_URL.trim().startsWith("file:")
    ? process.env.DATABASE_URL.trim()
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
