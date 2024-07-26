// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  modules: [
    'vuetify-nuxt-module',
    'nuxt-mdi',
    '@nuxtjs/tailwindcss',
    "nuxt-graphql-request"
  ],
  graphql: {
    clients: {
      default: {
        endpoint: 'http://localhost/graphql',
        options: {
          mode: 'cors'
        }
      },
      user: {
        endpoint: 'http://localhost/graphql/user',
        options: {
          mode: 'cors'
        }
      },
      task: {
        endpoint: 'http://localhost/graphql/task',
        options: {
          mode: 'cors'
        }
      }
    },
    /**
     * Options
     * See: https://github.com/prisma-labs/graphql-request#passing-more-options-to-fetch
     */
    options: {
      method: 'get', // Default to `POST`
    },
  },
  app: {
    head: {
      title: 'Todo List'
    }
  }
})
