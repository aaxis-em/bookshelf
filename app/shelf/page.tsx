import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Navbar from "@/components/Navbar";
import BookShelf from "@/components/BookShelf";
import type { Book } from "@/lib/books";

export const metadata = {
  title: "Your Shelf",
  description: "Your personal bookshelf collection.",
  robots: { index: false, follow: false },
};

export default async function ShelfPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/");
  }

  const rawBooks = await prisma.book.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      title: true,
      description: true,
      color: true,
      status: true,
      size: true,
      coverUrl: true,
      author: true,
      createdAt: true,
    },
  });

  const books: Book[] = rawBooks.map((b) => ({
    ...b,
    createdAt: b.createdAt.toISOString(),
  }));

  return (
    <>
      <Navbar />

      <main className="mx-auto max-w-3xl px-5 pb-40 pt-10">
        <h1 className="type-title mb-2 animate-fade-in">
          {session.user.name?.split(" ")[0]}&rsquo;s Shelf
        </h1>

        <div className="animate-fade-in" style={{ animationDelay: "0.15s", animationFillMode: "both" }}>
          <BookShelf initialBooks={books} userId={session.user.id} />
        </div>
      </main>
    </>
  );
}
