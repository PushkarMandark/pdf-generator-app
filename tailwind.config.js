/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./views/**/*.ejs"],
  theme: {
    extend: {
      colors: {
        'primary': '#2CBF67',
        'primary-variant-light': '#E1F0E7',
        'primary-variant-medium': '#C0ECD1',
        'primary-variant-dark': '#80D9A4',
        'text-color': '#000000',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
