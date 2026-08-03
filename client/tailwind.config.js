/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['"Playfair Display"', 'Georgia', 'Cambria', 'serif'],
      },
      colors: {
        /* Backdrop taupe — the surface the glass sits on */
        mocha: {
          50: '#faf6ef',
          100: '#f3ebdd',
          200: '#e7dac3',
          300: '#d9c7a9',
          400: '#c9b79c',
          500: '#b9a184',
          600: '#9c8467',
          700: '#7d684f',
          800: '#5c4c3a',
          900: '#3b3126',
        },
        /* Muted bronze accent used for pills, "Ask", highlights */
        gold: {
          50: '#fbf6ec',
          100: '#f5e9d2',
          200: '#e9d3a8',
          300: '#d9b878',
          400: '#c69c50',
          500: '#b08748',
          600: '#946e3a',
          700: '#77572f',
          800: '#5b4325',
          900: '#3e2e1a',
        },
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
        sheen: {
          '0%': { transform: 'translateX(-120%) skewX(-18deg)' },
          '100%': { transform: 'translateX(320%) skewX(-18deg)' },
        },
        driftSlow: {
          '0%, 100%': { transform: 'translate3d(0,0,0) scale(1)' },
          '50%': { transform: 'translate3d(2%, -3%, 0) scale(1.06)' },
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
        sheen: 'sheen 1.4s ease-out',
        driftSlow: 'driftSlow 24s ease-in-out infinite',
      },
      backdropBlur: {
        xs: '2px',
        '2.5xl': '30px',
        '4xl': '48px',
      },
      boxShadow: {
        glass:
          'inset 0 1px 0 0 rgba(255,255,255,0.70), 0 18px 40px -20px rgba(59,49,38,0.35), 0 2px 8px -3px rgba(59,49,38,0.12)',
        'glass-lg':
          'inset 0 1px 0 0 rgba(255,255,255,0.75), 0 34px 70px -28px rgba(59,49,38,0.45), 0 6px 18px -8px rgba(59,49,38,0.18)',
        'glass-sm':
          'inset 0 1px 0 0 rgba(255,255,255,0.65), 0 8px 20px -12px rgba(59,49,38,0.30)',
        'glass-inset':
          'inset 0 2px 10px -2px rgba(59,49,38,0.14), inset 0 -1px 0 0 rgba(255,255,255,0.55)',
      },
    },
  },
  plugins: [],
};
