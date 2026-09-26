export interface Book {
  id: string;
  title: string;
  description: string;
  color?: string | null;
  status?: string | null;
  size?: string | null;
  coverUrl?: string | null;
  author?: string | null;
  createdAt: string;
}

export const COLOR_OPTIONS = [
  { name: "Midnight", hex: "#1a1614" },
  { name: "Crimson", hex: "#8B2500" },
  { name: "Forest", hex: "#3E5641" },
  { name: "Ocean", hex: "#1B3A4B" },
  { name: "Plum", hex: "#6B3A5D" },
  { name: "Walnut", hex: "#5C3317" },
  { name: "Slate", hex: "#2C3E50" },
  { name: "Amber", hex: "#8B6914" },
  { name: "Sage", hex: "#3B5E3B" },
  { name: "Indigo", hex: "#4A4063" },
  { name: "Teal", hex: "#2F4F4F" },
  { name: "Rust", hex: "#6B4226" },
  { name: "Burgundy", hex: "#722F37" },
  { name: "Navy", hex: "#1C2541" },
  { name: "Olive", hex: "#556B2F" },
  { name: "Charcoal", hex: "#36454F" },
];

export const DEFAULT_COLOR = COLOR_OPTIONS[0].hex;

export const STATUS_OPTIONS = [
  { value: "", label: "No status", dot: "var(--subtle)" },
  { value: "reading", label: "Currently reading", dot: "#22c55e" },
  { value: "completed", label: "Completed", dot: "#eab308" },
];

export function getStatus(status?: string | null) {
  return status ? STATUS_OPTIONS.find((s) => s.value === status) ?? null : null;
}

export const SIZE_OPTIONS = [
  { value: "small", label: "S", desc: "Small" },
  { value: "medium", label: "M", desc: "Medium" },
  { value: "large", label: "L", desc: "Large" },
];

// Spine width × height in px; the cover is a 3:4 face hinged to the spine.
const SIZE_DIMENSIONS: Record<string, { spine: number; height: number }> = {
  small: { spine: 36, height: 190 },
  medium: { spine: 42, height: 220 },
  large: { spine: 48, height: 250 },
};

export function getBookDimensions(size?: string | null) {
  const { spine, height } = SIZE_DIMENSIONS[size || "medium"] ?? SIZE_DIMENSIONS.medium;
  return { spine, height, cover: Math.round(height * 0.75) };
}

// Text color that stays legible on top of the given background
export function getContrastColor(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5 ? "#1a1614" : "#f5f0e8";
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
