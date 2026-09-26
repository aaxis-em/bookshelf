import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { findCoverUrl, isOpenLibraryCover } from "@/lib/openLibrary";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const books = await prisma.book.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(books);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { title, description, color, status, size, author, coverUrl } = await req.json();

  if (!title?.trim() || !description?.trim()) {
    return NextResponse.json(
      { error: "Title and description are required" },
      { status: 400 }
    );
  }

  const cleanAuthor =
    typeof author === "string" && author.trim() ? author.trim().slice(0, 120) : null;

  // null = the user chose "No cover"; a picked Open Library URL is kept as-is;
  // anything else falls back to an automatic lookup
  const cover =
    coverUrl === null
      ? null
      : isOpenLibraryCover(coverUrl)
        ? coverUrl
        : await findCoverUrl(title.trim(), cleanAuthor);

  const book = await prisma.book.create({
    data: {
      title: title.trim(),
      description: description.trim(),
      color: color || null,
      status: status || null,
      size: size || "medium",
      coverUrl: cover,
      author: cleanAuthor,
      userId: session.user.id,
    },
  });

  return NextResponse.json(book, { status: 201 });
}
