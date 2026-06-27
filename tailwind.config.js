const tokens = require('./tokens');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./pages/**/*.{js,jsx}', './components/**/*.{js,jsx}', './lib/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        bg: tokens.colors.bg,
        surface: tokens.colors.surface,
        border: tokens.colors.border,
        accent: tokens.colors.accent,
        'accent-2': tokens.colors.accent2,
        primary: tokens.colors.textPrimary,
        muted: tokens.colors.textMuted,
        wave: tokens.colors.waveDark,
        danger: tokens.colors.danger,
        success: tokens.colors.success,
        brand: {
          DEFAULT: tokens.colors.accent,
          ocean: tokens.colors.accent2,
          rose: tokens.colors.accent,
          sidebar: tokens.colors.surface,
          bg: tokens.colors.bg,
        },
      },
      fontFamily: {
        sans: tokens.typography.fontSans.split(', '),
      },
      spacing: tokens.spacing,
      boxShadow: {
        card: '0 24px 70px rgba(14, 165, 233, .14)',
      },
    },
  },
  plugins: [],
};
