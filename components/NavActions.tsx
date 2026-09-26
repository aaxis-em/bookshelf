"use client";

import { signOut } from "next-auth/react";
import { useEffect, useRef, useState } from "react";
import ThemeToggle from "./ThemeToggle";

export default function NavActions() {
  const [soundOn, setSoundOn] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Use a free ambient sound from a public CDN
    audioRef.current = new Audio(
      "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
    );
    audioRef.current.loop = true;
    audioRef.current.volume = 0.06;
    return () => {
      audioRef.current?.pause();
    };
  }, []);

  const toggleSound = () => {
    if (!audioRef.current) return;
    if (soundOn) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(() => {});
    }
    setSoundOn((s) => !s);
  };

  return (
    <div className="flex items-center gap-3">
      <ThemeToggle />

      <div className="h-4 w-px bg-border" aria-hidden />

      {/* Ambient sound toggle */}
      <button
        id="ambient-sound-btn"
        onClick={toggleSound}
        title={soundOn ? "Silence" : "Play ambience"}
        className="text-nav transition-colors duration-150 hover:text-fg"
        aria-label={soundOn ? "Turn off ambient sound" : "Turn on ambient sound"}
      >
        {soundOn ? (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
            <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
          </svg>
        ) : (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
            <line x1="23" y1="9" x2="17" y2="15" />
            <line x1="17" y1="9" x2="23" y2="15" />
          </svg>
        )}
      </button>

      <div className="h-4 w-px bg-border" aria-hidden />

      <button
        id="sign-out-btn"
        onClick={() => signOut({ callbackUrl: "/" })}
        className="text-sm text-nav transition-colors duration-150 hover:text-fg"
      >
        Sign out
      </button>
    </div>
  );
}
