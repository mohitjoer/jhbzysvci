/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f4f8',
          100: '#d9e2ec',
          200: '#bcccdc',
          300: '#9fb3c8',
          400: '#829ab1',
          500: '#627d98',
          600: '#486581',
          700: '#334e68',
          800: '#243b53',
          900: '#1e3a5f',
        },
        accent: {
          50: '#fff4ed',
          100: '#ffe8d0',
          200: '#ffd1a1',
          300: '#ffb068',
          400: '#ff8c36',
          500: '#e85d04',
          600: '#d14800',
          700: '#a83800',
          800: '#862e06',
          900: '#6c2607',
        },
        success: {
          50: '#f0f9f0',
          100: '#dcfce7',
          500: '#007b5e',
          600: '#16a34a',
        },
        danger: {
          50: '#fff0f0',
          100: '#fee2e2',
          500: '#c44000',
          600: '#dc2626',
        },
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
