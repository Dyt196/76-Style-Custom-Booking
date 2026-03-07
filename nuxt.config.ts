// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  runtimeConfig: {
    awsAccessKey: '',
    awsSecretKey: '',
    awsRegion: '',
    awsLogGroup: '',
    awsTraceStream: '',
    awsErrorStream: '',
    awsInforStream: '',
    public:{
      shortname: ''
    }
  },
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  css: ['~/style/main.css'],
  vite: {
    plugins: [tailwindcss()]
  },
  modules: [
    '@nuxt/eslint',
    '@nuxt/ui',
    '@nuxt/image',
    '@nuxt/scripts',
    '@nuxt/content',
    '@nuxtjs/i18n',
    '@pinia/nuxt'
  ],
  fonts: {
    families: [
      {
        name: 'Nunito',
        provider: 'google', // loads from Google Fonts
      },
    ],
  },
  ui:{ // In case have to add a new set such as 'tertiary'
    theme: {
      colors: [
        'primary',
        'secondary',
        'info',
        'success',
        'warning',
        'error',
        'accent',
        'shadow'
      ]
    }
  },
  i18n:{
    locales:[
      {
        code: 'en',
        name: 'English',
        file: 'en.json'
      },
      {
        code: 'ms',
        name: 'Melayu',
        file: 'ms.json'
      },
      {
        code: 'zn-CH',
        name: 'Simplified Chinese',
        file: 'zn-CH.json'
      } 
    ],
    langDir: "newLocales/",
    defaultLocale: 'en',
    strategy: 'no_prefix',
    detectBrowserLanguage: false
  },
  app: {
    baseURL: process.env.NUXT_BASE_URL || '/',
    head: {
      title: "Tunai App",
      htmlAttrs: {
        lang: 'en',
      },
      link: [
        // { rel: 'apple-touch-icon', sizes: '57x57', href: '/favicon/apple-icon-57x57.png' },
        // { rel: 'apple-touch-icon', sizes: '60x60', href: '/favicon/apple-icon-60x60.png' },
        // { rel: 'apple-touch-icon', sizes: '72x72', href: '/favicon/apple-icon-72x72.png' },
        // { rel: 'apple-touch-icon', sizes: '76x76', href: '/favicon/apple-icon-76x76.png' },
        // { rel: 'apple-touch-icon', sizes: '144x144', href: '/favicon/apple-icon-144x144.png' },
        // { rel: 'apple-touch-icon', sizes: '120x120', href: '/favicon/apple-icon-120x120.png' },
        // { rel: 'apple-touch-icon', sizes: '144x144', href: '/favicon/apple-icon-144x144.png' },
        // { rel: 'apple-touch-icon', sizes: '152x152', href: '/favicon/apple-icon-152x152.png' },
        // { rel: 'apple-touch-icon', sizes: '180x180', href: '/favicon/apple-icon-180x180.png' },
        // { rel: 'icon', type: 'image/png', sizes: '192x192', href: '/favicon/android-icon-192x192.png' },
        // { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon/favicon-32x32.png' },
        // { rel: 'icon', type: 'image/png', sizes: '96x96', href: '/favicon/favicon-96x96.png' },
        // { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon/favicon-16x16.png' }
      ]
    }
  },
  devServer: {
    port: 8080,
    host: '0.0.0.0'
  }
})