/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // Isso é ESSENCIAL para React
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}

module.exports = {
  theme: {
    extend: {
      colors: {
        oceano: '#4c82c0',
      },
    },
  },
  content: [
    './src/**/*.{js,jsx,ts,tsx}', // Ajuste conforme seu projeto
  ],
};