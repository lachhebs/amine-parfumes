/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  safelist: [
    'lg:ml-[240px]',
    'lg:translate-x-0',
    '-translate-x-full',
    'translate-x-0',
    'group-hover:opacity-100',
    'group-hover:w-full',
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          100: '#f7ecc8',
          200: '#efd48e',
          300: '#ddb84e',
          400: '#c9a227',
          500: '#a8821d',
          600: '#856118',
          700: '#5a3e0d',
        },
        obsidian: {
          900: '#080b14',
          800: '#0d1120',
          700: '#121829',
        },
        ivory: '#f0ead8',
      },
      fontFamily: {
        display: ['Cormorant Garamond', 'serif'],
        body:    ['Jost', 'sans-serif'],
        arabic:  ['Amiri', 'serif'],
      },
    },
  },
  plugins: [],
};
