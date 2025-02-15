import { SitemapStream, streamToPromise } from 'sitemap'
import { Readable } from 'stream'
import fg from 'fast-glob'
import matter from 'gray-matter'
import { dirname } from 'path'
import fs from 'fs'
import { RouteTitleRecord } from './src/site.ts'

const links = []

const pages = fg
  .sync(`./content/**/index.md`)
  .map((entry) => {
    return { entry, frontmatter: matter.read(entry) }
  })
  .map((file) => {
    const { entry, frontmatter } = file
    if (frontmatter.data.hidden) return undefined
    const dir = dirname(entry).split('/')
    return {
      url: `/${dir.slice(2)}/`,
      lastmod: frontmatter.data.time,
      changefreq: 'monthly',
      priority: 0.5,
    }
  })
  .filter((page) => page !== undefined)
  .sort((a, b) => new Date(b.lastmod).getTime() - new Date(a.lastmod).getTime())
links.push(...pages)

const categories : {[key: string]: Date;} = {}
for (const category of Object.keys(RouteTitleRecord)) {
  categories[category] = fg
    .sync(`./content/${category}/*/index.md`)
    .map((entry) => {
      return matter.read(entry).data.time || new Date()
    })
    .filter((page) => page !== undefined)
    .sort((a, b) => Date.parse(b) - Date.parse(a))[0]
}

for (const category of Object.keys(RouteTitleRecord)) {
  links.push({
    url: `/${category}/`,
    changefreq: 'daily',
    priority: 0.8,
    lastmod: categories[category].toISOString(),
  })
}

const stream = new SitemapStream({ hostname: 'https://lcpu.dev/' })
const buffer = await streamToPromise(Readable.from(links).pipe(stream))
const sitemap = buffer.toString()

fs.writeFileSync('./dist/static/sitemap.xml', sitemap)
