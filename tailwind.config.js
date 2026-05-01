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
        'base-dark': '#0C0C0C',
        'base-light': '#1E1E1E',
        'base-lighter': '#2A2A2A',
        'base-border': '#333333',
        ghost: '#E6EDF3',
        'ghost-dim': '#8B949E',
        'ghost-muted': '#6E7681',
        'ghost-meta': '#888888',
        'neon-pink': '#FF00FF',
        'neon-pink-dim': '#FF00FF33',
        'neon-purple': '#A855F7',
        'cyber-yellow': '#FFD700',
        'active-green': '#00FF41',
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      borderRadius: {
        none: '0px',
      },
      animation: {
        'pulse-green': 'pulse-green 2s ease-in-out infinite',
        'glow-pink': 'glow-pink 2s ease-in-out infinite',
      },
      keyframes: {
        'pulse-green': {
          '0%, 100%': { opacity: '1', boxShadow: '0 0 8px #00FF41' },
          '50%': { opacity: '0.5', boxShadow: '0 0 16px #00FF41' },
        },
        'glow-pink': {
          '0%, 100%': { boxShadow: '0 0 8px #FF00FF' },
          '50%': { boxShadow: '0 0 20px #FF00FF, 0 0 30px #FF00FF' },
        },
      },
    },
  },
  plugins: [],
}