// https://github.com/vitejs/vite-plugin-vue/blob/main/playground/ssr-vue/prerender.js

// Pre-render the app into static HTML.

import fs from 'node:fs'
import path from 'node:path'
import url from 'node:url'
import fg from 'fast-glob'
import { SiteConfiguration } from './src/site.js'
import gm from 'gray-matter'

const __dirname = path.dirname(url.fileURLToPath(import.meta.url))

const toAbsolute = (p) => path.resolve(__dirname, p)

const manifest = JSON.parse(
  fs.readFileSync(toAbsolute('dist/static/.vite/ssr-manifest.json'), 'utf-8'),
)
const template = fs.readFileSync(toAbsolute('dist/static/index.html'), 'utf-8')
const { render } = await import('./dist/server/entry-server.js')

const routesToPrerender = ['/', '/404.html', '/about/']

routesToPrerender.push(
  ...fg
    .sync('./content/*', { markDirectories: true, onlyDirectories: true })
    .map((p) => p.slice(9)),
)
routesToPrerender.push(
  ...fg.sync('./content/*/*/index.md').map((file) => {
    const dir = path.dirname(file).split("/")
    const frontmatter = gm(fs.readFileSync(file, 'utf-8')).data
    if (frontmatter.slug) {
      return `/${dir[2]}/${frontmatter.slug}/`
    }
    return `/${dir.slice(2,4).join("/")}/`
  }),
)

// pre-render each route...
for (const url of routesToPrerender) {
  const [appHtml, preloadLinks, titlePrefix, meta] = await render(url, manifest)
  let html = template
  if (url === '/') {
    html = template.replace(
      `<!--title-prefix--> | <!--title-suffix-->`,
      `北京大学学生 Linux 俱乐部`,
    )
  }
  html = html
    .replace(`<!--preload-links-->`, preloadLinks)
    .replace(`<!--app-html-->`, appHtml)
    .replace(`<!--title-prefix-->`, titlePrefix)
    .replace(`<!--meta-->`, meta)
    .replace(`<!--title-suffix-->`, SiteConfiguration.titleSuffix)

  const filePath = `dist/static${url.endsWith('/') ? url + 'index.html' : url}`
  customWriteFileSync(toAbsolute(filePath), html)
  console.log('pre-rendered:', filePath)
}

// done, delete .vite directory including ssr manifest
fs.rmSync(toAbsolute('dist/static/.vite'), { recursive: true })

function customWriteFileSync(filePath, content) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true })
  fs.writeFileSync(filePath, content)
}
