/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        wine: {
          50: '#fdf2f4',
          100: '#fbe7ea',
          600: '#9b1c31',
          700: '#7a1524',
          800: '#63131e',
          900: '#52121b',
        }
      }
    },
  },
  plugins: [],
}