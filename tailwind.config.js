/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'industrial-dark': '#1a1a1a',
        'industrial-gray': '#4a5568',
        'safety-orange': '#f97316',
        'brand-navy': '#020617', // Dark navy from logo
        'brand-teal': '#0e7490', // Teal from logo
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        heading: ['Oswald', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
