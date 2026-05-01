/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./popup.html",
    "./dashboard.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'tac-black': '#0C0C0C',
        'tac-dark': '#121212',
        'tac-panel': '#1A1A1A',
        'tac-border': '#333333',
        'tac-magenta': '#FF00FF',
        'tac-yellow': '#FFD700',
        'tac-green': '#00FF41',
        'tac-white': '#E6E6E6',
        'tac-gray': '#888888',
        'tac-dim': '#666666',
        'tac-red': '#FF4444',
        'tac-amber': '#FFAA00',
        'tac-light-bg': '#F5F5F5',
        'tac-light-panel': '#FFFFFF',
        'tac-light-border': '#E0E0E0',
        'tac-light-text': '#1A1A1A',
        'tac-light-dim': '#666666',
        'tac-light-magenta': '#CC00CC',
        'tac-light-green': '#00AA2B',
        'tac-light-yellow': '#CC9900',
        'base': '#121212',
        'base-light': '#1E1E1E',
        'base-lighter': '#2A2A2A',
        'ghost': '#E6EDF3',
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
        'pulse-yellow': 'pulse-yellow 2s ease-in-out infinite',
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
        'pulse-yellow': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
      },
    },
  },
  plugins: [],
}