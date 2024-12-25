import { PluginOption } from 'vite'
import * as mdit from 'markdown-it'
import Token from 'markdown-it/lib/token.mjs'
import matter from 'gray-matter'
import Shiki from '@shikijs/markdown-it'
import MathJax3 from 'markdown-it-mathjax3'
import MarkdownItContainer from 'markdown-it-container'

const md = mdit
  .default({
    html: true,
    linkify: true,
    typographer: true,
  })
  .use(MathJax3)
  .use(MarkdownItContainer, 'warning')
  .use(MarkdownItContainer, 'error')
  .use(MarkdownItContainer, 'info')
  .use(MarkdownItContainer, 'expander', {
    render: (tokens: Token[], idx: number) => {
      if (tokens[idx].nesting === 1) {
        return `<ExpanderComponent class="expander"><template #header><span font-bold text-sm p-y-4>MORE</span></template>\n`
      } else {
        return '</ExpanderComponent>\n'
      }
    },
  })
  .use(
    await Shiki({
      themes: {
        light: 'catppuccin-latte',
        dark: 'one-dark-pro',
      },
    }),
  )

const scriptRe = /(<script[\s\S]*?>[\s\S]*?<\/script>)/g
const styleRe = /(<style[\s\S]*?>[\s\S]*?<\/style>)/g

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
        return `<template><div>${rendered}</div></template>${scripts.join('')}${styles.join('')}`
      }
    },
  }
}
