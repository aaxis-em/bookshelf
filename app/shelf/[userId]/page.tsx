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

  if (!user) return { title: "Not Found — The Shelf" };

  return {
    title: `${user.name?.split(" ")[0]}'s Shelf — The Shelf`,
    description: `Check out ${user.name?.split(" ")[0]}'s book collection on The Shelf.`,
    openGraph: {
      title: `${user.name?.split(" ")[0]}'s Shelf`,
      description: `See what ${user.name?.split(" ")[0]} is reading on The Shelf.`,
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
