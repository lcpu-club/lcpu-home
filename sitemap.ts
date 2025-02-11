import { SitemapStream, streamToPromise } from 'sitemap'
import { Readable } from 'stream'
import fg from 'fast-glob'
import matter from 'gray-matter'
import path from 'path'
import fs from 'fs'

const categories = ['news', 'announcements']
const links = []
for (const category of categories) {
  const pages = fg
    .sync(`./src/data/${category}/*.md`)
    .map((entry) => {
      return { entry, frontmatter: matter.read(entry) }
    })
    .map((file) => {
      const { entry, frontmatter } = file
      if (frontmatter.data.hidden) return undefined
      const filename = path.parse(entry).name
      return {
        url: `/${category}/${filename}.html`,
        lastmod: frontmatter.data.time,
        changefreq: 'monthly',
        priority: 0.5,
      }
    })
    .filter((page) => page !== undefined)
    .sort((a, b) => new Date(b.lastmod).getTime() - new Date(a.lastmod).getTime())
  links.push(...pages)
  links.push({
    url: `/${category}/`,
    changefreq: 'daily',
    priority: 0.8,
    lastmod: pages.length > 0 ? new Date(pages[0].lastmod).toISOString() : new Date().toISOString(),
  })
}

links.push({ url: '/', changefreq: 'daily', priority: 0.8, lastmod: new Date().toISOString() })
links.push({
  url: '/contact/about.html',
  changefreq: 'monthly',
  priority: 0.5,
  lastmod: new Date().toISOString(),
})

const stream = new SitemapStream({ hostname: 'https://lcpu.dev' })
const buffer = await streamToPromise(Readable.from(links).pipe(stream))
const sitemap = buffer.toString()

fs.writeFileSync('./dist/static/sitemap.xml', sitemap)
