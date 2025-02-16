import type { Config } from "tailwindcss";

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
        darkColor: "#02161E",
        primary: "#2AB09C",
        foreground: "var(--foreground)",
      },
    },
  },
  plugins: [],
} satisfies Config;
