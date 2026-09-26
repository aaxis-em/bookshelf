import { getBookDimensions } from "@/lib/books";

const SIZES = ["medium", "small", "large", "medium", "medium", "small", "large", "medium", "small", "medium"];

export default function LoadingSkeleton() {
  return (
    <div>
      <div className="flex items-end gap-3 overflow-hidden pt-6">
        {SIZES.map((size, i) => {
          const { spine, height } = getBookDimensions(size);
          return <div key={i} className="skeleton shrink-0" style={{ width: spine, height }} />;
        })}
      </div>
      <div className="h-px bg-border" />
    </div>
  );
}
