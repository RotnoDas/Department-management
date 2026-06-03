/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Inter"', "system-ui", "sans-serif"],
        display: ['"Outfit"', "system-ui", "sans-serif"],
      },
      animation: {
        gradient: "gradient 15s ease infinite",
        "pulse-glow": "pulse-glow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        shimmer: "shimmer 2s infinite",
      },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        light: {
          primary: "#2563EB",
          "primary-content": "#ffffff",
          secondary: "#0D9488",
          "secondary-content": "#ffffff",
          accent: "#E11D48",
          "accent-content": "#ffffff",
          neutral: "#111827",
          "neutral-content": "#f8fafc",
          "base-100": "#ffffff",
          "base-200": "#F8FAFC",
          "base-300": "#E2E8F0",
          "base-content": "#1F2937",
          info: "#0284C7",
          "info-content": "#ffffff",
          success: "#059669",
          warning: "#D97706",
          error: "#DC2626",
        },
      },
    ],
    darkTheme: "light",
    base: true,
    styled: true,
    utils: true,
  },
};
