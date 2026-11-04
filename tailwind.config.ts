import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#EEF2FF",
          100: "#E0E7FF",
          200: "#C7D2FE",
          300: "#A5B4FC",
          400: "#818CF8",
          500: "#635BFF", // Primary
          600: "#4F46E5",
          700: "#4338CA", // Primary Dark
          800: "#3730A3",
          900: "#312E81",
        },
        lavender: {
          light: "#EEF2FF",
          soft: "#F5F3FF",
          border: "#E2E8F0",
        },
        surface: {
          DEFAULT: "#FFFFFF",
          muted: "#F8FAFC",
          subtle: "#F1F5F9",
        },
        content: {
          primary: "#111827",
          secondary: "#64748B",
          muted: "#94A3B8",
        },
        success: {
          DEFAULT: "#22C55E",
          light: "#DCFCE7",
          dark: "#15803D",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "-apple-system", "sans-serif"],
      },
      boxShadow: {
        subtle: "0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px -1px rgba(0, 0, 0, 0.05)",
        card: "0 4px 20px -2px rgba(99, 91, 255, 0.06), 0 2px 6px -1px rgba(0, 0, 0, 0.04)",
        "card-hover": "0 10px 30px -4px rgba(99, 91, 255, 0.12), 0 4px 10px -2px rgba(0, 0, 0, 0.05)",
        glow: "0 0 25px rgba(99, 91, 255, 0.35)",
        "glow-sm": "0 0 15px rgba(99, 91, 255, 0.2)",
      },
      animation: {
        "float-slow": "float 6s ease-in-out infinite",
        "pulse-subtle": "pulseSubtle 3s ease-in-out infinite",
        "shimmer": "shimmer 2s linear infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-8px)" },
        },
        pulseSubtle: {
          "0%, 100%": { opacity: "1", transform: "scale(1)" },
          "50%": { opacity: "0.85", transform: "scale(1.02)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
