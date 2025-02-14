import { PluginOption } from 'vite'
import fg from 'fast-glob'
import matter from 'gray-matter'
import type { PageData } from '../src/data/pagedata'
import { dirname } from 'node:path'

export default function pageListGenerator(routeBase: string[]): PluginOption {
  const virtualModuleId = 'virtual:category-list.json'
  const resolvedVirtualModuleId = '\0' + virtualModuleId

  return {
    name: 'category-list-generator',
    resolveId(id) {
      if (id === virtualModuleId) {
        return resolvedVirtualModuleId
      }
    },
    load(id) {
      if (id === resolvedVirtualModuleId) {
        const result: { routeBase: string; pages: PageData[] }[] = []
        for (const base of routeBase) {
          result.push({
            routeBase: base,
            pages: fg
              .sync(`./content/${base}/*/index.md`)
              .map((entry) => {
                return { entry, frontmatter: matter.read(entry, { excerpt: true }) }
              })
              .map((file): PageData | undefined => {
                const { entry, frontmatter } = file
                if (frontmatter.data.hidden) return undefined
                const dir = dirname(entry).split("/")
                const filename = dir[dir.length - 1]
                const data = frontmatter.data
                const time = data.time
                const title = data.title
                const meta = data.meta
                const slug = data.slug || filename
                delete data.time
                delete data.title
                delete data.meta
                delete data.slug
                return {
                  title,
                  time,
                  data,
                  meta,
                  excerpt: frontmatter.excerpt,
                  contentUrl: `/${base}/${slug}/`,
                  sourceUrl: `/${base}/${filename}/index.md`,
                }
              })
              .filter((page) => page !== undefined)
              .sort((a, b) => Date.parse(b.time) - Date.parse(a.time)),
          })
        }
        return JSON.stringify(result)
      }
    },
    handleHotUpdate({ server, file }) {
      if (file.includes('src/data/') || file.includes('content/')) {
        const thisModule = server.moduleGraph.getModuleById(resolvedVirtualModuleId)
        if (thisModule) return [thisModule]
      }
    },
  }
}
