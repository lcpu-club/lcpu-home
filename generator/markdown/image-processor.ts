import type { MarkdownIt } from 'markdown-it'
import probe from 'probe-image-size'
import fs from 'node:fs'

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
    if (srcIndex < 0) return defaultRender(tokens, idx, options, env, self)
    const src = String(token.attrs[srcIndex][1])

    const dimensions = resolveDimensions(src, String(env?.mdRootPath ?? ''))

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
    if (src.startsWith('./') && /\.(?:jpe?g|png|webp)$/i.test(src)) {
      token.attrs[srcIndex][1] = `${src}?article-image`
    }
    return defaultRender(tokens, idx, options, env, self)
  }
}

function resolveDimensions(src: string, mdRootPath: string) {
  if (src.startsWith('./')) {
    try {
      const filePath = mdRootPath + '/' + src.slice(2)
      const data = fs.readFileSync(filePath)
      const size = probe.sync(data)
      if (size && size.height && size.width)
        return {
          height: size.height.toString(),
          width: size.width.toString(),
        }
      return null
    } catch (e) {
      console.warn(`Failed to get image size for ${src}:`, e)
      return null
    }
  } else if (src.startsWith('/')) {
    try {
      const filePath = 'public' + src
      const data = fs.readFileSync(filePath)
      const size = probe.sync(data)
      if (size && size.height && size.width)
        return {
          height: size.height.toString(),
          width: size.width.toString(),
        }
      return null
    } catch (e) {
      console.warn(`Failed to get image size for ${src}:`, e)
      return null
    }
  } else {
    return null
  }
}
