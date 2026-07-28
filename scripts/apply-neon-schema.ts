/**
 * Apply prisma/neon-init.sql via Neon serverless (HTTP/WebSocket).
 * Use when `prisma db push` cannot reach Neon over TCP (common on some Windows networks).
 */
import dotenv from "dotenv";
import fs from "node:fs";
import path from "node:path";
import ws from "ws";
import { neonConfig, Pool } from "@neondatabase/serverless";

dotenv.config({ path: path.join(process.cwd(), ".env"), override: true });
neonConfig.webSocketConstructor = ws;

const url = process.env.DATABASE_URL?.trim();
if (!url || url.startsWith("file:")) {
  console.error("Set DATABASE_URL to your Neon postgresql:// URL");
  process.exit(1);
}

const sqlPath = path.join(process.cwd(), "prisma", "neon-init.sql");
const sql = fs.readFileSync(sqlPath, "utf8");

async function main() {
  const pool = new Pool({ connectionString: url });
  // Run as one script — Neon supports multiple statements in a transaction
  await pool.query(sql);
  await pool.end();
  console.log("Applied prisma/neon-init.sql to Neon.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
