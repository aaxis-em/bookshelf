"use client";

import { signIn } from "next-auth/react";

export default function SignInButton() {
  return (
    <button
      id="sign-in-google-btn"
      onClick={() => signIn("google", { callbackUrl: "/shelf" })}
      className="group relative font-mono text-sm tracking-[0.15em] uppercase px-8 py-3 border border-slate hover:border-silver transition-all duration-300"
      style={{
        background: "linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)",
        boxShadow: "0 0 0 1px rgba(255,255,255,0.04), inset 0 1px 0 rgba(255,255,255,0.06)",
      }}
    >
      <span className="text-ghost group-hover:text-chalk transition-colors duration-300">
        Sign in to Enter
      </span>
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{ background: "radial-gradient(ellipse at center, rgba(255,255,255,0.04) 0%, transparent 70%)" }}
        aria-hidden
      />
    </button>
  );
}
