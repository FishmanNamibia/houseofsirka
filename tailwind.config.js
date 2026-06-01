/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx}", "./components/**/*.{js,jsx}", "./lib/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#151413",
        charcoal: "#282624",
        mist: "#F4F1EC",
        paper: "#FFF9F1",
        cream: "#F7EAD8",
        pearl: "#FFFDF8",
        wine: "#8B1E3F",
        merlot: "#561026",
        jade: "#13685F",
        garden: "#2F5B47",
        blush: "#F7D8D4",
        petal: "#FCE7E2",
        brass: "#B88933",
        marigold: "#F2B84B",
        clay: "#D36B4A",
        sky: "#CFE5E2"
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        display: ["Georgia", "Cambria", "Times New Roman", "serif"]
      },
      boxShadow: {
        soft: "0 18px 55px rgba(21, 20, 19, 0.12)"
      }
    },
  },
  plugins: [],
};
