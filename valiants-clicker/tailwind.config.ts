import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'home-hero': "url('/images/home.png')",
        'bg-school': "url('/images/test.png')",
        bg1: "url('/images/bg1.png')",
        'bg-add-valiant': "url('/valiants/placeholders/bg-add-valiant.png')",
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      colors: {
        'custom-blue': '#0D082C',
      },
      fontFamily: {
        sans: ['var(--font-open-sans)'],
        fugaz: ['var(--font-fugaz-one)'],
      },
    },
  },
  plugins: [],
}
export default config
