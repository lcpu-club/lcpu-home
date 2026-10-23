import { expect, test } from '@playwright/test'

test('mobile galleries show only a small hint and the viewer supports swipes without disrupting pinch zoom', async ({
  browser,
}) => {
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
  })
  try {
    const page = await context.newPage()
    await page.route('https://report.lcpu.dev/**', (route) => route.abort())
    await page.route('https://lcpu.dev/scripts/**', (route) => route.abort())
    await page.goto('/announcements/2026-summer-shirts-order/')
    await expect(page.locator('#app')).toHaveAttribute('data-hydrated', 'true')
    const gallery = page.locator('.image-gallery').first()
    await gallery.scrollIntoViewIfNeeded()
    await expect(gallery.locator('.image-gallery-controls')).toBeHidden()
    await expect(gallery.locator('.image-gallery-badge')).toBeHidden()
    await expect(gallery.locator('.image-gallery-hint')).toBeVisible()
    expect(
      await gallery
        .locator('.image-gallery-hint')
        .evaluate((element) => parseFloat(getComputedStyle(element).fontSize)),
    ).toBeLessThanOrEqual(10)

    const session = await context.newCDPSession(page)
    async function swipe(y: number, dx: number, dy = 0, cancel = false) {
      const x = dx < 0 ? 280 : 110
      await session.send('Input.dispatchTouchEvent', {
        type: 'touchStart',
        touchPoints: [{ x, y, id: 0 }],
      })
      await session.send('Input.dispatchTouchEvent', {
        type: 'touchMove',
        touchPoints: [{ x: x + dx, y: y + dy, id: 0 }],
      })
      await session.send('Input.dispatchTouchEvent', {
        type: cancel ? 'touchCancel' : 'touchEnd',
        touchPoints: [],
      })
      await page.evaluate(
        () =>
          new Promise<void>((resolve) =>
            requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
          ),
      )
    }
    const first = gallery.locator('.image-gallery-slide:not([hidden]) img')
    const initialSrc = await first.getAttribute('src')
    const box = await first.boundingBox()
    await swipe(box!.y + box!.height / 2, -150)
    await expect(first).not.toHaveAttribute('src', initialSrc!)
    await first.tap()
    const viewer = page.getByRole('dialog', { name: '图片查看器' })
    await expect(viewer).toBeVisible()
    await expect(viewer.locator('.imagebox-toolbar > span')).toHaveText('2 / 3')
    await expect(viewer.getByRole('button', { name: '下一张图片' })).toHaveCount(0)
    const stage = await viewer.locator('.imagebox-stage').boundingBox()
    const y = stage!.y + stage!.height / 2
    await swipe(y, -150)
    await expect(viewer.locator('.imagebox-toolbar > span')).toHaveText('3 / 3')
    await expect(viewer).toBeVisible()
    await swipe(y, 150)
    await expect(viewer.locator('.imagebox-toolbar > span')).toHaveText('2 / 3')
    await swipe(y, 20, 100)
    await swipe(y, -150, 0, true)
    await expect(viewer.locator('.imagebox-toolbar > span')).toHaveText('2 / 3')
    await session.send('Input.dispatchTouchEvent', {
      type: 'touchStart',
      touchPoints: [
        { x: 145, y, id: 0 },
        { x: 245, y, id: 1 },
      ],
    })
    await session.send('Input.dispatchTouchEvent', {
      type: 'touchMove',
      touchPoints: [
        { x: 95, y, id: 0 },
        { x: 295, y, id: 1 },
      ],
    })
    await session.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] })
    await expect(viewer.getByRole('status', { name: '缩放比例' })).toHaveText('200%')
    await swipe(y, -150)
    await expect(viewer.locator('.imagebox-toolbar > span')).toHaveText('2 / 3')
    await expect(viewer).toBeVisible()
    await page.keyboard.press('Escape')
    await expect(viewer).not.toBeVisible()
  } finally {
    await context.close()
  }
})
