/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./popup.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        base: '#121212',
        'base-light': '#1E1E1E',
        'base-lighter': '#2A2A2A',
        ghost: '#E6EDF3',
        'ghost-dim': '#8B949E',
        'ghost-muted': '#6E7681',
        'neon-pink': '#FF10F0',
        'neon-pink-dim': '#FF10F033',
        'neon-purple': '#A855F7',
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      backdropBlur: {
        translucency: '5px',
      },
      animation: {
        'pulse-green': 'pulse-green 2s ease-in-out infinite',
        'glow-pink': 'glow-pink 2s ease-in-out infinite',
      },
      keyframes: {
        'pulse-green': {
          '0%, 100%': { opacity: '1', boxShadow: '0 0 8px #22c55e' },
          '50%': { opacity: '0.5', boxShadow: '0 0 16px #22c55e' },
        },
        'glow-pink': {
          '0%, 100%': { boxShadow: '0 0 8px #FF10F0' },
          '50%': { boxShadow: '0 0 20px #FF10F0, 0 0 30px #FF10F0' },
        },
      },
    },
  },
  plugins: [],
}