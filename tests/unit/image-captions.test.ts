import { expect, test } from 'bun:test'
import MarkdownIt from 'markdown-it'
import { JSDOM } from 'jsdom'
import { compileTemplate } from '@vue/compiler-sfc'
import imageCaptions from '../../generator/markdown/image-captions'
import { registerMarkdownPlugins } from '../../generator/markdown'

const md = new MarkdownIt().use(imageCaptions)
const documentFor = (source: string) => new JSDOM(md.render(source)).window.document

test('standalone images retain alt text and expose semantic captions', () => {
  const doc = documentFor('![A useful caption](https://example.com/image.png)')
  expect(doc.querySelector('figure.article-image img')?.getAttribute('alt')).toBe(
    'A useful caption',
  )
  expect(doc.querySelector('figcaption')?.textContent).toBe('A useful caption')
  expect(documentFor('![](https://example.com/image.png)').querySelector('figcaption')).toBeNull()
})
test('captions are escaped literal text, including Vue expressions', () => {
  const doc = documentFor(
    '![<script>alert(1)</script> & {{ secret }}](https://example.com/image.png)',
  )
  expect(doc.querySelector('figcaption')?.textContent).toBe(
    '<script>alert(1)</script> & {{ secret }}',
  )
  expect(doc.querySelector('figcaption')?.hasAttribute('v-pre')).toBe(true)
  expect(doc.querySelector('script')).toBeNull()
})
test('inline images stay inline while linked and grouped images become figures', () => {
  expect(
    documentFor('Before ![caption](https://example.com/a.png) after').querySelector('figure'),
  ).toBeNull()
  const doc = documentFor(
    '[![First](https://example.com/a.png)](https://example.com/)\n![Second](https://example.com/b.png)',
  )
  expect(doc.querySelectorAll('figure')).toHaveLength(2)
  expect(doc.querySelector('figure a')?.getAttribute('href')).toBe('https://example.com/')
})
test('figures remain inside list items and blockquotes without paragraph wrappers', () => {
  const doc = documentFor(
    '- ![List](https://example.com/a.png)\n\n> ![Quote](https://example.com/b.png)',
  )
  expect(doc.querySelector('li figure figcaption')?.textContent).toBe('List')
  expect(doc.querySelector('blockquote figure figcaption')?.textContent).toBe('Quote')
  expect(doc.querySelector('p figure')).toBeNull()
})
test('production plugins preserve lazy loading and compile captions into Vue', async () => {
  const production = new MarkdownIt({ html: true })
  await registerMarkdownPlugins(production)
  const html = production.render('![Literal {{ secret }}](https://example.com/a.png)', {
    mdRootPath: process.cwd(),
  })
  expect(new JSDOM(html).window.document.querySelector('img')?.getAttribute('loading')).toBe('lazy')
  const compiled = compileTemplate({ source: html, filename: 'caption.vue', id: 'caption' })
  expect(compiled.errors).toEqual([])
  expect(compiled.code).toContain('Literal {{ secret }}')
  expect(compiled.code).not.toContain('_ctx.secret')
})
