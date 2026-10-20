import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx,js,jsx}",
    "./components/**/*.{ts,tsx,js,jsx}",
    "./lib/**/*.{ts,tsx,js,jsx}",
  ],
  darkMode: ["selector", '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        bg: "var(--bg)",
        fg: "var(--fg)",
        muted: "var(--muted)",
        subtle: "var(--subtle)",
        nav: "var(--muted)",
        border: "var(--border)",
        hover: "var(--hover)",
        link: "var(--accent)",
        accent: "var(--accent)",
        card: "var(--card)",
        shelf: "var(--shelf)",
        thumb: "var(--thumb)",
        danger: "var(--danger)",
      },
      fontFamily: {
        sans: ["-apple-system", "BlinkMacSystemFont", '"SF Pro Text"', '"Segoe UI"', "Roboto", '"Helvetica Neue"', "Arial", "sans-serif"],
      },
      keyframes: {
        fadeIn: {
          from: { opacity: "0", transform: "translateY(12px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        slideUp: {
          from: { opacity: "0", transform: "translateY(24px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-in": "fadeIn 0.7s ease forwards",
        "slide-up": "slideUp 0.4s ease forwards",
      },
    },
  },
  plugins: [],
};

export default config;
