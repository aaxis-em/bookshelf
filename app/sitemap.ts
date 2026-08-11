import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";
import { SITE_URL } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const users = await prisma.user.findMany({
    where: { books: { some: {} } },
    select: { id: true },
  });

  const shelfEntries: MetadataRoute.Sitemap = users.map((user) => ({
    url: `${SITE_URL}/shelf/${user.id}`,
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  return [
    {
      url: SITE_URL,
      changeFrequency: "weekly",
      priority: 1,
    },
    ...shelfEntries,
  ];
}
