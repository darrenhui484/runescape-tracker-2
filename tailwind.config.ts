// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        // Example: If you add Merriweather via Google Fonts or locally
        'custom-serif': ['Merriweather', 'Georgia', 'serif'],
      },
      colors: {
        // Define your parchment/ink colors here for consistency
        'parchment': {
          light: '#fdf5e6', // Lighter parchment
          DEFAULT: '#f5e5c6', // Main parchment
          dark: '#eaddc0',  // Darker shade
        },
        'ink': {
          DEFAULT: '#5a3d2b', // Dark brown for text
          light: '#7b5e48',
        },
        'border-dark': '#8B4513', // A dark brown for borders
      }
    },
  },
  plugins: [],
}