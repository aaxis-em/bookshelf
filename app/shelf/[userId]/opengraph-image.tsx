import { ImageResponse } from "next/og";
import { prisma } from "@/lib/prisma";

export const alt = "Shared bookshelf on The Shelf";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({ params }: { params: { userId: string } }) {
  const user = await prisma.user.findUnique({
    where: { id: params.userId },
    select: { name: true, books: { select: { id: true } } },
  });

  const firstName = user?.name?.split(" ")[0] ?? "A reader";
  const bookCount = user?.books.length ?? 0;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#f5f0e8",
          position: "relative",
        }}
      >
        <div
          style={{
            display: "flex",
            position: "absolute",
            top: 40,
            left: 40,
            right: 40,
            bottom: 40,
            border: "1px solid #b0a898",
          }}
        />

        <div
          style={{
            display: "flex",
            fontSize: 22,
            letterSpacing: 6,
            textTransform: "uppercase",
            color: "#6b6358",
          }}
        >
          The Shelf
        </div>

        <div
          style={{
            display: "flex",
            fontSize: 96,
            color: "#2c261e",
            marginTop: 24,
            letterSpacing: -2,
          }}
        >
          {firstName}&apos;s Shelf
        </div>

        <div
          style={{
            display: "flex",
            fontSize: 30,
            color: "#6b6358",
            fontStyle: "italic",
            marginTop: 16,
          }}
        >
          {bookCount} {bookCount === 1 ? "book" : "books"} on the shelf
        </div>
      </div>
    ),
    { ...size }
  );
}
