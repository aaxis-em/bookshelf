import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import LandingShelf from "@/components/LandingShelf";
import SignInButton from "@/components/SignInButton";
import Link from "next/link";

export default async function LandingPage() {
  const session = await getServerSession(authOptions);

  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden landing-gradient">
      {/* Background decorative lines */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden
        style={{
          backgroundImage: `
            linear-gradient(90deg, rgba(255,255,255,0.012) 1px, transparent 1px),
            linear-gradient(rgba(255,255,255,0.012) 1px, transparent 1px)
          `,
          backgroundSize: "80px 80px",
        }}
      />

      {/* Top fade */}
      <div
        className="absolute top-0 inset-x-0 h-32 pointer-events-none"
        style={{ background: "linear-gradient(to bottom, var(--void) 0%, transparent 100%)" }}
        aria-hidden
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center gap-16 px-6 py-12">
        {/* Header */}
        <div className="flex flex-col items-center gap-4 text-center animate-fade-in">
          {/* Ornamental line */}
          <div className="flex items-center gap-3">
            <div className="h-px w-12" style={{ background: "linear-gradient(to right, transparent, var(--pewter))" }} />
            <span className="font-mono text-xs tracking-[0.25em] uppercase" style={{ color: "var(--mist)" }}>Est. MMXXVI</span>
            <div className="h-px w-12" style={{ background: "linear-gradient(to left, transparent, var(--pewter))" }} />
          </div>

          <h1 className="font-mono text-5xl sm:text-6xl md:text-7xl tracking-tight flicker" style={{ color: "var(--ghost)" }}>
            The Shelf
          </h1>

          <p className="font-serif italic text-lg max-w-sm leading-relaxed" style={{ color: "var(--mist)" }}>
            Your cozy corner for the books that inspire you.
          </p>
        </div>

        {/* Bookshelf */}
        <div
          className="animate-fade-in"
          style={{ animationDelay: "0.4s", animationFillMode: "both", opacity: 0 }}
        >
          <LandingShelf />
        </div>

        {/* CTA */}
        <div
          className="flex flex-col items-center gap-4 animate-fade-in"
          style={{ animationDelay: "0.8s", animationFillMode: "both", opacity: 0 }}
        >
          {session ? (
            <Link
              href="/shelf"
              id="enter-shelf-btn"
              className="group relative font-mono text-sm tracking-[0.15em] uppercase px-8 py-3 border transition-all duration-300"
              style={{
                borderColor: "var(--slate)",
                background: "linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)",
                boxShadow: "0 0 0 1px rgba(255,255,255,0.04), inset 0 1px 0 rgba(255,255,255,0.06)",
              }}
            >
              <span className="transition-colors duration-300" style={{ color: "var(--ghost)" }}>
                Enter the Shelf
              </span>
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                style={{ background: "radial-gradient(ellipse at center, rgba(255,255,255,0.04) 0%, transparent 70%)" }}
                aria-hidden
              />
            </Link>
          ) : (
            <SignInButton />
          )}

          <span className="font-mono text-xs tracking-widest" style={{ color: "var(--mist)" }}>
            — start your collection —
          </span>
        </div>

        {/* Atmospheric text */}
        <div
          className="absolute bottom-8 inset-x-0 flex justify-center animate-fade-in"
          style={{ animationDelay: "1.4s", animationFillMode: "both", opacity: 0 }}
        >
          <p className="font-serif italic text-xs"
            style={{ color: "var(--mist)", letterSpacing: "0.1em", opacity: 0.6 }}>
            Every book is a new adventure waiting to begin.
          </p>
        </div>
      </div>

      {/* Bottom fade */}
      <div
        className="absolute bottom-0 inset-x-0 h-32 pointer-events-none"
        style={{ background: "linear-gradient(to top, var(--void) 0%, transparent 100%)" }}
        aria-hidden
      />
    </main>
  );
}
