/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Inter"', 'system-ui', 'sans-serif'],
        display: ['"Outfit"', 'system-ui', 'sans-serif'],
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
          primary: "#4F46E5", // Elegant Indigo
          "primary-content": "#ffffff",
          secondary: "#06B6D4", // Vibrant Cyan
          "secondary-content": "#ffffff",
          accent: "#F43F5E", // Vibrant Rose
          "accent-content": "#ffffff",
          neutral: "#0F172A", // Deep Slate
          "neutral-content": "#f8fafc",
          "base-100": "#ffffff", // Pure White Card Backgrounds
          "base-200": "#F8FAFC", // Soft Slate Background
          "base-300": "#F1F5F9", // Slightly darker Slate
          "base-content": "#334155", // Slate 700 text for better readability
          info: "#0EA5E9", // Sky Blue
          "info-content": "#ffffff",
          success: "#10B981", // Emerald Green
          warning: "#F59E0B", // Amber
          error: "#EF4444", // Red
        },
      },
    ],
    darkTheme: "light",
    base: true,
    styled: true,
    utils: true,
  },
};
