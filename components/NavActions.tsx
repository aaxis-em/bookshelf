"use client";

import { signOut } from "next-auth/react";
import { useEffect, useRef, useState } from "react";
import { useTheme } from "./providers/ThemeProvider";

export default function NavActions() {
  const [soundOn, setSoundOn] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { theme, toggleTheme } = useTheme();

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
      {/* Theme toggle */}
      <button
        id="theme-toggle-btn"
        onClick={toggleTheme}
        title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
        className="font-mono text-xs tracking-widest transition-colors duration-200"
        style={{ color: "var(--mist)" }}
        aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
      >
        {theme === "dark" ? (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="12" cy="12" r="5" />
            <line x1="12" y1="1" x2="12" y2="3" />
            <line x1="12" y1="21" x2="12" y2="23" />
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
            <line x1="1" y1="12" x2="3" y2="12" />
            <line x1="21" y1="12" x2="23" y2="12" />
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
          </svg>
        ) : (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
          </svg>
        )}
      </button>

      {/* Divider */}
      <div className="w-px h-4" style={{ background: "var(--slate)" }} aria-hidden />

      {/* Ambient sound toggle */}
      <button
        id="ambient-sound-btn"
        onClick={toggleSound}
        title={soundOn ? "Silence" : "Play ambience"}
        className="font-mono text-xs tracking-widest transition-colors duration-200"
        style={{ color: "var(--mist)" }}
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

      {/* Divider */}
      <div className="w-px h-4" style={{ background: "var(--slate)" }} aria-hidden />

      {/* Sign out */}
      <button
        id="sign-out-btn"
        onClick={() => signOut({ callbackUrl: "/" })}
        className="font-mono text-xs tracking-widest uppercase transition-colors duration-200"
        style={{ color: "var(--mist)" }}
      >
        Leave
      </button>
    </div>
  );
}
