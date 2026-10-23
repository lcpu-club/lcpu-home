import { expect, test, type Page } from '@playwright/test'

async function checkHeights(page: Page) {
  const sizes = await page.locator('.image-gallery-viewport').evaluateAll((viewports) =>
    viewports.map((viewport) => {
      const width = viewport.getBoundingClientRect().width
      const heights = [...viewport.querySelectorAll('img')].map((image) => {
        const originalWidth = Number(image.getAttribute('width'))
        const originalHeight = Number(image.getAttribute('height'))
        return (originalHeight * width) / originalWidth
      })
      return { actual: viewport.getBoundingClientRect().height, expected: Math.max(...heights) }
    }),
  )
  expect(sizes.length).toBeGreaterThan(0)
  for (const { actual, expected } of sizes) {
    expect(expected).toBeGreaterThan(0)
    expect(Math.abs(actual - expected)).toBeLessThan(2)
  }
}

for (const width of [1440, 390]) {
  test(`gallery reserves the tallest image height at ${width}px without layout shifts`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 })
    await page.route('https://report.lcpu.dev/**', (route) => route.abort())
    await page.route('https://lcpu.dev/scripts/**', (route) => route.abort())
    await page.goto('/news/2026-fall-welcome/')
    await expect(page.locator('#app')).toHaveAttribute('data-hydrated', 'true')
    await checkHeights(page)
    const gallery = page.locator('.image-gallery').first()
    await gallery.scrollIntoViewIfNeeded()
    const height = await gallery.evaluate((element) => element.getBoundingClientRect().height)
    if (width < 768) await gallery.press('ArrowRight')
    else await gallery.getByRole('button', { name: '下一张图片' }).click()
    expect(await gallery.evaluate((element) => element.getBoundingClientRect().height)).toBe(height)
    await expect(gallery.locator('.image-gallery-slide[hidden]').first()).toHaveAttribute(
      'inert',
      '',
    )
    await checkHeights(page)
  })
}

test('gallery reserves image space in static HTML before hydration and image loading', async ({
  browser,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false })
  try {
    const page = await context.newPage()
    await page.route('**/assets/*', (route) =>
      route.request().resourceType() === 'image' ? route.abort() : route.continue(),
    )
    await page.goto('/news/2026-fall-welcome/')
    await checkHeights(page)
  } finally {
    await context.close()
  }
})
