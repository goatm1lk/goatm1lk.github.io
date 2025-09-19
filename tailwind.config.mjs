/* eslint-disable import/no-anonymous-default-export */
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      fontFamily: {
        lexend: ["Lexend", "serif"],
        twop: ["Press Start 2P", "serif"],
      },
      keyframes: {
        "slide-across": {
          "0%": { transform: "translateX(-10%)" },
          "100%": { transform: "translateX(50vw)" },
        },
      },
      animation: {
        "turtle-walk": "slide-across 100s linear infinite",
      },
    },
  },
  plugins: [],
};
