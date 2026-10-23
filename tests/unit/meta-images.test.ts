import { expect, test } from 'bun:test'
import { mkdtemp, mkdir, writeFile, readFile, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { pathToFileURL } from 'node:url'
import { build } from 'vite'
import sharp from 'sharp'
import { Feed } from 'feed'
import { generatePagesModule } from '../../generator/pages-generator'
import imageOptimizer from '../../generator/image-optimizer'
import { renderMeta } from '../../src/metadata'
import type { PageData } from '../../src/data/pagedata'

const page = (image: string): PageData => ({
  title: 'Cover regression',
  time: '2026-01-01',
  contentUrl: '/news/cover/',
  sourceUrl: '/news/cover/index.md',
  data: {},
  meta: { image },
})

test('cover URLs preserve external and public images and reject missing files', async () => {
  const root = await mkdtemp(join(tmpdir(), 'lcpu-cover-'))
  try {
    await writeFile(join(root, 'cover.svg'), '<svg/>')
    expect(generatePagesModule([page('/cover.svg')], root, root)).toContain(
      'https://lcpu.dev/cover.svg',
    )
    expect(generatePagesModule([page('https://example.com/cover.png')])).toContain(
      'https://example.com/cover.png',
    )
    expect(generatePagesModule([page('//example.com/cover.png')])).toContain(
      'https://example.com/cover.png',
    )
    expect(() => generatePagesModule([page('./missing.png')], root)).toThrow('Missing meta.image')
    expect(() => generatePagesModule([page('data:image/png;base64,AA==')])).toThrow(
      'Unsupported meta.image',
    )
  } finally {
    await rm(root, { recursive: true, force: true })
  }
})

test('Vite emits metadata-only covers with matching client/SSR URLs usable by HTML and feeds', async () => {
  const root = await mkdtemp(join(tmpdir(), 'lcpu-cover-build-'))
  try {
    const article = join(root, 'content/news/cover')
    await mkdir(article, { recursive: true })
    // Large source exercises the optimizer; SVG exercises Vite URL handling without inlining.
    const pixels = Buffer.alloc(1200 * 900 * 3)
    for (let i = 0; i < pixels.length; i++) pixels[i] = (i * 17 + Math.floor(i / 59)) % 256
    await sharp(pixels, { raw: { width: 1200, height: 900, channels: 3 } })
      .png({ compressionLevel: 0 })
      .toFile(join(article, 'cover.png'))
    await writeFile(
      join(article, 'cover.svg'),
      '<svg xmlns="http://www.w3.org/2000/svg" width="10" height="10"><rect width="10" height="10"/></svg>',
    )
    const source = generatePagesModule(
      [page('./cover.png'), page('./cover.svg')],
      join(root, 'content'),
    )
    await writeFile(join(root, 'entry.js'), source)
    for (const ssr of [false, true]) {
      await build({
        configFile: false,
        root,
        logLevel: 'silent',
        plugins: [imageOptimizer()],
        build: {
          outDir: ssr ? 'server' : 'client',
          ssr: ssr ? join(root, 'entry.js') : false,
          ssrEmitAssets: true,
          minify: false,
          rolldownOptions: {
            input: join(root, 'entry.js'),
            preserveEntrySignatures: 'strict',
            output: { entryFileNames: 'entry.mjs' },
          },
        },
      })
    }
    const client = (await import(pathToFileURL(join(root, 'client/entry.mjs')).href))
      .default as PageData[]
    const server = (await import(pathToFileURL(join(root, 'server/entry.mjs')).href))
      .default as PageData[]
    expect(client).toEqual(server)
    expect(client[0].meta!.image).toMatch(/^https:\/\/lcpu.dev\/assets\/cover-.*\.webp$/)
    expect(client[1].meta!.image).toMatch(/^https:\/\/lcpu.dev\/assets\/cover-.*\.svg$/)
    for (const item of client) {
      const image = item.meta!.image!
      expect(
        (await readFile(join(root, 'client', new URL(image).pathname))).length,
      ).toBeGreaterThan(0)
      const html = renderMeta(
        { titlePrefix: item.title, sourceUrl: item.sourceUrl, meta: item.meta },
        item.contentUrl,
      )
      expect(html).toContain(`property="og:image" content="${image}"`)
      expect(html).toContain(`name="twitter:image" content="${image}"`)
      expect(html).toContain(`"image":"${image}"`)
      const feed = new Feed({ title: 'Test', id: 'https://lcpu.dev', copyright: 'LCPU' })
      feed.addItem({
        title: item.title,
        id: `https://lcpu.dev${item.contentUrl}`,
        date: new Date(item.time),
        image,
      })
      expect(feed.atom1()).toContain(image)
    }
  } finally {
    await rm(root, { recursive: true, force: true })
  }
}, 30000)
