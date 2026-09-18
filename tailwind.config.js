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
        body: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['Bitter', 'Georgia', 'serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      colors: {
        background: 'hsl(var(--background) / <alpha-value>)',
        foreground: 'hsl(var(--foreground) / <alpha-value>)',
        card: {
          DEFAULT: 'hsl(var(--card) / <alpha-value>)',
          foreground: 'hsl(var(--card-foreground) / <alpha-value>)',
        },
        primary: {
          DEFAULT: 'hsl(var(--primary) / <alpha-value>)',
          foreground: 'hsl(var(--primary-foreground) / <alpha-value>)',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary) / <alpha-value>)',
          foreground: 'hsl(var(--secondary-foreground) / <alpha-value>)',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted) / <alpha-value>)',
          foreground: 'hsl(var(--muted-foreground) / <alpha-value>)',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent) / <alpha-value>)',
          foreground: 'hsl(var(--accent-foreground) / <alpha-value>)',
        },
        border: 'hsl(var(--border) / <alpha-value>)',
        ring: 'hsl(var(--ring) / <alpha-value>)',
        'quote-surface': 'hsl(var(--quote-surface) / <alpha-value>)',
        'quote-deep': 'hsl(var(--quote-deep) / <alpha-value>)',
        'quote-glow': 'hsl(var(--quote-glow) / <alpha-value>)',
      },
      animation: {
        'quote-drift': 'quote-drift 20s ease-in-out infinite',
        'quote-drift-slow': 'quote-drift-slow 26s ease-in-out infinite',
        'rainbow-spin': 'rainbow-spin 3.5s linear infinite',
      },
      keyframes: {
        'quote-drift': {
          '0%, 100%': { transform: 'translateZ(0) scale(1)' },
          '50%': { transform: 'translate3d(-4%, -3%, 0) scale(1.08)' },
        },
        'quote-drift-slow': {
          '0%, 100%': { transform: 'translateZ(0) scale(1.05)' },
          '50%': { transform: 'translate3d(5%, 4%, 0) scale(0.95)' },
        },
        'rainbow-spin': {
          to: { '--rainbow-angle': '360deg' },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}