import { PluginOption } from 'vite'
import fs from 'fs'
import { SiteConfiguration } from '../src/site'

export default function newsListGenerator(): PluginOption {
  const virtualModuleId = 'virtual:base.css'
  const resolvedVirtualModuleId = '\0' + virtualModuleId

  return {
    name: 'base-css-generator',
    resolveId(id) {
      if (id === virtualModuleId) {
        return resolvedVirtualModuleId
      }
    },
    load(id) {
      if (id === resolvedVirtualModuleId) {
        const base = fs.readFileSync('./src/assets/base.css', 'utf-8')
        return base
          .replace(
            '/* warning text */',
            SiteConfiguration.markdown.container.warningLabel ?? 'WARNING',
          )
          .replace('/* error text */', SiteConfiguration.markdown.container.errorLabel ?? 'ERROR')
          .replace('/* info text */', SiteConfiguration.markdown.container.infoLabel ?? 'INFO')
      }
    },
    handleHotUpdate({ server, file }) {
      if (file.includes('src/assets/base.css')) {
        const thisModule = server.moduleGraph.getModuleById(resolvedVirtualModuleId)
        if (thisModule) return [thisModule]
      }
    },
  }
}
