import type { Plugin } from 'vite'
import { readFile } from 'node:fs/promises'
import { basename, extname } from 'node:path'
import sharp from 'sharp'

/** Optimize article rasters at build time while keeping source artwork untouched. */
export default function imageOptimizer(): Plugin {
  let building = false
  const images = new Map<string, Promise<{ name: string; source: Uint8Array }>>()
  return {
    name: 'article-image-optimizer',
    enforce: 'pre',
    configResolved(config) {
      building = config.command === 'build'
    },
    async load(id) {
      if (!building || !id.endsWith('?article-image')) return
      const file = id.slice(0, -'?article-image'.length)
      let image = images.get(file)
      if (!image) {
        image = (async () => {
          const original = await readFile(file)
          const metadata = await sharp(original, { animated: true }).metadata()
          if (original.length < 160_000 || (metadata.pages ?? 1) > 1) {
            return { name: basename(file), source: original }
          }
          const optimized = await sharp(original)
            .rotate()
            .resize({ width: 1920, withoutEnlargement: true })
            .webp({ quality: 85, effort: 4 })
            .toBuffer()
          return optimized.length < original.length
            ? { name: `${basename(file, extname(file))}.webp`, source: optimized }
            : { name: basename(file), source: original }
        })()
        images.set(file, image)
      }
      const reference = this.emitFile({ type: 'asset', ...(await image) })
      return `export default import.meta.ROLLUP_FILE_URL_${reference}`
    },
  }
}
