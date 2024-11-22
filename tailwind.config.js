/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      screens: {
        'md': '1051px',
        '3xl': '1920px',
      },
      backgroundImage: {
        'brand-gradient': 'linear-gradient(150deg, #2b2e4a, #3e345e, #57386e, #723b78, #903c7a, #af3d73, #cd3f63, #e84545)',
      },
    },
  },
  plugins: [],
};