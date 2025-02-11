// https://github.com/vitejs/vite-plugin-vue/blob/main/playground/ssr-vue/prerender.js

// Pre-render the app into static HTML.

import fs from 'node:fs'
import path from 'node:path'
import url from 'node:url'
import fg from 'fast-glob'
import { SiteConfiguration } from './src/site.js'

const __dirname = path.dirname(url.fileURLToPath(import.meta.url))

const toAbsolute = (p) => path.resolve(__dirname, p)

const manifest = JSON.parse(
  fs.readFileSync(toAbsolute('dist/static/.vite/ssr-manifest.json'), 'utf-8'),
)
const template = fs.readFileSync(toAbsolute('dist/static/index.html'), 'utf-8')
const { render } = await import('./dist/server/entry-server.js')

const routesToPrerender = ['/', '/404']

routesToPrerender.push(
  ...fg
    .sync('./src/data/*', { markDirectories: true, onlyDirectories: true })
    .map((p) => p.slice(10)),
)
routesToPrerender.push(...fg.sync('./content/*/*.md').map((p) => p.slice(9, -3)))

// pre-render each route...
for (const url of routesToPrerender) {
  const [appHtml, preloadLinks, titlePrefix, meta] = await render(url, manifest)

  const html = template
    .replace(`<!--preload-links-->`, preloadLinks)
    .replace(`<!--app-html-->`, appHtml)
    .replace(`<!--title-prefix-->`, titlePrefix)
    .replace(`<!--meta-->`, meta)
    .replace(`<!--title-suffix-->`, SiteConfiguration.titleSuffix)

  const filePath = `dist/static${url.endsWith('/') ? url + 'index' : url}/index.html`
  customWriteFileSync(toAbsolute(filePath), html)
  console.log('pre-rendered:', filePath)
}

// done, delete .vite directory including ssr manifest
// fs.rmSync(toAbsolute('dist/static/.vite'), { recursive: true })

function customWriteFileSync(filePath, content) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true })
  fs.writeFileSync(filePath, content)
}
