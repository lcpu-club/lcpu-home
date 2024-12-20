import { PluginOption } from 'vite'
import mdit from 'markdown-it'
import matter from 'gray-matter'
import Shiki from '@shikijs/markdown-it'

const md = mdit({
  html: true,
  linkify: true,
  typographer: true,
}).use(
  await Shiki({
    themes: {
      light: 'catppuccin-latte',
      dark: 'one-dark-pro',
    },
  }),
)

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
        return `<template><div>${md.render(content)}</div></template>`
      }
    },
  }
}
