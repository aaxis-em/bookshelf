"use client";

import { signIn } from "next-auth/react";

export default function SignInButton() {
  return (
    <button
      id="sign-in-google-btn"
      onClick={() => signIn("google", { callbackUrl: "/shelf" })}
      className="btn-outline px-5 py-2 text-base"
    >
      Sign in to start your shelf
    </button>
  );
}
