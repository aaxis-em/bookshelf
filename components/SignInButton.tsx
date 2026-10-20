"use client";

import { signIn } from "next-auth/react";

export default function SignInButton() {
  return (
    <button
      id="sign-in-google-btn"
      onClick={() => signIn("google", { callbackUrl: "/shelf" })}
      className="btn"
    >
      Start Your Shelf
    </button>
  );
}
