const { bold } = require('tailwindcss/lib/util/body');

module.exports = {
  content: [
    './src/app/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
    './src/pages/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1D4ED8', // Blue for primary actions
        secondary: '#3B82F6', // Lighter blue for secondary actions
        accent: '#FBBF24', // Yellow for highlights
        background: '#F9FAFB', // Light background color
        text: '#3B3B3B', // Dark text color for readability
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'], // Primary font
      },
      fontSize: {
        'xxs': '0.625rem', // Extra small text for labels
        'xxl': '1.5rem', // Extra large text for headings
      },
    },
  },
  plugins: [],
}