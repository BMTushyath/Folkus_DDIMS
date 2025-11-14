/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'brand-primary': '#4F46E5',
        'brand-secondary': '#7C3AED',
        'brand-light': '#A5B4FC',
        'brand-dark': '#312E81',
        'background-primary': '#111827',
        'background-secondary': '#1F2937',
        'text-primary': '#F9FAFB',
        'text-secondary': '#9CA3AF',
      },
    }
  },
  plugins: [],
}
