import { PluginOption } from 'vite'
import fg from 'fast-glob'
import matter from 'gray-matter'
import type { PageData } from '../src/data/pagedata'
import path from 'node:path'

export default function newsListGenerator(): PluginOption {
  const virtualModuleId = 'virtual:news-list.json'
  const resolvedVirtualModuleId = '\0' + virtualModuleId

  return {
    name: 'news-list-generator',
    resolveId(id) {
      if (id === virtualModuleId) {
        return resolvedVirtualModuleId
      }
    },
    load(id) {
      if (id === resolvedVirtualModuleId) {
        const data = fg
          .sync('./src/data/news/*.md')
          .map((entry) => {
            return { entry, frontmatter: matter.read(entry, { excerpt: true }) }
          })
          .map((file): PageData => {
            const { entry, frontmatter } = file
            const filename = path.parse(entry).name
            const data = frontmatter.data
            const time = data.time
            const title = data.title
            delete data.time
            delete data.title
            return {
              title,
              time,
              data,
              excerpt: frontmatter.excerpt,
              contentUrl: `/news/${filename}`,
            }
          })
          .sort((a, b) => Date.parse(b.time) - Date.parse(a.time))
        return JSON.stringify(data)
      }
    },
    handleHotUpdate({ server, file }) {
      if (file.includes('src/data/news/')) {
        const thisModule = server.moduleGraph.getModuleById(resolvedVirtualModuleId)
        if (thisModule) return [thisModule]
      }
    },
  }
}
