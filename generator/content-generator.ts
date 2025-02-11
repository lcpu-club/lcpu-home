import { PluginOption } from 'vite'
import matter from 'gray-matter'
import * as mdit from 'markdown-it'
import { registerMarkdownPlugins } from './markdown'

const md = mdit.default({
  html: true,
  linkify: true,
  typographer: true,
})

registerMarkdownPlugins(md)

const scriptRe = /(<script[\s\S]*?>[\s\S]*?<\/script>)/g
const styleRe = /(<style[\s\S]*?>[\s\S]*?<\/style>)/g
const preReplaceRe = /(<pre(?:(?!v-pre)[\s\S])*?)>/gm

export default function markdownContentGenerator(): PluginOption {
  const virtualModuleId = 'virtual:news-list.json'
  const resolvedVirtualModuleId = '\0' + virtualModuleId

  return {
    name: 'markdown-content-generator',
    enforce: 'pre',
    resolveId(id) {
      if (id === virtualModuleId) {
        return resolvedVirtualModuleId
      }
    },
    transform(code, id) {
      if (id.endsWith('.md')) {
        const content = matter(code, { excerpt: true }).content
        let rendered = md.render(content)
        const scripts: string[] = []
        const styles: string[] = []
        rendered.match(scriptRe)?.forEach((script) => {
          scripts.push(script)
        })
        rendered = rendered.replace(scriptRe, '')
        rendered.match(styleRe)?.forEach((style) => {
          styles.push(style)
        })
        rendered = rendered.replace(styleRe, '')
        rendered = rendered.replace(preReplaceRe, '$1 v-pre>')

        return `<template><div class="md-content">${rendered}</div></template>${scripts.join('')}${styles.join('')}`
      }
    },
  }
}
