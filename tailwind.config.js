/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        arc: {
          dark: '#08090d',
          card: '#0f131a',
          cardHover: '#141a24',
          border: 'rgba(255, 255, 255, 0.08)',
          borderHover: 'rgba(56, 189, 248, 0.35)',
          blue: '#38bdf8',
          cyan: '#06b6d4',
          ice: '#bae6fd',
          orange: '#f97316',
          amber: '#fbbf24',
          green: '#10b981',
          red: '#f43f5e',
          purple: '#a855f7',
          muted: '#64748b',
          subtext: '#94a3b8',
        }
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'glow-cyan': '0 0 25px -5px rgba(56, 189, 248, 0.3)',
        'glow-amber': '0 0 25px -5px rgba(249, 115, 22, 0.3)',
        'card': '0 4px 20px -2px rgba(0, 0, 0, 0.5)',
      }
    },
  },
  plugins: [],
}
