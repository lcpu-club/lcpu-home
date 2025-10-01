import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import UnoCSS from 'unocss/vite'
import PagesGenerator from './generator/pages-generator'
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
    PagesGenerator(),
    {
      name: 'markdown-full-reload',
      handleHotUpdate({ file, server }) {
        if (file.endsWith('.md')) {
          server.ws.send({
            type: 'full-reload',
            path: '*'
          })
          return []
        }
      }
    }
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    minify: 'esbuild',
    cssMinify: true,
  },
  /*experimental: {
    renderBuiltUrl(filename) {
      if (path.extname(filename).match(/\.(jpg|png|jpeg|bmp|gif|heic)$/i)) {
        return 'https://img.lcpu.dev/' + filename
      } else {
        return { relative: true }
      }
    },
  },*/
})
