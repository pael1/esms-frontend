/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./app.vue",
    "./error.vue",
    './node_modules/@headlessui/vue/**/*.{js,ts}',
  ],
  theme: {
    extend: {
      colors: {
        nuxt: '#00DC82',
        'nuxt-dark': '#00C76F',
        'nuxt-bg': '#003F2E',
      },
      height: {
        'large': '20rem',
        'half-screen': '50vh',
      },
    },
  },
  plugins: [],
}

