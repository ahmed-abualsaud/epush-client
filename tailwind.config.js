const defaultTheme = require('tailwindcss/defaultTheme')

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    screens: {
      '2xs': '160px',
      'xs': '320px',
      ...defaultTheme.screens,
    },
    extend: {
      colors: {
        primary: {25: '#FFFBFA', 50: '#F7FDE8', 100: '#EEF9CE', 200: '#DCF4A2', 300: '#BFE85F', 400: '#ACDC3F', 600: '#6D9A16', 700: '#527615', 1000: '#063F30'},
        secondary: {800: '#085D45', 900: '#063F30', 1000: '#070020'},
        neutral: '#BFE85F',
        warn: {25: '#FFFCF5', 50: '#FFFAEB', 200: '#FEDF89', 600: '#DC6803', 700: '#B54708'},
        error: {25: '#FFFBFA', 50: '#FEF3F2', 100: "#FEE4E2", 300: '#FDA29B', 500: '#F04438', 600: "#D92D20", 700: '#B42318'},
        success: {25: '#F6FEF9', 50: '#ECFDF3', 100: '#D1FADF', 300: '#6CE9A6', 500: '#12B76A', 700: '#027A48'},
        gray: {25: '#FCFCFD'},
        blue: {
          light: {50: '#F0F9FF', 600: '#0086C9', 700: '#026AA2'}
        },
        orange: {
          dark: {50: '#FFF4ED', 500: '#EF6820', 700: '#B93815'}
        }
        // ... add more colors as you like
      },
      fontSize: {
        '2xs': '.6rem',
        '3xs': '.5rem',
      },
      fontFamily: {
        mono: ['Roboto Mono', 'monospace'],
      },
    }
  },
  plugins: [
    require('tailwind-scrollbar'),
  ]
};