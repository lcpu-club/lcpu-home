import { expect, test } from 'bun:test'
import { JSDOM } from 'jsdom'

test('gallery hydrates with one caption and navigates by button and keyboard', async () => {
  const dom = new JSDOM('<div id="app"></div>')
  for (const name of [
    'window',
    'document',
    'Element',
    'HTMLElement',
    'SVGElement',
    'Node',
  ] as const) {
    Object.defineProperty(globalThis, name, { value: dom.window[name], configurable: true })
  }
  const { createSSRApp, h, nextTick } = await import('vue')
  const { renderToString } = await import('vue/server-renderer')
  const { default: ImageGallery } = await import('../../src/components/ImageGallery')
  const Root = {
    render: () =>
      h(
        ImageGallery,
        { caption: '共同说明' },
        {
          ...Object.fromEntries(
            [1, 2, 3].map((i) => [
              `slide-${i - 1}`,
              () => h('figure', [h('img', { src: `${i}.jpg`, alt: `图片 ${i}` })]),
            ]),
          ),
        },
      ),
  }
  const container = dom.window.document.querySelector('#app')!
  container.innerHTML = await renderToString(createSSRApp(Root))
  expect(container.querySelectorAll('figcaption').length).toBe(1)
  const app = createSSRApp(Root)
  const warnings: string[] = []
  app.config.warnHandler = (warning) => warnings.push(warning)
  app.mount(container)
  const visibleImage = () =>
    container.querySelector('.image-gallery-slide:not([hidden]) img')?.getAttribute('src')
  expect(visibleImage()).toBe('1.jpg')
  ;(container.querySelector('[aria-label="下一张图片"]') as HTMLElement).click()
  await nextTick()
  expect(visibleImage()).toBe('2.jpg')
  const gallery = container.querySelector('.image-gallery')!
  gallery.dispatchEvent(
    new dom.window.KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true }),
  )
  await nextTick()
  gallery.dispatchEvent(
    new dom.window.KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true }),
  )
  await nextTick()
  expect(visibleImage()).toBe('3.jpg')
  expect(container.querySelector('[aria-live]')?.textContent).toBe('3 / 3')
  const viewport = container.querySelector('.image-gallery-viewport')!
  const swipe = async (dx: number, dy: number) => {
    const start = new dom.window.Event('touchstart', { bubbles: true })
    Object.defineProperty(start, 'touches', { value: [{ clientX: 200, clientY: 200 }] })
    viewport.dispatchEvent(start)
    const end = new dom.window.Event('touchend', { bubbles: true })
    Object.defineProperties(end, {
      touches: { value: [] },
      changedTouches: { value: [{ clientX: 200 + dx, clientY: 200 + dy }] },
    })
    viewport.dispatchEvent(end)
    await nextTick()
  }
  await swipe(-100, 10)
  expect(visibleImage()).toBe('1.jpg')
  await swipe(100, 10)
  expect(visibleImage()).toBe('3.jpg')
  await swipe(-20, 100)
  expect(visibleImage()).toBe('3.jpg')
  expect(container.querySelector('.image-gallery-badge')?.textContent).toBe('图片集')
  expect(warnings).toEqual([])
  app.unmount()
  dom.window.close()
})

test('Markdown gallery suppresses individual captions and escapes the shared caption', async () => {
  const { default: MarkdownIt } = await import('markdown-it')
  const { registerMarkdownPlugins } = await import('../../generator/markdown/index')
  const { compileTemplate } = await import('@vue/compiler-sfc')
  const md = new MarkdownIt({ html: true })
  await registerMarkdownPlugins(md)
  const html = md.render(
    '::: gallery A & "B" {{ literal }}\n\n![甲](https://example.com/1.jpg)\n\n![乙](https://example.com/2.jpg)\n\n:::\n\n![单图](https://example.com/3.jpg)',
  )
  expect(html).toContain('caption="A &amp; &quot;B&quot; {{ literal }}"')
  expect(html.match(/<figcaption/g)).toHaveLength(1)
  expect(html.match(/<figure /g)).toHaveLength(3)
  expect(html).toContain('<template #slide-0>')
  expect(html).toContain('<template #slide-1>')
  expect(compileTemplate({ source: html, filename: 'Gallery.vue', id: 'gallery' }).errors).toEqual(
    [],
  )
})
