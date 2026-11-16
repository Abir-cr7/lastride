/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        asphalt: {
          950: '#080B12',
          900: '#0D111A',
          850: '#121824',
          800: '#171F2F',
          700: '#232D42',
        },
        amber: {
          glow: '#F59E0B',
          400: '#FBBF24',
          500: '#F59E0B',
          600: '#D97706',
        },
        cyan: {
          glow: '#06B6D4',
          400: '#22D3EE',
          500: '#06B6D4',
          600: '#0891B2',
        },
        crimson: {
          glow: '#EF4444',
          400: '#F87171',
          500: '#EF4444',
          600: '#DC2626',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        'glow-amber': '0 0 25px -5px rgba(245, 158, 11, 0.4)',
        'glow-cyan': '0 0 25px -5px rgba(6, 182, 212, 0.4)',
        'glow-crimson': '0 0 25px -5px rgba(239, 68, 68, 0.4)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
      },
      keyframes: {
        radar: {
          '0%': { transform: 'scale(1)', opacity: '0.8' },
          '100%': { transform: 'scale(2.4)', opacity: '0' },
        },
        speedline: {
          '0%': { transform: 'translateX(100%)', opacity: '0' },
          '50%': { opacity: '0.8' },
          '100%': { transform: 'translateX(-100%)', opacity: '0' },
        },
        beamPulse: {
          '0%, 100%': { opacity: '0.45' },
          '50%': { opacity: '0.75' },
        },
      },
      animation: {
        'radar-slow': 'radar 2.5s cubic-bezier(0, 0.2, 0.8, 1) infinite',
        'radar-fast': 'radar 1.5s cubic-bezier(0, 0.2, 0.8, 1) infinite',
        'speedline': 'speedline 1.2s linear infinite',
        'beam': 'beamPulse 2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
