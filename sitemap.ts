import { SitemapStream, streamToPromise } from 'sitemap'
import { Readable } from 'stream'
import fg from 'fast-glob'
import { dirname } from 'path'
import fs from 'fs'
import { RouteTitleRecord } from './src/site'
import { generatePages } from './generator/pages-generator'
import chalk from 'chalk'

const links = []

const publishedPages = generatePages()
const pages = publishedPages
  .filter((page) => !page.redirect)
  .map((page) => ({
    url: page.contentUrl,
    lastmod: page.time || undefined,
    changefreq: 'monthly',
    priority: 0.5,
  }))

const pagesVue = fg.sync(`./content/**/index.vue`).map((file) => {
  const dir = dirname(file).split('/')
  return {
    url: `/${dir.slice(2).join('/')}/`,
    lastmod: new Date(),
    changefreq: 'monthly',
    priority: 0.5,
  }
})

links.push(...pages, ...pagesVue)

const categories: { [key: string]: Date } = {}
for (const category of Object.keys(RouteTitleRecord)) {
  const times = publishedPages
    .filter((page) => page.category === category)
    .map((page) => Date.parse(page.time))
    .filter(Number.isFinite)
  categories[category] = new Date(times.length ? Math.max(...times) : Date.now())
}

for (const category of Object.keys(RouteTitleRecord)) {
  links.push({
    url: `/${category}/`,
    changefreq: 'daily',
    priority: 0.8,
    lastmod: categories[category].toISOString(),
  })
}

links.push({
  url: `/tags/`,
  changefreq: 'daily',
  priority: 0.8,
  lastmod: new Date(),
})

console.log(chalk.bgYellow.greenBright('Sitemap:'))
console.log(links.map((x) => x.url).join('\n'))
const stream = new SitemapStream({ hostname: 'https://lcpu.dev/' })
const buffer = await streamToPromise(Readable.from(links).pipe(stream))
const sitemap = buffer.toString()

fs.writeFileSync('./dist/static/sitemap.xml', sitemap)
