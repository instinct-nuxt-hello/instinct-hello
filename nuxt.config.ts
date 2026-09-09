export default defineNuxtConfig({
  ssr: true,
  modules: ['@nuxtjs/tailwindcss'],
  runtimeConfig: {
    dbHost: '',
    dbPort: '4000',
    dbUser: '',
    dbPassword: '',
    dbName: 'taskdb'
  },
  app: {
    head: {
      title: 'Instinct Tasks',
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'A clean, fast task manager.' }
      ]
    }
  }
})
