/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./pages/**/*.{js,jsx}', './components/**/*.{js,jsx}', './lib/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#2ecc71',
          ocean: '#2ecc71',
          rose: '#ff6b6b',
          sidebar: '#ffffff',
          bg: '#f7f2e9',
        },
        danger: '#b42318',
        success: '#147a43',
      },
      boxShadow: {
        card: '0 24px 70px rgba(46, 204, 113, .10)',
      },
    },
  },
  plugins: [],
};
