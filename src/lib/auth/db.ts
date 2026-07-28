import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/generated/prisma/client";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

function requireDatabaseUrl(): string {
  const url = process.env.DATABASE_URL?.trim();
  if (!url) {
    throw new Error(
      "DATABASE_URL is required. Use a PostgreSQL URL (Neon, Prisma Postgres, or Vercel Postgres).",
    );
  }
  if (url.startsWith("file:")) {
    throw new Error(
      "SQLite file: URLs are not supported on this build. Set DATABASE_URL to a PostgreSQL connection string.",
    );
  }
  if (
    !url.startsWith("postgres://") &&
    !url.startsWith("postgresql://") &&
    !url.startsWith("prisma+postgres://")
  ) {
    throw new Error(
      "DATABASE_URL must be a PostgreSQL connection string (postgres:// or postgresql://).",
    );
  }
  return url;
}

function createPrismaClient(): PrismaClient {
  const connectionString = requireDatabaseUrl();
  if (process.env.NODE_ENV !== "production") {
    console.info("[LoomOS] Prisma PostgreSQL connected");
  }
  const adapter = new PrismaPg({ connectionString });
  return new PrismaClient({ adapter });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
