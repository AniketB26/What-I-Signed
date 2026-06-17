/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      colors: {
        cream: {
          50: '#fdfbf7',
          100: '#f9f3e8',
          200: '#f2e8d5',
          300: '#e8d9be',
          400: '#dcc8a3',
          500: '#c4a97a',
          600: '#a98c5c',
          700: '#8b6f42',
          800: '#6b5330',
          900: '#4a3920',
        },
        warm: {
          50: '#faf7f2',
          100: '#f5f0e8',
          200: '#ede4d4',
          300: '#e0d2bb',
          400: '#c4a97a',
          500: '#a0784c',
          600: '#8B6914',
          700: '#6B4E2A',
          800: '#4a3520',
          900: '#2D2017',
        },
        parchment: {
          DEFAULT: '#f5f0e8',
          light: '#faf7f2',
          dark: '#ede4d4',
        },
        surface: {
          DEFAULT: 'rgba(255, 255, 255, 0.8)',
          solid: '#ffffff',
        },
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        pulse: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        spin: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        typing: {
          '0%': { width: '0' },
          '100%': { width: '100%' },
        },
      },
      animation: {
        fadeIn: 'fadeIn 0.5s ease-out',
        slideUp: 'slideUp 0.5s ease-out',
        slideDown: 'slideDown 0.3s ease-out',
        scaleIn: 'scaleIn 0.3s ease-out',
        pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        shimmer: 'shimmer 2s linear infinite',
        spin: 'spin 1s linear infinite',
        float: 'float 3s ease-in-out infinite',
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
};
