import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Navbar from "@/components/Navbar";
import BookShelf from "@/components/BookShelf";
import { Book } from "@/components/BookCard";

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
      createdAt: true,
    },
  });

  const books: Book[] = rawBooks.map((b) => ({
    ...b,
    createdAt: b.createdAt.toISOString(),
  }));

  return (
    <div className="min-h-screen" style={{ background: "var(--void)" }}>
      <Navbar />

      <main className="pt-24 pb-16 px-6 max-w-5xl mx-auto">
        {/* Page header */}
        <div className="mb-12 animate-fade-in">
          <div className="flex items-center gap-4 mb-2">
            <div className="h-px w-8" style={{ background: "linear-gradient(to right, transparent, var(--slate))" }} />
            <span className="font-mono text-xs tracking-[0.25em] uppercase" style={{ color: "var(--mist)" }}>
              Personal Collection
            </span>
          </div>
          <h1 className="font-mono text-3xl tracking-wide flicker" style={{ color: "var(--ghost)" }}>
            {session.user.name?.split(" ")[0]}&apos;s Shelf
          </h1>
          <p className="font-serif italic text-sm mt-1" style={{ color: "var(--mist)" }}>
            Every book holds a memory.
          </p>
        </div>

        {/* Shelf */}
        <div className="animate-fade-in" style={{ animationDelay: "0.2s", animationFillMode: "both" }}>
          <BookShelf initialBooks={books} userId={session.user.id} />
        </div>
      </main>
    </div>
  );
}
