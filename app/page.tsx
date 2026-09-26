import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import LandingShelf from "@/components/LandingShelf";
import SignInButton from "@/components/SignInButton";
import Link from "next/link";

export default async function LandingPage() {
  const session = await getServerSession(authOptions);

  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col items-center justify-center gap-12 px-4 py-16">
      {/* Header */}
      <header className="flex animate-fade-in flex-col items-center gap-3 text-center">
        <h1 className="text-4xl font-bold sm:text-5xl">The Shelf</h1>
        <p className="max-w-md text-lg leading-relaxed text-muted">
          Your cozy corner for the books that inspire you.
        </p>
      </header>

      {/* Bookshelf */}
      <div
        className="w-full animate-fade-in"
        style={{ animationDelay: "0.3s", animationFillMode: "both", opacity: 0 }}
      >
        <LandingShelf />
      </div>

      {/* CTA */}
      <div
        className="flex animate-fade-in flex-col items-center gap-4"
        style={{ animationDelay: "0.6s", animationFillMode: "both", opacity: 0 }}
      >
        {session ? (
          <Link href="/shelf" id="enter-shelf-btn" className="btn-outline px-5 py-2 text-base">
            Enter your shelf →
          </Link>
        ) : (
          <SignInButton />
        )}
        <p className="text-sm text-subtle">Every book is a new adventure waiting to begin.</p>
      </div>
    </main>
  );
}
