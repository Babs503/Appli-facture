/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        bsm: {
          orange:      '#F58220',
          'orange-dark': '#d96f12',
          navy:        '#0B2545',
          'navy-light': '#13315C',
        },
      },
    },
  },
  plugins: [],
};
