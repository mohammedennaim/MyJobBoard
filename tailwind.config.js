/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Outfit"', 'sans-serif'],
      },
      colors: {
        primary: {
          50: '#effefc',
          100: '#cbfef8',
          200: '#9dfdf2',
          300: '#5df6ea',
          400: '#1ee3d4',
          500: '#03c6b6',
          600: '#00a095',
          700: '#058079',
          800: '#086561',
          900: '#0b5350',
          950: '#023232',
        },
        secondary: {
          50: '#fff1f2',
          100: '#ffe4e6',
          200: '#fecdd3',
          300: '#fda4af',
          400: '#fb7185',
          500: '#f43f5e',
          600: '#e11d48',
          700: '#be123c',
          800: '#9f1239',
          900: '#881337',
          950: '#4c0519',
        }
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(0, 0, 0, 0.05)',
        'glow': '0 0 15px rgba(3, 198, 182, 0.3)',
      }
    },
  },
  plugins: [],
}
