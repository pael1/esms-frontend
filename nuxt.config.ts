// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },

  modules: [
    '@nuxtjs/color-mode',
    '@pinia/nuxt',
    '@pinia-plugin-persistedstate/nuxt',
  ],

  colorMode: {
    classSuffix: '',
  },

  css: ['~/assets/css/main.css'],

  plugins: [
    // '@/plugins/vue-notification.ts',
  ],

  runtimeConfig: {
    public: {
      apiBaseURL: process.env.API_BASE_URL,
      appName: process.env.APP_NAME,
      apiPublicStorage: process.env.API_PUBLIC_STORAGE
    }
  },

  ssr: false,

  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },

  compatibilityDate: '2025-01-15',
})