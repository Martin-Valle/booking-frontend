/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    container: {
      center: true,
      padding: "1rem",
    },
    extend: {
      colors: {
        brand: "#1a73e8",
        "brand-dark": "#0b4db3",
        accent: "#ffb703",
      },
      boxShadow: {
        card: "0 8px 28px rgba(2,6,23,.08)",
      },
    },
  },
  plugins: [],
};
