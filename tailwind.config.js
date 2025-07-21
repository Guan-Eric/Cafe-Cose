/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx,ts,tsx}', './components/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        background: '#F6F0E8',
        primary: '#762e1f',
        text: '#1a1a1a',
        secondaryText: '#f8f9fa',
        input: '#e5e5e5',
        cards: '#f1e3d1',
      },
    },
  },
  plugins: [],
};
