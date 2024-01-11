// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  ssr: false,
  modules: ["@nuxtjs/tailwindcss", "@pinia/nuxt", "@vueuse/nuxt"],
  app: {
    head: {
      viewport: "width=device-width, initial-scale=1, viewport-fit=cover", // https://github.com/saadeghi/daisyui/issues/1732
      title: "nanacount",
      meta: [
        { name: "description", content: "T**count but it's a webapp." },
        { name: "theme-color", content: "#747FFF" },
        { property: "og:type", content: "website" },
        { property: "og:site_name", content: "Japan7/nanacount" },
      ],
    },
  },
});
