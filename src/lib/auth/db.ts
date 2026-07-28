import { neonConfig } from "@neondatabase/serverless";
import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "@/generated/prisma/client";
import ws from "ws";

neonConfig.webSocketConstructor = ws;

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

function requireDatabaseUrl(): string {
  const url = process.env.DATABASE_URL?.trim();
  if (!url) {
    throw new Error(
      "DATABASE_URL is required. Use a Neon PostgreSQL connection string.",
    );
  }
  if (url.startsWith("file:")) {
    throw new Error(
      "SQLite file: URLs are not supported. Set DATABASE_URL to your Neon postgresql:// URL.",
    );
  }
  if (
    !url.startsWith("postgres://") &&
    !url.startsWith("postgresql://")
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
    console.info("[LoomOS] Prisma Neon connected");
  }
  const adapter = new PrismaNeon({ connectionString });
  return new PrismaClient({ adapter });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
