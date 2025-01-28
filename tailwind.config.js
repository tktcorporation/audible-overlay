/** @type {import('tailwindcss').Config} */

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: [
          "Hiragino Sans",
          "Hiragino Kaku Gothic ProN",
          "Yu Gothic",
          "YuGothic",
          "Meiryo",
          "-apple-system",
          "BlinkMacSystemFont",
          "sans-serif",
        ],
      },
      backgroundColor: {
        'white-transparent': 'rgba(255, 255, 255, 0.95)',
        'gray-transparent': 'rgba(240, 240, 250, 0.95)',
        'dark-transparent': 'rgba(26, 32, 44, 0.95)',
        'darker-transparent': 'rgba(45, 55, 72, 0.95)',
      },
      boxShadow: {
        'active-overlay': '0 -10px 10px rgba(0, 255, 0, 0.4), 0 10px 10px rgba(0, 255, 0, 0.4), -10px 0 10px rgba(0, 255, 0, 0.4), 10px 0 10px rgba(0, 255, 0, 0.4), inset 0 0 30px rgba(0, 255, 0, 0.2), inset 0 0 30px rgba(0, 255, 0, 0.1)',
      },
    },
  },
  plugins: [],
} 