/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["{html,js,}"],
  theme: {
    extend: {
      colors: {
        background: "#F7F9F2",
        def: "#DBC4F0",
        defsec: "#9258c7",
        deftrd: "#7c32bf",
      },
    },
    fontFamily: {
      body: ['Roboto Slab']
    },
  },
  plugins: [],
};
