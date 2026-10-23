import type { MarkdownIt, Token } from 'markdown-it'

// Only image-only paragraphs become figures; inline images must remain inline.
export default function imageCaptions(md: MarkdownIt) {
  md.core.ruler.after('inline', 'image_captions', (state) => {
    const result: Token[] = []
    for (let i = 0; i < state.tokens.length; i++) {
      const open = state.tokens[i]
      const inline = state.tokens[i + 1]
      const close = state.tokens[i + 2]
      const groups =
        open.type === 'paragraph_open' &&
        inline?.type === 'inline' &&
        close?.type === 'paragraph_close'
          ? imageGroups(inline.children ?? [])
          : undefined

      if (!groups) {
        result.push(open)
        continue
      }

      for (const children of groups) {
        const image = children.find((token) => token.type === 'image')!
        const caption = md.renderer
          .renderInlineAsText(image.children ?? [], md.options, state.env)
          .trim()
        const figure = new state.Token('figure_open', 'figure', 1)
        figure.block = true
        figure.attrSet('class', 'article-image')
        figure.map = open.map
        const imageContent = new state.Token('inline', '', 0)
        imageContent.children = children
        result.push(figure, imageContent)

        if (caption) {
          const captionOpen = new state.Token('figcaption_open', 'figcaption', 1)
          // Captions are literal text, including any Vue-like interpolation.
          captionOpen.attrSet('v-pre', '')
          const captionContent = new state.Token('inline', '', 0)
          const text = new state.Token('text', '', 0)
          text.content = caption
          captionContent.children = [text]
          result.push(
            captionOpen,
            captionContent,
            new state.Token('figcaption_close', 'figcaption', -1),
          )
        }

        const figureClose = new state.Token('figure_close', 'figure', -1)
        figureClose.block = true
        result.push(figureClose)
      }
      i += 2
    }
    state.tokens = result
  })
}

function imageGroups(children: Token[]): Token[][] | undefined {
  const groups: Token[][] = []
  for (let i = 0; i < children.length; i++) {
    const token = children[i]
    if (
      token.type === 'softbreak' ||
      token.type === 'hardbreak' ||
      (token.type === 'text' && !token.content.trim())
    ) {
      continue
    }
    if (token.type === 'image') {
      groups.push([token])
    } else if (
      token.type === 'link_open' &&
      children[i + 1]?.type === 'image' &&
      children[i + 2]?.type === 'link_close'
    ) {
      groups.push(children.slice(i, i + 3))
      i += 2
    } else {
      return undefined
    }
  }
  return groups.length ? groups : undefined
}
