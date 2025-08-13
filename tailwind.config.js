/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx,ts,tsx}', './components/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        primary: '#762E1F', // Logo, main CTAs
        background: '#F7F5F1', // Screen background
        card: '#F7F5F1', // Cards / panels
        text: '#3C2A20', // Main text
        offwhite: '#F8F8F8', // Off white text
        subtext: '#776759', // Secondary text / placeholder
      },
      fontFamily: {
        sans: ['HALTimezoneTest', 'sans-serif'],
        sansItalic: ['HALTimezoneTestItalic', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
