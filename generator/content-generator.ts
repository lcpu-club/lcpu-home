import { PluginOption } from 'vite'
import matter from 'gray-matter'
import * as mdit from 'markdown-it'
import { injectHeaderData, registerMarkdownPlugins } from './markdown'
import { dirname } from 'path'
import { MarkdownSfcBlocks } from '@mdit-vue/plugin-sfc'
import { MarkdownItHeader } from '@mdit-vue/plugin-headers'

const md = mdit.default({
  html: true,
  linkify: true,
  typographer: true,
})

registerMarkdownPlugins(md)

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
        const env: {
          mdRootPath: string
          sfcBlocks?: MarkdownSfcBlocks
          headers?: MarkdownItHeader[]
        } = { mdRootPath: dirname(id) }
        const rendered = md.render(content, env)
        const sfcBlocks = env.sfcBlocks!
        let templateContent = sfcBlocks.template?.contentStripped || ''
        templateContent = rendered.replace(preReplaceRe, '$1 v-pre>')
        const headers = env.headers || []
        injectHeaderData(headers, sfcBlocks)
        return `<template><div class="md-content">${templateContent}</div></template>${sfcBlocks.scriptSetup?.content}${sfcBlocks.script?.content || ''}${sfcBlocks.styles.map((x) => x.content) || ''}${sfcBlocks.customBlocks.map((x) => x.content).join('')}`
      }
    },
  }
}
