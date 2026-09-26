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

      <main className="mx-auto max-w-3xl px-4 pb-40 pt-24">
        {/* Page header */}
        <header className="mb-10 animate-fade-in">
          <h1 className="text-3xl font-bold">
            {session.user.name?.split(" ")[0]}&apos;s Shelf
          </h1>
          <p className="mt-1 text-muted">Every book holds a memory.</p>
        </header>

        {/* Shelf */}
        <div className="animate-fade-in" style={{ animationDelay: "0.2s", animationFillMode: "both" }}>
          <BookShelf initialBooks={books} userId={session.user.id} />
        </div>
      </main>
    </>
  );
}
