/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#f3f4ff",
          100: "#e8e9ff",
          500: "#4f46e5",
          600: "#4338ca",
          700: "#3730a3"
        }
      },
      boxShadow: {
        soft: "0 14px 40px rgba(15,23,42,.08)",
        card: "0 5px 20px rgba(15,23,42,.06)"
      }
    }
  },
  plugins: []
};