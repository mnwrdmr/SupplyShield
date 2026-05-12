import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        mono: ["Fira Code", "monospace"],
        sans: ["Fira Sans", "sans-serif"],
      },
      colors: {
        navy: {
          950: "#020817",
          900: "#0a0f1e",
          800: "#0d1426",
          700: "#111827",
        },
        glass: {
          DEFAULT: "rgba(255,255,255,0.05)",
          border: "rgba(255,255,255,0.1)",
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "hero-glow":
          "radial-gradient(ellipse 80% 50% at 50% -20%, rgba(120,119,198,0.3), transparent)",
      },
      boxShadow: {
        glass: "0 4px 32px 0 rgba(0,0,0,0.37)",
        glow: "0 0 20px rgba(99,102,241,0.3)",
        "glow-amber": "0 0 20px rgba(245,158,11,0.25)",
        "glow-emerald": "0 0 20px rgba(52,211,153,0.25)",
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4,0,0.6,1) infinite",
        "fade-in": "fadeIn 0.5s ease-in-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
