const colors = require('tailwindcss/colors');

module.exports = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
    "./src/pages/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: colors.blue[600],
        secondary: colors.green[600],
        accent: colors.pink[600],
        neutral: colors.gray[600],
        'base-100': colors.white,
        info: colors.blue[400],
        success: colors.green[400],
        warning: colors.yellow[400],
        error: colors.red[400],
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['Merriweather', 'serif'],
      },
      spacing: {
        '128': '32rem',
        '144': '36rem',
      },
    },
  },
  plugins: [],
};