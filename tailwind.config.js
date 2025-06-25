/** @type {import('tailwindcss').Config} */
export default {
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
      height: {
        'large': '20rem',
        'half-screen': '50vh',
      },
    },
  },
  plugins: [],
}

