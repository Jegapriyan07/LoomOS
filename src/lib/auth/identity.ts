import { prisma } from "@/lib/auth/db";
import type { Weaver } from "@/lib/types";

export async function getWeaverById(weaverId: string): Promise<Weaver | null> {
  const profile = await prisma.weaverProfile.findUnique({
    where: { id: weaverId },
    include: { user: true, cooperative: true },
  });
  if (!profile) return null;
  let categories: string[] = [];
  try {
    categories = JSON.parse(profile.categoriesJson) as string[];
  } catch {
    categories = [];
  }
  return {
    id: profile.id,
    name: profile.user.name,
    primaryLanguage: profile.primaryLanguage as Weaver["primaryLanguage"],
    region: profile.region,
    categories,
    cooperativeName: profile.cooperative.name,
  };
}

export async function listWeaversFromDb(): Promise<Weaver[]> {
  const rows = await prisma.weaverProfile.findMany({
    include: { user: true, cooperative: true },
    orderBy: { id: "asc" },
  });
  return rows.map((profile) => {
    let categories: string[] = [];
    try {
      categories = JSON.parse(profile.categoriesJson) as string[];
    } catch {
      categories = [];
    }
    return {
      id: profile.id,
      name: profile.user.name,
      primaryLanguage: profile.primaryLanguage as Weaver["primaryLanguage"],
      region: profile.region,
      categories,
      cooperativeName: profile.cooperative.name,
    };
  });
}
