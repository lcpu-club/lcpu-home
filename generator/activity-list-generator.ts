import { PluginOption } from 'vite'
import fg from 'fast-glob'
import matter from 'gray-matter'
import type { Activity } from '../src/data/activity'
import path from 'node:path'

export default function activityListGenerator(): PluginOption {
  const virtualModuleId = 'virtual:activity-list.json'
  const resolvedVirtualModuleId = '\0' + virtualModuleId

  return {
    name: 'activity-list-generator',
    resolveId(id) {
      if (id === virtualModuleId) {
        return resolvedVirtualModuleId
      }
    },
    load(id) {
      if (id === resolvedVirtualModuleId) {
        const data = fg
          .sync('./src/data/activities/*.md')
          .map((entry) => {
            return { entry, frontmatter: matter.read(entry, { excerpt: true }) }
          })
          .map((file): Activity => {
            const { entry, frontmatter } = file
            const filename = path.parse(entry).name
            return {
              ...(frontmatter.data as { time: Date; title: string }),
              excerpt: frontmatter.excerpt,
              contentUrl: `/activities/${filename}`,
            }
          })
          .sort((a, b) => b.time.valueOf() - a.time.valueOf())
        return JSON.stringify(data)
      }
    },
    handleHotUpdate({ server, file }) {
      if (file.includes('src/data/activities/')) {
        const thisModule = server.moduleGraph.getModuleById(resolvedVirtualModuleId)
        if (thisModule) return [thisModule]
      }
    },
  }
}
