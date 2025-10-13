import MarkdownIt from 'markdown-it/index.js'
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
    const src = token.attrs[srcIndex][1]
    const altIndex = token.attrIndex('alt')
    const alt = altIndex >= 0 ? token.attrs[altIndex][1] : ''

    const dimensions = resolveDimensions(src, env.mdRootPath)

    if (dimensions) {
      const widthIndex = token.attrIndex('width')
      const heightIndex = token.attrIndex('height')

      if (widthIndex >= 0) {
        token.attrs[widthIndex][1] = dimensions.width.toString()
      } else {
        token.attrs.push(['width', dimensions.width.toString()])
      }

      if (heightIndex >= 0) {
        token.attrs[heightIndex][1] = dimensions.height.toString()
      } else {
        token.attrs.push(['height', dimensions.height.toString()])
      }
    }

    // Add loading="lazy" attribute for lazy loading
    const loadingIndex = token.attrIndex('loading')
    if (loadingIndex < 0) {
      token.attrs.push(['loading', 'lazy'])
    }

    // Render the default img tag first
    const imgTag = defaultRender(tokens, idx, options, env, self)

    // Use alt text as caption if it exists, and escape it for HTML attributes
    const caption = alt ? alt.replace(/"/g, '&quot;').replace(/'/g, '&#39;') : ''

    // Wrap it in ImageBox component
    return `<ImageBox src="${src}" alt="${alt}" caption="${caption}" width="${dimensions?.width || ''}" height="${dimensions?.height || ''}">${imgTag}</ImageBox>`
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
