import { SitemapStream, streamToPromise } from 'sitemap'
import { Readable } from 'stream'
import fg from 'fast-glob'
import matter from 'gray-matter'
import path from 'path'
import fs from 'fs/promises'

const activities = fg
  .sync('./src/data/activities/*.md')
  .map((entry) => {
    return { entry, frontmatter: matter.read(entry) }
  })
  .map((file) => {
    const { entry, frontmatter } = file
    const filename = path.parse(entry).name
    return {
      url: `/news/${filename}`,
      lastmod: frontmatter.data.time,
      changefreq: 'monthly',
      priority: 0.5,
    }
  })
  .sort((a, b) => new Date(b.lastmod).getTime() - new Date(a.lastmod).getTime())

const news = fg
  .sync('./src/data/news/*.md')
  .map((entry) => {
    return { entry, frontmatter: matter.read(entry) }
  })
  .map((file) => {
    const { entry, frontmatter } = file
    const filename = path.parse(entry).name
    return {
      url: `/news/${filename}`,
      lastmod: frontmatter.data.time,
      changefreq: 'monthly',
      priority: 0.5,
    }
  })
  .sort((a, b) => new Date(b.lastmod).getTime() - new Date(a.lastmod).getTime())

const links = [
  { url: '/', changefreq: 'daily', priority: 1, lastmod: new Date().toISOString() },
  {
    url: '/activities/',
    changefreq: 'daily',
    priority: 0.8,
    lastmod:
      activities.length > 0
        ? new Date(activities[0].lastmod).toISOString()
        : new Date().toISOString(),
  },
  {
    url: '/news/',
    changefreq: 'daily',
    priority: 0.8,
    lastmod: news.length > 0 ? new Date(news[0].lastmod).toISOString() : new Date().toISOString(),
  },
]

links.push(...activities, ...news)

const stream = new SitemapStream({ hostname: 'https://lcpu-home.pages.dev' })
const buffer = await streamToPromise(Readable.from(links).pipe(stream))
const sitemap = buffer.toString()

await fs.writeFile('./dist/sitemap.xml', sitemap)
