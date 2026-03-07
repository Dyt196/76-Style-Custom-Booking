export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.hook('app:suspense:resolve', () => {
    getMerchantToken(useRuntimeConfig().public.shortname as string)
  })
})
