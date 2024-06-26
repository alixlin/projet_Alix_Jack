/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    minWidth: {
      '400': '400px',
    },
    maxWidth: {
      '1/2': '50%',
      'maxw' : '28rem'
    },
    extend: {
      aspectRatio: {
        '4/3': '4 / 3',
      },
    },
  },
  plugins: [],
}
