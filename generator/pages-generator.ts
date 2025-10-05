import { PluginOption } from 'vite'
import fg from 'fast-glob'
import matter from 'gray-matter'
import type { PageData } from '../src/data/pagedata'
import { dirname } from 'node:path'
import { RouteTitleRecord } from '../src/site'

export function generatePages() {
  return fg
    .sync(`./content/**/index.md`)
    .map((entry) => {
      return { entry, frontmatter: matter.read(entry) }
    })
    .map((file): PageData | undefined => {
      const { entry, frontmatter } = file
      if (frontmatter.data.hidden) return undefined
      const path = dirname(entry).slice(10)
      const slugs = path.split('/').filter((slug) => slug)
      const data = frontmatter.data
      const time = data.time
      const title = data.title
      const meta = data.meta
      const slug = data.slug || path
      const tags = data.tags
      const category = (slugs[0] in RouteTitleRecord && slugs[0]) || undefined
      delete data.time
      delete data.title
      delete data.meta
      delete data.slug
      delete data.tags
      return {
        title,
        time,
        data,
        meta,
        category,
        excerpt: frontmatter.data.excerpt,
        contentUrl: `/${slug}/`,
        sourceUrl: `/${path}/index.md`,
        tags,
      }
    })
    .filter((page) => page !== undefined)
}

export default function pagesGenerator(): PluginOption {
  const virtualModuleId = 'virtual:pages.json'
  const resolvedVirtualModuleId = '\0' + virtualModuleId

  return {
    name: 'pages-generator',
    resolveId(id) {
      if (id === virtualModuleId) {
        return resolvedVirtualModuleId
      }
    },
    load(id) {
      if (id === resolvedVirtualModuleId) {
        return JSON.stringify(generatePages())
      }
    },
    handleHotUpdate({ server, file }) {
      if (file.includes('content/')) {
        const thisModule = server.moduleGraph.getModuleById(resolvedVirtualModuleId)
        if (thisModule) return [thisModule]
      }
    },
  }
}
