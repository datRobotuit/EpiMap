/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        // text: ['Poppins', 'sans-serif'],
        text: ["Montserrat", "sans-serif"],
      },
      colors: {
        primary: "#1976d2",
        secondary: "#FFF671",
        button: "#e08cff",
        descText: "#4D4D4D",
        black: "#000000",
        white: "#ffffff",
      },
      backgroundImage: {
        "primary-gradient":
          "linear-gradient(90deg, rgba(87,186,226,1) 0%, rgba(98,158,243,1) 100%)",
      },
    },
  },
  plugins: [],
};
