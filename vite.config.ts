import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import UnoCSS from 'unocss/vite'
import ActivityListGenerator from './generator/activity-list-generator'
import NewsListGenerator from './generator/news-list-generator copy'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), vueDevTools(), UnoCSS(), ActivityListGenerator(), NewsListGenerator()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
