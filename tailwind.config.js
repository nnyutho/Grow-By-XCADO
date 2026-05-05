/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        grove:   '#0F3D20',
        field:   '#1E7A3E',
        shoot:   '#5BB35E',
        lime:    '#9DD96A',
        harvest: '#E8A020',
        earth:   '#7A4E2D',
        chalk:   '#F5F1E8',
        ink:     '#0C1A0E',
      },
      fontFamily: {
        display: ['"Barlow Condensed"', 'sans-serif'],
        sans:    ['Outfit', '"Plus Jakarta Sans"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
