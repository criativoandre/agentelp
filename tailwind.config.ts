import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: '#534AB7',
        page: '#f5f5f0',
        panel: '#ffffff',
        soft: '#fafaf7',
        borderSoft: '#e8e5dc',
        ink: '#1a1a1a',
        muted: '#888888',
        bot: '#EEEDFE',
        badgeBg: '#EAF3DE',
        badgeText: '#3B6D11'
      },
      boxShadow: {
        card: '0 4px 24px rgba(0,0,0,.07)'
      }
    }
  },
  plugins: []
} satisfies Config
