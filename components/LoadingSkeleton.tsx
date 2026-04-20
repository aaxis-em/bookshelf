export default function LoadingSkeleton() {
  const heights = [160, 180, 150, 200, 165, 175, 145, 190, 160, 170];
  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-end gap-0" style={{ minHeight: "220px" }}>
        {heights.map((h, i) => (
          <div
            key={i}
            className="skeleton"
            style={{
              width: `${24 + (i % 4) * 10}px`,
              height: `${h}px`,
              opacity: 0.6,
            }}
          />
        ))}
      </div>
      {/* Shelf plank */}
      <div
        style={{
          height: "10px",
          background: "linear-gradient(to bottom, #2a2418, #1a1612)",
          opacity: 0.5,
        }}
      />
    </div>
  );
}
