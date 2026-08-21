import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        "usa-darkest": "#112e51",
        "usa-dark": "#205493",
        "usa-blue": "#0071bc",
        "usa-red": "#e31c3d",
        "usa-red-dark": "#cd2026",
        "usa-gold": "#fdb81e",
        "usa-gold-light": "#fff1d2",
        "usa-green": "#2e8540",
        "usa-orange": "#e66f0e",
        "usa-gray": "#f1f1f1",
        "usa-gray-medium": "#d6d7d9",
        "usa-gray-dark": "#5b616b",
        "usa-ink": "#212121",
      },
      fontFamily: {
        serif: ["var(--font-merriweather)", "Georgia", "serif"],
        sans: ["var(--font-source-sans)", "Helvetica", "Arial", "sans-serif"],
      },
      maxWidth: {
        site: "75rem",
      },
    },
  },
  plugins: [],
};

export default config;
