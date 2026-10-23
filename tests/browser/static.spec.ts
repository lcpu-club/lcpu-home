import { expect, test, type Page } from '@playwright/test'
import { readdirSync, readFileSync } from 'node:fs'

const article = '/announcements/grand-opening-of-llmos'
const title = '重磅 | LCPU 正式发布 LLMOS，更有崭“新”镜像上新！'
async function openPage(page: Page, path: string) {
  await page.goto(path)
  await expect(page.locator('#app')).toHaveAttribute('data-hydrated', 'true')
}
test.beforeEach(async ({ page }) => {
  await page.route('https://report.lcpu.dev/**', (route) => route.abort())
  await page.route('https://lcpu.dev/scripts/**', (route) => route.abort())
})
for (const suffix of ['', '/', '/index.html']) {
  test(`direct article navigation hydrates correctly: ${suffix || 'no slash'}`, async ({
    page,
  }) => {
    const errors: string[] = []
    page.on('pageerror', (error) => errors.push(error.message))
    page.on('console', (message) => {
      if (/hydration/i.test(message.text())) errors.push(message.text())
    })
    await openPage(page, article + suffix)
    await expect(page.locator('.md-content')).toBeVisible()
    await expect(page.locator('h1')).toHaveText(title)
    await expect(page.getByText('2025 年 4 月 1 日', { exact: true })).toBeVisible()
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      'href',
      'https://lcpu.dev' + article + '/',
    )
    expect(errors).toEqual([])
  })
}
test('tag selection follows browser history', async ({ page }) => {
  await openPage(page, '/tags/#CLab')
  await expect(page.locator('.news-list-entry').first()).toBeVisible()
  await page.getByRole('link', { name: 'AI', exact: true }).first().click()
  await expect(page).toHaveURL(/#AI$/)
  await expect(page.locator('.news-list-entry').first()).toBeVisible()
  await page.goBack()
  await expect(page).toHaveURL(/#CLab$/)
  await expect(page.locator('a[class~="bg-blue-100!"]')).toHaveText('CLab')
  await page.goForward()
  await expect(page.locator('a[class~="bg-blue-100!"]')).toHaveText('AI')
})
test('Chinese anchors scroll and navigation updates metadata', async ({ page }) => {
  await openPage(page, article + '/')
  const heading = page.locator('.md-content h2').first()
  expect(await heading.getAttribute('id')).toBeTruthy()
  await heading.hover()
  await heading.locator('a.header-anchor').click()
  await expect.poll(async () => (await heading.boundingBox())?.y ?? Infinity).toBeLessThan(85)
  await page.locator('a[href="/news/2026-hpcgame/"]').first().click()
  await expect(page.locator('.md-content')).toBeVisible()
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    'href',
    'https://lcpu.dev/news/2026-hpcgame/',
  )
  await expect(page.locator('meta[name="description"]')).not.toHaveAttribute('content', /愚人节/)
})
test('rapid navigation cannot display a stale async article', async ({ page }) => {
  await openPage(page, '/news/')
  await page.route('**/assets/*.js', async (route) => {
    if (route.request().url().includes('/assets/grand-opening-of-llmos-'))
      await new Promise((resolve) => setTimeout(resolve, 700))
    await route.continue()
  })
  await page.locator(`a[href="${article}/"]`).first().click()
  await page.locator('a[href="/news/2026-hpcgame/"]').first().click()
  await expect(page).toHaveURL(/\/news\/2026-hpcgame\//)
  await expect(page.locator('.md-content')).toContainText('HPCGame')
  await page.waitForTimeout(1000)
  await expect(page.locator('.md-content')).toContainText('HPCGame')
  await expect(page.locator('.md-content')).not.toContainText('LLMOS 深度融合')
})
test('hidden articles and unknown paths return static 404 pages', async ({ request }) => {
  for (const path of ['/announcements/test/', '/does-not-exist/']) {
    const response = await request.get(path)
    expect(response.status()).toBe(404)
    expect(await response.text()).not.toContain('md-content')
  }
})
test('image-heavy articles use lazy loading without blanket preloads', async ({ page }) => {
  await openPage(page, '/news/2025-fall-welcome/')
  await expect(page.locator('link[rel="preload"][as="image"]')).toHaveCount(0)
  expect(await page.locator('.md-content img').count()).toBeGreaterThan(10)
  await expect(page.locator('.md-content img').first()).toHaveAttribute('loading', 'lazy')
})
test('Back restores the article list scroll position', async ({ page }) => {
  await openPage(page, '/news/')
  const link = page
    .locator('.news-list-entry a')
    .filter({ has: page.locator('h3') })
    .nth(15)
  await link.scrollIntoViewIfNeeded()
  const scroll = await page.evaluate(() => window.scrollY)
  expect(scroll).toBeGreaterThan(500)
  await link.click()
  await expect(page.locator('.md-content')).toBeVisible()
  await page.goBack()
  await expect(page.locator('.news-list-entry').first()).toBeAttached()
  await expect
    .poll(async () => Math.abs((await page.evaluate(() => window.scrollY)) - scroll))
    .toBeLessThan(5)
})
test('download links retain native browser behavior', async ({ page }) => {
  await openPage(page, article + '/')
  await page.evaluate(() => {
    const link = document.createElement('a')
    link.href = '/news/'
    link.download = 'news.html'
    link.textContent = 'Download regression fixture'
    link.style.cssText = 'position:fixed;top:10px;right:10px;z-index:10000;background:white'
    document.body.append(link)
  })
  const download = page.waitForEvent('download')
  await page.getByRole('link', { name: 'Download regression fixture' }).click()
  expect((await download).suggestedFilename()).toBe('news.html')
  await expect(page).toHaveURL(new RegExp(article + '/$'))
})
test('failed article imports expose a retry action', async ({ page }) => {
  await openPage(page, '/news/')
  await page.route('**/assets/grand-opening-of-llmos-*.js', (route) => route.abort())
  await page.locator(`a[href="${article}/"]`).first().click()
  await expect(page.getByRole('alert')).toContainText('页面加载失败')
  await expect(page.getByRole('button', { name: '重新加载' })).toBeVisible()
})
test('homepage hydrates on desktop and mobile without overflow', async ({ page }) => {
  const errors: string[] = []
  page.on('pageerror', (error) => errors.push(error.message))
  page.on('console', (message) => {
    if (/hydration/i.test(message.text())) errors.push(message.text())
  })
  for (const width of [1440, 390]) {
    await page.setViewportSize({ width, height: 900 })
    await openPage(page, '/')
    await expect(page.locator('h1')).toContainText('Linux 俱乐部')
    await expect(page.locator('.news-list-entry').first()).toBeVisible()
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
  }
  expect(errors).toEqual([])
})
test('every generated article hydrates without runtime or hydration errors', async ({ page }) => {
  test.setTimeout(120000)
  const errors: string[] = []
  page.on('pageerror', (error) => errors.push(`${page.url()}: ${error.message}`))
  page.on('console', (message) => {
    if (/hydration/i.test(message.text())) errors.push(`${page.url()}: ${message.text()}`)
  })
  await page.route('**/assets/*', (route) =>
    route.request().resourceType() === 'image' ? route.abort() : route.continue(),
  )
  const files = readdirSync('dist/static', { recursive: true })
    .filter((file): file is string => typeof file === 'string' && file.endsWith('/index.html'))
    .filter((file) => {
      const html = readFileSync('dist/static/' + file, 'utf8')
      return html.includes('md-content') && !html.includes('http-equiv="refresh"')
    })
  expect(files.length).toBeGreaterThan(60)
  for (const file of files) {
    await openPage(page, '/' + file.replace('index.html', ''))
    await expect(page.locator('.md-content')).toBeVisible()
    await expect(page.locator('h1').first()).toBeVisible()
  }
  expect(errors).toEqual([])
})
