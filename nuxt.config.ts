// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ["@nuxtjs/tailwindcss"],
  app: {
    head: {
      viewport: "width=device-width, initial-scale=1, viewport-fit=cover", // https://github.com/saadeghi/daisyui/issues/1732
    },
  },
});
