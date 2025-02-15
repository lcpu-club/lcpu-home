import MarkdownIt from 'markdown-it'
import Token from 'markdown-it/lib/token.mjs'
import { SiteConfiguration } from '../../src/site'
import Shiki from '@shikijs/markdown-it'
import {
  transformerNotationDiff,
  transformerNotationFocus,
  transformerNotationHighlight,
  transformerRemoveNotationEscape,
} from '@shikijs/transformers'
import MathJax3 from 'markdown-it-mathjax3'
import MarkdownItContainer from 'markdown-it-container'
import { componentPlugin } from '@mdit-vue/plugin-component'
import ImageProcessor from './image-processor'
import anchor from 'markdown-it-anchor'
import { imgLazyload } from '@mdit/plugin-img-lazyload'

export async function registerMarkdownPlugins(mdit: MarkdownIt) {
  mdit
    .use(ImageProcessor)
    .use(MathJax3)
    .use(anchor, {
      permalink: anchor.permalink.ariaHidden({
        placement: 'before',
        class: 'header-anchor',
      }),
    })
    .use(createContainer, 'warning', SiteConfiguration.markdown.container.warningLabel || 'WARNING')
    .use(createContainer, 'error', SiteConfiguration.markdown.container.errorLabel || 'ERROR')
    .use(createContainer, 'info', SiteConfiguration.markdown.container.infoLabel || 'INFO')
    .use(MarkdownItContainer, 'expander', {
      render: (tokens: Token[], idx: number) => {
        if (tokens[idx].nesting === 1) {
          return `
<ExpanderComponent class="expander" :initial-collapsed="true"
  :extend-toggle-area="true">
  <template #header>
    <span font-bold text-sm p-y-4>${extractExpanderTitle(tokens[idx].info)}</span>
  </template>\n`
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
        transformers: [
          transformerNotationDiff(),
          transformerNotationFocus(),
          transformerNotationHighlight(),
          transformerRemoveNotationEscape(),
        ],
      }),
    )
    .use(componentPlugin)
    .use(imgLazyload)
}

function extractExpanderTitle(info: string) {
  const re = /^ *expander *(.*?)$/
  const result = info.replace(re, '$1').trim()
  if (result) return result
  else return SiteConfiguration.markdown.container.expanderLabel ?? 'MORE'
}

function extractContainerTitle(info: string, klass: string) {
  const re = new RegExp(`^ *${klass.trim()} *(.*?)$`)
  const result = info.replace(re, '$1').trim()
  return result
}

function createContainer(md: MarkdownIt, klass: string, title: string) {
  MarkdownItContainer(md, klass, {
    render: (tokens: Token[], idx: number) => {
      return tokens[idx].nesting === 1
        ? `<div class="container ${klass}"><p class="container-title">${extractContainerTitle(tokens[idx].info, klass) || title}</p>\n`
        : '</div>\n'
    },
  })
}
