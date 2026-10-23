import { expect, test, type Page } from '@playwright/test'

async function openArticle(page: Page) {
  await page.route('https://report.lcpu.dev/**', (route) => route.abort())
  await page.route('https://lcpu.dev/scripts/**', (route) => route.abort())
  await page.goto('/announcements/2026-summer-shirts-order/')
  await expect(page.locator('#app')).toHaveAttribute('data-hydrated', 'true')
  const image = page.locator('.image-gallery-slide:not([hidden]) img').first()
  await expect(image).toHaveAttribute('role', 'button')
  return image
}

test('viewer opens from a gallery, zooms, navigates, traps focus and restores focus/scroll styles', async ({
  page,
}) => {
  const errors: string[] = []
  page.on('pageerror', (error) => errors.push(error.message))
  page.on('console', (message) => {
    if (/hydration/i.test(message.text())) errors.push(message.text())
  })
  const image = await openArticle(page)
  const src = await image.getAttribute('src')
  await page.evaluate(() => {
    document.body.style.overflow = 'auto'
  })
  await image.click()
  const viewer = page.getByRole('dialog', { name: '图片查看器' })
  await expect(viewer).toBeVisible()
  await expect(viewer.locator('img')).toHaveAttribute(
    'src',
    new RegExp(src!.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '$'),
  )
  await expect(viewer.getByRole('button', { name: '关闭图片查看器' })).toBeFocused()
  await viewer.getByRole('button', { name: '放大图片', exact: true }).click()
  await expect(viewer.getByRole('button', { name: '重置缩放' })).toHaveText('150%')
  const photo = viewer.locator('img')
  const box = await photo.boundingBox()
  await page.mouse.move(box!.x + box!.width / 2, box!.y + box!.height / 2)
  await page.mouse.down()
  await page.mouse.move(box!.x + box!.width / 2 + 70, box!.y + box!.height / 2 + 20, { steps: 5 })
  await page.mouse.up()
  await expect(photo).toHaveAttribute('style', /translate\(70px, 20px\)/)
  await expect(viewer).toBeVisible()
  await page.keyboard.press('ArrowRight')
  await expect(photo).not.toHaveAttribute(
    'src',
    new RegExp(src!.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '$'),
  )
  await expect(viewer.getByRole('button', { name: '重置缩放' })).toHaveText('100%')
  await viewer.locator('.imagebox-stage').hover()
  await page.mouse.wheel(0, -100)
  await expect(viewer.getByRole('button', { name: '重置缩放' })).toHaveText('122%')
  await viewer.getByRole('button', { name: '重置缩放' }).click()
  await page.keyboard.press('Tab')
  expect(await viewer.evaluate((el) => el.contains(document.activeElement))).toBe(true)
  await page.keyboard.press('Escape')
  await expect(viewer).not.toBeVisible()
  await expect(image).toBeFocused()
  expect(await page.evaluate(() => document.body.style.overflow)).toBe('auto')
  await image.press('Enter')
  await expect(viewer).toBeVisible()
  await viewer.getByRole('button', { name: '关闭图片查看器' }).click()
  await expect(viewer).not.toBeVisible()
  await image.press('Enter')
  await expect(viewer).toBeVisible()
  await viewer.locator('img').click()
  await expect(viewer).not.toBeVisible()
  expect(errors).toEqual([])
})

test('linked images retain native links; navigation closes the viewer; dynamically added images work', async ({
  page,
}) => {
  await openArticle(page)
  await page.evaluate(() => {
    const fixture = document.createElement('div')
    fixture.className = 'md-content'
    fixture.id = 'viewer-fixture'
    fixture.style.cssText = 'position:fixed;top:80px;right:20px;z-index:10000;background:white'
    const src = document.querySelector<HTMLImageElement>('.md-content img')!.src
    const link = document.createElement('a')
    link.href = '#linked-image'
    const image = document.createElement('img')
    image.src = src
    image.alt = '链接图片'
    image.style.width = '100px'
    link.append(image)
    fixture.append(link)
    const standalone = image.cloneNode() as HTMLImageElement
    standalone.alt = '独立图片'
    fixture.append(standalone)
    document.getElementById('app')!.append(fixture)
  })
  const linked = page.locator('#viewer-fixture a img')
  await expect(linked).not.toHaveAttribute('role', 'button')
  await linked.click()
  await expect(page).toHaveURL(/#linked-image$/)
  const viewer = page.getByRole('dialog', { name: '图片查看器' })
  await expect(viewer).not.toBeVisible()
  const standalone = page.locator('#viewer-fixture > img')
  await expect(standalone).toHaveAttribute('role', 'button')
  await standalone.press('Space')
  await expect(viewer).toBeVisible()
  await expect(viewer.getByRole('button', { name: '下一张图片' })).toHaveCount(0)
  await page.evaluate(() => {
    history.back()
  })
  await expect(viewer).not.toBeVisible()
  expect(await page.evaluate(() => document.body.style.overflow)).not.toBe('hidden')
})

test('mobile viewer fits viewport and supports two-finger zoom without browser zoom', async ({
  browser,
}) => {
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
  })
  const page = await context.newPage()
  try {
    const image = await openArticle(page)
    await image.tap()
    const viewer = page.getByRole('dialog', { name: '图片查看器' })
    await expect(viewer).toBeVisible()
    const stage = viewer.locator('.imagebox-stage')
    expect(await stage.evaluate((el) => getComputedStyle(el).touchAction)).toBe('none')
    const box = await stage.boundingBox()
    const y = box!.y + box!.height / 2
    const session = await context.newCDPSession(page)
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
    await expect(viewer.getByRole('button', { name: '放大图片', exact: true })).toHaveCount(0)
    await expect(viewer.getByRole('button', { name: '缩小图片', exact: true })).toHaveCount(0)
    await expect(viewer).toBeVisible()
    expect(await page.evaluate(() => visualViewport!.scale)).toBe(1)
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
    await page.touchscreen.tap(195, y)
    await expect(viewer).not.toBeVisible()
    await image.tap()
    await expect(viewer).toBeVisible()
    await viewer.locator('.imagebox-caption').tap()
    await expect(viewer).not.toBeVisible()
    await image.tap()
    await expect(viewer).toBeVisible()
    await viewer.getByRole('status', { name: '缩放比例' }).tap()
    await expect(viewer).not.toBeVisible()
  } finally {
    await context.close()
  }
})
