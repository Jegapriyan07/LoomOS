import fs from "node:fs";
import path from "node:path";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "@/generated/prisma/client";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

/**
 * Prefer a local (non-OneDrive) path so SQLite does not hang under sync locks
 * when phones hit the API over LAN.
 */
function resolveDatabaseUrl(): string {
  if (process.env.DATABASE_URL?.startsWith("file:") && process.env.LOOMOS_FORCE_DB_URL === "1") {
    return process.env.DATABASE_URL;
  }

  const localDir =
    process.env.LOOMOS_DATA_DIR ||
    path.join(
      process.env.LOCALAPPDATA || process.env.HOME || process.cwd(),
      "LoomOS",
    );
  fs.mkdirSync(localDir, { recursive: true });
  const dbFile = path.join(localDir, "dev.db");
  // Prisma SQLite URLs need forward slashes
  const normalized = dbFile.replace(/\\/g, "/");
  return `file:${normalized}`;
}

function createPrismaClient(): PrismaClient {
  const url = resolveDatabaseUrl();
  if (process.env.NODE_ENV !== "production") {
    console.info(`[LoomOS] Prisma SQLite → ${url}`);
  }
  const adapter = new PrismaBetterSqlite3({ url });
  return new PrismaClient({ adapter });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
