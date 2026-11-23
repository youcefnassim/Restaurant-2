/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#E76F35',
          hover: '#D45D25',
          light: '#FDF1EB',
          50: '#FDF7F4',
          100: '#FCECE6',
          200: '#F9D9CC',
          500: '#E76F35',
          600: '#D45D25',
          700: '#B84717',
        },
        secondary: {
          DEFAULT: '#222222',
          light: '#333333',
        },
        surface: '#FFFFFF',
        bg: '#FAF9F6',
        text: {
          main: '#242424',
          muted: '#737373',
          light: '#A3A3A3',
        },
        success: '#16A36A',
        danger: '#DC4545',
        warning: '#F59E0B',
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'sans-serif'],
        arabic: ['Cairo', 'Tajawal', 'sans-serif'],
      },
      boxShadow: {
        'subtle': '0 2px 10px rgba(0, 0, 0, 0.04)',
        'card': '0 4px 20px -2px rgba(0, 0, 0, 0.06)',
        'dropdown': '0 10px 30px -4px rgba(0, 0, 0, 0.1)',
        'modal': '0 20px 40px -10px rgba(0, 0, 0, 0.2)',
      },
      borderRadius: {
        'xl': '0.875rem',
        '2xl': '1.25rem',
      }
    },
  },
  plugins: [],
}
