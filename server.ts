// https://github.com/vitejs/vite-plugin-vue/blob/main/playground/ssr-vue/server.js

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import express from 'express'
import { ViteDevServer } from 'vite'
import { SiteConfiguration } from './src/site'

const isTest = process.env.VITEST

export async function createServer(
  root = process.cwd(),
  isProd = process.env.NODE_ENV === 'production',
  hmrPort,
) {
  const __dirname = path.dirname(fileURLToPath(import.meta.url))
  const resolve = (p: string) => path.resolve(__dirname, p)

  const indexProd = isProd ? fs.readFileSync(resolve('dist/static/index.html'), 'utf-8') : ''

  const manifest = isProd
    ? JSON.parse(fs.readFileSync(resolve('dist/static/.vite/ssr-manifest.json'), 'utf-8'))
    : {}

  const app = express()

  /**
   * @type {import('vite').ViteDevServer}
   */
  let vite: ViteDevServer
  if (!isProd) {
    vite = await (
      await import('vite')
    ).createServer({
      base: '/',
      root,
      logLevel: isTest ? 'error' : 'info',
      server: {
        middlewareMode: true,
        watch: {
          // During tests we edit the files too fast and sometimes chokidar
          // misses change events, so enforce polling for consistency
          usePolling: true,
          interval: 100,
        },
        hmr: {
          port: hmrPort,
        },
      },
      appType: 'custom',
    })
    // use vite's connect instance as middleware
    app.use(vite.middlewares)
  } else {
    app.use((await import('compression')).default())
    app.use(
      '/',
      (await import('serve-static')).default(resolve('dist/static'), {
        index: false,
      }),
    )
  }

  app.use('*', async (req, res) => {
    try {
      const url = req.originalUrl

      let template, render
      if (!isProd) {
        // always read fresh template in dev
        template = fs.readFileSync(resolve('index.html'), 'utf-8')
        template = await vite.transformIndexHtml(url, template)
        render = (await vite.ssrLoadModule('/src/entry-server')).render
      } else {
        template = indexProd
        render = (await import('./dist/server/entry-server.js')).render
      }

      const [appHtml, preloadLinks, titlePrefix, meta] = await render(url, manifest)

      if (url === '/') {
        template = template.replace(
          `<!--title-prefix--> | <!--title-suffix-->`,
          `北京大学学生 Linux 俱乐部`,
        )
      }
      const html = template
        .replace(`<!--preload-links-->`, preloadLinks)
        .replace(`<!--app-html-->`, appHtml)
        .replace(`<!--title-prefix-->`, titlePrefix)
        .replace(`<!--meta-->`, meta)
        .replace(`<!--title-suffix-->`, SiteConfiguration.titleSuffix)

      res.status(200).set({ 'Content-Type': 'text/html' }).end(html)
    } catch (e) {
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      vite && vite.ssrFixStacktrace(e)
      console.log(e.stack)
      res.status(500).end(e.stack)
    }
  })
  // @ts-expect-error vite could be undefined in prod
  return { app, vite }
}

if (!isTest) {
  createServer(undefined, undefined, undefined).then(({ app }) =>
    app.listen(6173, () => {
      console.log('http://localhost:6173')
    }),
  )
}
