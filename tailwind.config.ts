import type { Config } from 'tailwindcss'

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {

    extend: {
      colors: {
        dark: {
          DEFAULT: '#0f172a',
          light: '#1e293b',
          lighter: '#334155'
        }
      }
    },
  },
  plugins: [],
  
} satisfies Config