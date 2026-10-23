import type { PluginOption } from 'vite'
import fg from 'fast-glob'
import matter from 'gray-matter'
import type { PageData } from '../src/data/pagedata.ts'
import { dirname, relative, resolve } from 'node:path'
import { RouteTitleRecord } from '../src/site.ts'

export function generatePages(contentRoot = './content') {
  return fg
    .sync(`${contentRoot}/**/index.md`)
    .map((entry) => {
      return { entry, frontmatter: matter.read(entry, { excerpt: true }) }
    })
    .map((file): PageData | undefined => {
      const { entry, frontmatter } = file
      if (frontmatter.data.hidden) return undefined
      const path = relative(contentRoot, dirname(entry))
      const slugs = path.split('/').filter((slug) => slug)
      const { time, title, meta, slug = path, tags, summary, redirect, ...data } = frontmatter.data
      if (redirect !== undefined) {
        let url: URL
        try {
          url = new URL(redirect)
        } catch {
          throw new Error(`Invalid redirect URL in ${entry}`)
        }
        if (typeof redirect !== 'string' || !['http:', 'https:'].includes(url.protocol)) {
          throw new Error(`Redirect must be an absolute HTTP(S) URL in ${entry}`)
        }
      }
      const category = (slugs[0] in RouteTitleRecord && slugs[0]) || undefined
      return {
        title,
        time,
        data,
        meta,
        category,
        excerpt: getSummary(
          summary ?? meta?.description ?? (frontmatter.excerpt || frontmatter.content),
        ),
        redirect,
        contentUrl: `/${slug}/`,
        sourceUrl: `/${path}/index.md`,
        tags,
      }
    })
    .filter((page) => page !== undefined)
}

function getSummary(text: string): string {
  const plainText = text
    .replace(/!\[[^\]]*\]\([^)]*\)/g, '')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/<[^>]*>/g, '')
    .replace(/(^|\n)\s*[>#]+\s*/g, '$1')
    .replace(/[*_`]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
  const characters = Array.from(plainText)
  return characters.length > 120 ? characters.slice(0, 119).join('') + '…' : plainText
}

export default function pagesGenerator(): PluginOption {
  const virtualModuleId = 'virtual:pages.json'
  const resolvedVirtualModuleId = '\0' + virtualModuleId
  const modulesId = 'virtual:page-modules'
  const resolvedModulesId = '\0' + modulesId

  return {
    name: 'pages-generator',
    resolveId(id) {
      if (id === modulesId) return resolvedModulesId
      if (id === virtualModuleId) {
        return resolvedVirtualModuleId
      }
    },
    load(id) {
      if (id === resolvedModulesId) {
        const sources = [
          ...generatePages().map((page) => `./content${page.sourceUrl}`),
          ...fg.sync('./content/**/index.vue'),
        ]
        return `export default {${sources
          .map((source) => {
            const key = '../' + source.replace(/^\.\//, '')
            return `${JSON.stringify(key)}: () => import(${JSON.stringify(resolve(source))})`
          })
          .join(',')}}`
      }
      if (id === resolvedVirtualModuleId) {
        return JSON.stringify(generatePages())
      }
    },
    handleHotUpdate({ server, file }) {
      if (file.includes('content/')) {
        return [resolvedVirtualModuleId, resolvedModulesId]
          .map((id) => server.moduleGraph.getModuleById(id))
          .filter((module) => module !== undefined)
      }
    },
  }
}
