/**
 * Seed identity into SQLite — same fictional Demo Mode people as before,
 * with stable ids so JSON payment/wallet rows still match.
 *
 * Demo phones (OTP always 123456 for demo weavers):
 *   Weavers: 9000000001 Meena, 9000000002 Selvi, 9000000003 Kamala, 9000000004 Lakshmi
 *   Buyers:  9100000001 Saffron, 9100000002 Festival, 9100000003 Loom Link
 */
import "dotenv/config";
import fs from "node:fs";
import path from "node:path";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient, UserRole } from "../src/generated/prisma/client";

function resolveDatabaseUrl(): string {
  const localDir =
    process.env.LOOMOS_DATA_DIR ||
    path.join(
      process.env.LOCALAPPDATA || process.env.HOME || process.cwd(),
      "LoomOS",
    );
  fs.mkdirSync(localDir, { recursive: true });
  const dbFile = path.join(localDir, "dev.db");
  return `file:${dbFile.replace(/\\/g, "/")}`;
}

const dbUrl = resolveDatabaseUrl();
console.log("Seeding", dbUrl);
const adapter = new PrismaBetterSqlite3({ url: dbUrl });
const prisma = new PrismaClient({ adapter });

async function main() {
  const coopId = "demo-cluster-nila";

  await prisma.cooperative.upsert({
    where: { id: coopId },
    create: {
      id: coopId,
      name: "Nila Loom Circle (Demo Cluster)",
      shortName: "Nila Loom Circle",
      region: "Tamil Nadu",
      flavor:
        "Fictional Kanchipuram-style silk-and-cotton weaving circle in Tamil Nadu, invented for this prototype.",
      disclaimer:
        "Demo Mode — fictional seed cluster. Not a real cooperative, not live data, not attributed to any real organization or person.",
    },
    update: {},
  });

  const weavers = [
    {
      id: "weaver-demo-001",
      userId: "user-weaver-001",
      phone: "9000000001",
      name: "Meena (demo weaver — fictional)",
      givenName: "Meena",
      primaryLanguage: "ta",
      categories: ["cotton saree", "silk saree", "cotton lungi"],
    },
    {
      id: "weaver-demo-002",
      userId: "user-weaver-002",
      phone: "9000000002",
      name: "Selvi (demo weaver — fictional)",
      givenName: "Selvi",
      primaryLanguage: "ta",
      categories: ["cotton saree", "stole / dupatta"],
    },
    {
      id: "weaver-demo-003",
      userId: "user-weaver-003",
      phone: "9000000003",
      name: "Kamala (demo weaver — fictional)",
      givenName: "Kamala",
      primaryLanguage: "ta",
      categories: ["silk saree", "dhoti / angavastram"],
    },
    {
      id: "weaver-demo-004",
      userId: "user-weaver-004",
      phone: "9000000004",
      name: "Lakshmi (demo weaver — fictional)",
      givenName: "Lakshmi",
      primaryLanguage: "hi",
      categories: ["stole / dupatta", "dhoti / angavastram", "cotton saree"],
    },
  ];

  for (const w of weavers) {
    const existing = await prisma.user.findUnique({ where: { id: w.userId } });
    if (existing) {
      await prisma.user.update({
        where: { id: w.userId },
        data: { phone: w.phone, name: w.name },
      });
      await prisma.weaverProfile.upsert({
        where: { id: w.id },
        create: {
          id: w.id,
          userId: w.userId,
          cooperativeId: coopId,
          region: "Tamil Nadu",
          primaryLanguage: w.primaryLanguage,
          categoriesJson: JSON.stringify(w.categories),
          givenName: w.givenName,
        },
        update: {
          primaryLanguage: w.primaryLanguage,
          categoriesJson: JSON.stringify(w.categories),
          givenName: w.givenName,
        },
      });
    } else {
      await prisma.user.create({
        data: {
          id: w.userId,
          phone: w.phone,
          name: w.name,
          role: UserRole.WEAVER,
          weaver: {
            create: {
              id: w.id,
              cooperativeId: coopId,
              region: "Tamil Nadu",
              primaryLanguage: w.primaryLanguage,
              categoriesJson: JSON.stringify(w.categories),
              givenName: w.givenName,
            },
          },
        },
      });
    }
  }

  const buyers = [
    {
      id: "buyer-demo-001",
      userId: "user-buyer-001",
      phone: "9100000001",
      businessName: "Saffron Thread Boutique (demo — fictional)",
      email: "saffron@demo.loom",
    },
    {
      id: "buyer-demo-002",
      userId: "user-buyer-002",
      phone: "9100000002",
      businessName: "Festival Cloth Desk (demo — fictional)",
      email: "festival@demo.loom",
    },
    {
      id: "buyer-demo-003",
      userId: "user-buyer-003",
      phone: "9100000003",
      businessName: "Loom Link Resellers (demo — fictional)",
      email: "loomlink@demo.loom",
    },
  ];

  for (const b of buyers) {
    const existing = await prisma.user.findUnique({ where: { id: b.userId } });
    if (existing) {
      await prisma.user.update({
        where: { id: b.userId },
        data: { phone: b.phone, name: b.businessName },
      });
      await prisma.buyerProfile.upsert({
        where: { id: b.id },
        create: {
          id: b.id,
          userId: b.userId,
          region: "Tamil Nadu",
          businessName: b.businessName,
          email: b.email,
        },
        update: {
          businessName: b.businessName,
          email: b.email,
        },
      });
    } else {
      await prisma.user.create({
        data: {
          id: b.userId,
          phone: b.phone,
          name: b.businessName,
          role: UserRole.BUYER,
          buyer: {
            create: {
              id: b.id,
              region: "Tamil Nadu",
              businessName: b.businessName,
              email: b.email,
            },
          },
        },
      });
    }
  }

  console.log("Seeded cooperative, 4 weavers, 3 buyers.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
