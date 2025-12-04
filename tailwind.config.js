/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        // This sets the default font-sans to Lato
        sans: ['Lato', 'sans-serif'],
        // This allows you to use font-poppins in your classNames
        poppins: ['Poppins', 'sans-serif'], 
      },
    },
  },
  plugins: [],
}