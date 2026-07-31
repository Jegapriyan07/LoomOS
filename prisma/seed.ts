/**
 * Seed identity into PostgreSQL — same fictional Demo Mode people as before,
 * with stable ids so JSON payment/wallet rows still match.
 *
 * Demo phones:
 *   Weavers: 9876543210 Kavita (South), 9876543211 Selvi (South), 9876543212 Kamala, 9876543213 Lakshmi
 *   Buyers:  9840010001 Saffron, 9840010002 Festival, 9840010003 Loom Link
 */
import dotenv from "dotenv";
import path from "node:path";
import ws from "ws";
import { neonConfig } from "@neondatabase/serverless";
import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient, UserRole } from "../src/generated/prisma/client";

dotenv.config({ path: path.join(process.cwd(), ".env"), override: true });
neonConfig.webSocketConstructor = ws;

const connectionString = process.env.DATABASE_URL?.trim();
if (!connectionString || connectionString.startsWith("file:")) {
  console.error(
    "Set DATABASE_URL to a PostgreSQL connection string before seeding.",
  );
  console.error("Current DATABASE_URL:", connectionString ? "(file: url)" : "(missing)");
  process.exit(1);
}

console.log("Seeding PostgreSQL…");
const adapter = new PrismaNeon({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  const { DEMO_COOPS } = await import("../src/lib/auth/regions");
  const coopId = "cluster-tamil-nadu-kanchipuram";

  for (const coop of DEMO_COOPS) {
    await prisma.cooperative.upsert({
      where: { id: coop.id },
      create: {
        id: coop.id,
        name: coop.name,
        shortName: coop.shortName,
        region: coop.region,
        flavor: `${coop.flavor} Sector: ${coop.sector}.`,
        disclaimer: coop.disclaimer,
      },
      update: {
        name: coop.name,
        shortName: coop.shortName,
        region: coop.region,
        flavor: `${coop.flavor} Sector: ${coop.sector}.`,
        disclaimer: coop.disclaimer,
      },
    });
  }

  const weavers = [
    {
      id: "weaver-demo-001",
      userId: "user-weaver-001",
      phone: "9876543210",
      name: "Kavita",
      givenName: "Kavita",
      primaryLanguage: "ta",
      region: "Tamil Nadu",
      categories: [
        "cotton saree",
        "silk saree",
        "cotton lungi",
        "district:Kanchipuram",
      ],
    },
    {
      id: "weaver-demo-002",
      userId: "user-weaver-002",
      phone: "9876543211",
      name: "Selvi",
      givenName: "Selvi",
      primaryLanguage: "ta",
      region: "Tamil Nadu",
      categories: ["cotton saree", "stole / dupatta", "district:Madurai"],
    },
    {
      id: "weaver-demo-003",
      userId: "user-weaver-003",
      phone: "9876543212",
      name: "Kamala",
      givenName: "Kamala",
      primaryLanguage: "ta",
      region: "Tamil Nadu",
      categories: ["silk saree", "dhoti / angavastram", "district:Salem"],
    },
    {
      id: "weaver-demo-004",
      userId: "user-weaver-004",
      phone: "9876543213",
      name: "Lakshmi",
      givenName: "Lakshmi",
      primaryLanguage: "ta",
      region: "Tamil Nadu",
      categories: [
        "stole / dupatta",
        "dhoti / angavastram",
        "cotton saree",
        "district:Erode",
      ],
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
          region: w.region,
          primaryLanguage: w.primaryLanguage,
          categoriesJson: JSON.stringify(w.categories),
          givenName: w.givenName,
        },
        update: {
          cooperativeId: coopId,
          region: w.region,
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
              region: w.region,
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
      phone: "9840010001",
      businessName: "Saffron Thread Boutique",
      email: "saffron@demo.loom",
    },
    {
      id: "buyer-demo-002",
      userId: "user-buyer-002",
      phone: "9840010002",
      businessName: "Festival Cloth Desk",
      email: "festival@demo.loom",
    },
    {
      id: "buyer-demo-003",
      userId: "user-buyer-003",
      phone: "9840010003",
      businessName: "Loom Link Resellers",
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
          region: "Tamil Nadu",
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

  console.log(
    `Seeded ${DEMO_COOPS.length} cooperatives, 4 weavers, 3 buyers.`,
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
