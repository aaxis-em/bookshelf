import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "The Shelf — Your Personal Bookshelf";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
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

        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ width: 64, height: 1, background: "#6b6358" }} />
          <span
            style={{
              fontSize: 22,
              letterSpacing: 6,
              textTransform: "uppercase",
              color: "#6b6358",
            }}
          >
            Est. MMXXVI
          </span>
          <div style={{ width: 64, height: 1, background: "#6b6358" }} />
        </div>

        <div
          style={{
            display: "flex",
            fontSize: 112,
            color: "#2c261e",
            marginTop: 28,
            letterSpacing: -2,
          }}
        >
          The Shelf
        </div>

        <div
          style={{
            display: "flex",
            fontSize: 32,
            color: "#6b6358",
            fontStyle: "italic",
            marginTop: 16,
          }}
        >
          Your cozy corner for the books that inspire you.
        </div>
      </div>
    ),
    { ...size }
  );
}
