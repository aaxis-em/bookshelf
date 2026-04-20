import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx,js,jsx}",
    "./components/**/*.{ts,tsx,js,jsx}",
    "./lib/**/*.{ts,tsx,js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        void: "#0a0a0a",
        ash: "#111111",
        iron: "#1c1c1c",
        graphite: "#2a2a2a",
        slate: "#3d3d3d",
        mist: "#5a5a5a",
        pewter: "#7a7a7a",
        silver: "#a3a3a3",
        ghost: "#d4d4d4",
        bone: "#f0ede8",
        chalk: "#f5f5f5",
      },
      fontFamily: {
        mono: ['"Special Elite"', "Courier New", "monospace"],
        serif: ['"IM Fell English"', "Georgia", "serif"],
        sans: ['"Inter"', "system-ui", "sans-serif"],
      },
      backgroundImage: {
        "noise": "url('/noise.svg')",
        "radial-dark": "radial-gradient(ellipse at center, #1c1c1c 0%, #0a0a0a 80%)",
      },
      keyframes: {
        flicker: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.85" },
          "75%": { opacity: "0.92" },
        },
        fadeIn: {
          from: { opacity: "0", transform: "translateY(12px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        fadeInSlow: {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        slideUp: {
          from: { opacity: "0", transform: "translateY(24px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        bookPull: {
          from: { transform: "translateY(0) scaleX(1)", opacity: "1" },
          to: { transform: "translateY(-20px) scaleX(0.8)", opacity: "0" },
        },
        glowPulse: {
          "0%, 100%": { boxShadow: "0 0 8px 2px rgba(200,200,200,0.04)" },
          "50%": { boxShadow: "0 0 16px 4px rgba(200,200,200,0.12)" },
        },
      },
      animation: {
        flicker: "flicker 4s ease-in-out infinite",
        "fade-in": "fadeIn 0.7s ease forwards",
        "fade-in-slow": "fadeInSlow 1.5s ease forwards",
        "slide-up": "slideUp 0.5s ease forwards",
        shimmer: "shimmer 2s linear infinite",
        "book-pull": "bookPull 0.4s ease forwards",
        "glow-pulse": "glowPulse 3s ease-in-out infinite",
      },
      boxShadow: {
        "book": "3px 0 8px rgba(0,0,0,0.8), inset -2px 0 4px rgba(0,0,0,0.5)",
        "book-hover": "6px 0 20px rgba(0,0,0,0.9), inset -2px 0 6px rgba(200,200,200,0.05)",
        "glass": "0 4px 32px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.05)",
        "modal": "0 24px 80px rgba(0,0,0,0.9), 0 0 0 1px rgba(255,255,255,0.05)",
      },
    },
  },
  plugins: [],
};

export default config;
