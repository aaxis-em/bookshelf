import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import LandingShelf from "@/components/LandingShelf";
import SignInButton from "@/components/SignInButton";
import SiteHeader from "@/components/SiteHeader";
import ThemeToggle from "@/components/ThemeToggle";
import Link from "next/link";

export default async function LandingPage() {
  const session = await getServerSession(authOptions);

  return (
    <>
      <SiteHeader>
        {session && (
          <Link href="/shelf" className="text-muted transition-colors hover:text-fg">
            Your Shelf
          </Link>
        )}
        <ThemeToggle />
      </SiteHeader>

      <main className="mx-auto max-w-3xl px-5 pb-10 pt-16 sm:pt-24">
        <section className="animate-fade-in text-center">
          <h1 className="type-display">
            Every book you&rsquo;ve read.
            <br />
            <span className="text-subtle">On one shelf.</span>
          </h1>
          <p className="mx-auto mt-5 max-w-lg text-[1.3125rem] leading-[1.38] tracking-[0.011em] text-muted">
            Add a book, keep a few notes, and share the shelf with a friend. Covers come from Open Library.
          </p>
          <div className="mt-8 flex flex-col items-center gap-3">
            {session ? (
              <Link href="/shelf" id="enter-shelf-btn" className="btn">
                Go to Your Shelf
              </Link>
            ) : (
              <SignInButton />
            )}
            <span className="meta">Free. Sign in with Google.</span>
          </div>
        </section>

        <section
          className="mt-20 animate-fade-in"
          style={{ animationDelay: "0.2s", animationFillMode: "both", opacity: 0 }}
        >
          <LandingShelf />
          <p className="meta mt-3 text-center">Tap a spine to open it.</p>
        </section>

        <footer className="meta mt-24 flex flex-wrap justify-between gap-2 border-t border-border pt-4">
          <span>Covers courtesy of Open Library.</span>
          <span>© {new Date().getFullYear()} The Shelf</span>
        </footer>
      </main>
    </>
  );
}
