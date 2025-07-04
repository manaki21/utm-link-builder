/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#273B7A",
        accent: "#E93F33",
      },
      fontFamily: {
        heading: ["Comfortaa", "cursive"],
        body: ["Open Sans", "sans-serif"],
      },
    },
  },
  plugins: [],
} 