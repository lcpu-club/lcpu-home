import { PluginOption } from 'vite'
import fg from 'fast-glob'
import matter from 'gray-matter'
import type { Activity } from '../src/data/activity'

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
            return matter.read(entry, { excerpt: true })
          })
          .map((file): Activity => {
            return {
              ...(file.data as { time: Date; title: string }),
              excerpt: file.excerpt,
              // file.data.time.toISOString().slice(0, 10): YYYY-MM-DD
              contentUrl: `/activities/${file.data.time.toISOString().slice(0, 10)}-${file.data.title}`,
            }
          })
          .sort((a, b) => a.time.valueOf() - b.time.valueOf())
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
