// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  ssr: false,
  compatibilityDate: '2024-11-01',
  app: {
    head: {
      link: [
        { rel: 'icon', type: 'image/png', href: '/icon.png' }
      ]
    }
  },
  devtools: { enabled: true },
  modules: ['@vite-pwa/nuxt'],
  css: ['@/assets/css/main.css'],
  vite: {
    plugins: [tailwindcss()],
  },
  pwa: {
    manifest: {
      name: 'Reminder PRO',
      short_name: 'Reminder',
      description: 'Premium Reminder App with Flexible Extensions',
      theme_color: '#4f46e5',
      icons: [
        {
          src: '/icon.png',
          sizes: '512x512',
          type: 'image/png'
        }
      ]
    },
    workbox: {
      navigateFallback: '/'
    },
    devOptions: {
      enabled: true,
      type: 'module'
    }
  },
  future: {
    compatibilityVersion: 4,
  }
})
