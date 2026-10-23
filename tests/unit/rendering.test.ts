import { describe, expect, test } from 'bun:test'
import { normalizePath, canonicalPath, getHash } from '../../src/router/paths'
import { renderMeta, escapeHtml } from '../../src/metadata'

describe('static rendering', () => {
  test('publication dates are stable across time zones', () => {
    for (const TZ of ['America/Los_Angeles', 'Asia/Shanghai', 'UTC']) {
      const result = Bun.spawnSync(
        [
          process.execPath,
          '-e',
          `import { dateString, groupByYearMonth } from './src/utils.ts'; console.log(JSON.stringify([dateString('2026-01-01'), groupByYearMonth([{time:'2026-04-01'}])[0].month]))`,
        ],
        { env: { ...process.env, TZ } },
      )
      expect(result.exitCode).toBe(0)
      expect(JSON.parse(result.stdout.toString())).toEqual(['2026 年 1 月 1 日', 4])
    }
  })
  test('equivalent article paths share a canonical URL', () => {
    for (const path of [
      '/news/article',
      '/news/article/',
      '/news/article/index.html',
      'https://lcpu.dev/news/article/?tracking=1#section',
    ]) {
      expect(normalizePath(path)).toBe('/news/article')
      expect(canonicalPath(path)).toBe('/news/article/')
    }
    expect(normalizePath('/404.html')).toBe('/404.html')
    expect(normalizePath('/index.html')).toBe('/')
  })
  test('hashes support Unicode and malformed escapes', () => {
    expect(getHash('/tags/#' + encodeURIComponent('C++ & AI'))).toBe('C++ & AI')
    expect(getHash('/news/example/#学习组')).toBe('学习组')
    expect(() => getHash('/tags/#%bad')).not.toThrow()
    expect(() => normalizePath('/%bad')).not.toThrow()
  })
  test('metadata escapes HTML and structured data', () => {
    const html = renderMeta(
      {
        titlePrefix: '</script><title>test',
        meta: { description: 'A & B' },
        sourceUrl: '/news/example/index.md',
        time: '2026-01-01',
      },
      '/news/example?tracking=1#section',
    )
    expect(html).toContain('href="https://lcpu.dev/news/example/"')
    expect(html).toContain('A &amp; B')
    expect(html).not.toContain('<title>test')
    expect(html).toContain('\\u003c/script>')
    expect(html).toContain('data-page-meta')
    expect(escapeHtml('A < B')).toBe('A &lt; B')
  })
})
