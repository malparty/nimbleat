/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{html,js}', './app/styles/**/*.css'],
  theme: {
    extend: {}
  },
  plugins: [require('daisyui')]
};
