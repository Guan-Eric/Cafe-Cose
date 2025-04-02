/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx,ts,tsx}', './components/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        background: '#f7f5f1',
        primary: '#762e1f',
        text: '#1a1a1a',
        secondaryText: '#f8f9fa',
      },
    },
  },
  plugins: [],
};
