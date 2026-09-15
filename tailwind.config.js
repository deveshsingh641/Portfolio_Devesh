/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Bricolage Grotesque"', 'system-ui', 'sans-serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['"Space Grotesk"', 'ui-monospace', 'monospace'],
      },
      colors: {
        darkBg: '#09090b',
        darkCard: '#121215',
        darkBorder: '#27272a',
        lightBg: '#fafafa',
        lightCard: '#ffffff',
        lightBorder: '#e4e4e7',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}