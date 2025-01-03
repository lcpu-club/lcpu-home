import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import UnoCSS from 'unocss/vite'
import PageListGenerator from './generator/page-list-generator'
import MarkdownContentGenerator from './generator/content-generator'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    MarkdownContentGenerator(),
    vue({
      include: [/\.vue$/, /\.md$/],
      template: {
        compilerOptions: {
          // mathjax containers
          isCustomElement: (tag) => tag.startsWith('mjx-'),
        },
      },
    }),
    vueDevTools(),
    UnoCSS(),
    PageListGenerator(['activities', 'news', 'announcements']),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
