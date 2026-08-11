import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import PublicShelfView from "./PublicShelfView";
import type { Metadata } from "next";

interface PageProps {
  params: { userId: string };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const user = await prisma.user.findUnique({
    where: { id: params.userId },
    select: { name: true },
  });

  if (!user) return { title: "Not Found" };

  const firstName = user.name?.split(" ")[0] ?? "A reader";

  return {
    title: `${firstName}'s Shelf`,
    description: `Check out ${firstName}'s book collection on The Shelf.`,
    alternates: {
      canonical: `/shelf/${params.userId}`,
    },
    openGraph: {
      title: `${firstName}'s Shelf`,
      description: `See what ${firstName} is reading on The Shelf.`,
      type: "profile",
    },
    twitter: {
      card: "summary_large_image",
      title: `${firstName}'s Shelf`,
      description: `See what ${firstName} is reading on The Shelf.`,
    },
  };
}

export default async function PublicShelfPage({ params }: PageProps) {
  const user = await prisma.user.findUnique({
    where: { id: params.userId },
    select: {
      id: true,
      name: true,
      image: true,
      books: {
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          title: true,
          description: true,
          color: true,
          status: true,
          size: true,
          createdAt: true,
        },
      },
    },
  });

  if (!user) notFound();

  const books = user.books.map((b) => ({
    ...b,
    createdAt: b.createdAt.toISOString(),
  }));

  return (
    <PublicShelfView
      userName={user.name || "Anonymous"}
      userImage={user.image || null}
      books={books}
    />
  );
}
