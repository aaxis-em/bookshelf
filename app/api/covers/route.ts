import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { searchBooks } from "@/lib/openLibrary";
import { NextResponse } from "next/server";

// Cover candidates for the picker. Signed-in only so it isn't an open proxy.
export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q")?.trim().slice(0, 120) ?? "";
  const author = searchParams.get("author")?.trim().slice(0, 120) || null;

  if (q.length < 2) {
    return NextResponse.json({ error: "Query too short" }, { status: 400 });
  }

  return NextResponse.json(await searchBooks(q, author));
}
