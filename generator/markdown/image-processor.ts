import MarkdownIt from 'markdown-it/index.js'
import sizeOf from 'image-size'

export default function markdownItImageProcessor(md: MarkdownIt) {
  const defaultRender =
    md.renderer.rules.image ||
    function (tokens, idx, options, env, self) {
      return self.renderToken(tokens, idx, options)
    }

  md.renderer.rules.image = function (tokens, idx, options, env, self) {
    const token = tokens[idx]
    if (!token.attrs) return defaultRender(tokens, idx, options, env, self)
    const srcIndex = token.attrIndex('src')
    const src = token.attrs[srcIndex][1]

    const dimensions = resolveDimensions(src)

    if (dimensions) {
      const widthIndex = token.attrIndex('width')
      const heightIndex = token.attrIndex('height')

      if (widthIndex >= 0) {
        token.attrs[widthIndex][1] = dimensions.width
      } else {
        token.attrs.push(['width', dimensions.width])
      }

      if (heightIndex >= 0) {
        token.attrs[heightIndex][1] = dimensions.height
      } else {
        token.attrs.push(['height', dimensions.height])
      }
    }
    return defaultRender(tokens, idx, options, env, self)
  }
}

function resolveDimensions(src: string) {
  if (!src.startsWith('/')) return null
  const size = sizeOf('public' + src)
  if (size.height && size.width)
    return {
      height: size.height.toString(),
      width: size.width.toString(),
    }
  return null
}
