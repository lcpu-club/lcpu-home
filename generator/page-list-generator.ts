import { PluginOption } from 'vite'
import fg from 'fast-glob'
import matter from 'gray-matter'
import type { PageData } from '../src/data/pagedata'
import path from 'node:path'

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
              .sync(`./src/data/${base}/*.md`)
              .map((entry) => {
                return { entry, frontmatter: matter.read(entry, { excerpt: true }) }
              })
              .map((file): PageData | undefined => {
                const { entry, frontmatter } = file
                if (frontmatter.data.hidden) return undefined
                const filename = path.parse(entry).name
                const data = frontmatter.data
                const time = data.time
                const title = data.title
                const meta = data.meta
                delete data.time
                delete data.title
                delete data.meta
                return {
                  title,
                  time,
                  data,
                  meta,
                  excerpt: frontmatter.excerpt,
                  contentUrl: `/${base}/${filename}.html`,
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
      if (file.includes('src/data/')) {
        const thisModule = server.moduleGraph.getModuleById(resolvedVirtualModuleId)
        if (thisModule) return [thisModule]
      }
    },
  }
}
