// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  modules: [
    '@nuxtjs/google-fonts',
    '@nuxtjs/tailwindcss',
    'shadcn-nuxt',
    '@nuxtjs/supabase',
  ],
  ssr: false,
  googleFonts: {
    display: 'swap',
    families: {
      Inter: [400, 500, 600, 700],
    },
  },
  css: ['~/assets/css/base.css'],
})
