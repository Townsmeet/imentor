// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  css: ['~/assets/css/main.css'],

  modules: [
    '@nuxt/eslint',
    '@nuxt/image',
    '@nuxt/scripts',
    '@nuxt/test-utils',
    '@nuxt/ui',
    'nuxt-charts'
  ],

  runtimeConfig: {
    brevoApiKey: process.env.NUXT_BREVO_API_KEY,
    betterAuthSecret: process.env.NUXT_BETTER_AUTH_SECRET,
    openrouterApiKey: process.env.NUXT_OPENROUTER_API_KEY,
    public: {
      betterAuthUrl: process.env.NUXT_BETTER_AUTH_URL || 'http://localhost:3000',
      stripePublishableKey: process.env.NUXT_STRIPE_PUBLISHABLE_KEY,
    },
  },
})