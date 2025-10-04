#!/usr/bin/env bun
/**
 * 微信公众号文章转 Markdown 工具
 * 需要手动提供文章 URL、分类、标签等信息
 */

import { createInterface } from 'node:readline/promises'
import type { Interface } from 'node:readline/promises'
import { stdin as input, stdout as output } from 'node:process'
import { mkdir, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { JSDOM } from 'jsdom'
import TurndownService from 'turndown'
import axios from 'axios'

interface ArticleMetadata {
  category: string
  folderName: string
  title: string
  tags: string[]
  url: string
  time: string
}

interface DownloadedImage {
  originalUrl: string
  filename: string
  buffer: Buffer
}

const CATEGORIES = ['news', 'announcements', 'planets']

async function askQuestion(rl: Interface, question: string): Promise<string> {
  const answer = await rl.question(question)
  return answer.trim()
}

async function selectCategory(rl: Interface): Promise<string> {
  console.log('\n可用的内容分类:')
  CATEGORIES.forEach((cat, index) => {
    console.log(`  ${index + 1}. ${cat}`)
  })

  while (true) {
    const answer = await askQuestion(rl, '\n请选择分类 (输入数字): ')
    const index = parseInt(answer) - 1

    if (index >= 0 && index < CATEGORIES.length) {
      return CATEGORIES[index]
    }
    console.log('❌ 无效的选择，请重新输入')
  }
}

async function fetchArticle(url: string): Promise<string> {
  try {
    console.log('📥 正在获取文章内容...')
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
    })
    return response.data
  } catch (error) {
    throw new Error(`获取文章失败: ${error instanceof Error ? error.message : String(error)}`)
  }
}

function extractArticleContent(html: string): {
  content: string
  defaultTitle: string
  publishTime: string
} {
  const dom = new JSDOM(html)
  const doc = dom.window.document

  // 提取标题
  const defaultTitle =
    doc.querySelector('#activity-name')?.textContent?.trim() ||
    doc.querySelector('h1')?.textContent?.trim() ||
    '未命名文章'

  // 提取发布时间
  const publishTimeElement = doc.querySelector('#publish_time')
  let publishTime = ''

  if (publishTimeElement) {
    const timeText = publishTimeElement.textContent?.trim() || ''
    console.log(`发现时间文本: ${publishTimeElement.outerHTML}`)
    // 格式: "2025年09月30日 08:00" -> "2025-09-30"
    const match = timeText.match(/(\d{4})年(\d{2})月(\d{2})日/)
    if (match) {
      publishTime = `${match[1]}-${match[2]}-${match[3]}`
      console.log(`✅ 解析后的发布时间: ${publishTime}`)
    } else {
      console.warn(`⚠️  时间格式不匹配: ${timeText}`)
    }
  } else {
    // 尝试通过其他方式提取时间
    const metaInfo = doc.querySelector('#meta_content_hide_info')
    if (metaInfo) {
      const timeText = metaInfo.textContent?.trim() || ''
      const match = timeText.match(/(\d{4})年(\d{2})月(\d{2})日/)
      if (match) {
        publishTime = `${match[1]}-${match[2]}-${match[3]}`
        console.log(`提取到时间: ${publishTime}`)
      }
    }
  }

  // 提取正文内容
  const contentDiv = doc.querySelector('#js_content') || doc.querySelector('.rich_media_content')

  if (!contentDiv) {
    throw new Error('无法找到文章内容区域')
  }

  return {
    content: contentDiv.innerHTML,
    defaultTitle,
    publishTime,
  }
}

async function downloadImages(html: string): Promise<{ html: string; images: DownloadedImage[] }> {
  const dom = new JSDOM(html)
  const doc = dom.window.document
  const images: DownloadedImage[] = []
  const imageElements = doc.querySelectorAll('img')

  console.log(`\n📸 发现 ${imageElements.length} 张图片，开始下载...`)

  for (let i = 0; i < imageElements.length; i++) {
    const img = imageElements[i]
    const originalUrl = img.getAttribute('data-src') || img.getAttribute('src')

    if (!originalUrl || originalUrl.startsWith('data:')) {
      continue
    }

    try {
      const response = await axios.get(originalUrl, {
        responseType: 'arraybuffer',
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        },
      })

      // 从 URL 获取扩展名，默认为 jpg
      const urlObj = new URL(originalUrl)
      const ext = urlObj.pathname.match(/\.(jpg|jpeg|png|gif|webp)$/i)?.[1] || 'jpg'
      const filename = `image_${i + 1}.${ext}`

      images.push({
        originalUrl,
        filename,
        buffer: Buffer.from(response.data),
      })

      // 替换图片路径为相对路径
      img.setAttribute('src', `./${filename}`)
      img.removeAttribute('data-src')

      console.log(`  ✓ 下载: ${filename}`)
    } catch {
      console.warn(`  ⚠️  下载失败: ${originalUrl}`)
    }
  }

  return {
    html: doc.body.innerHTML,
    images,
  }
}

function convertToMarkdown(html: string): string {
  const turndownService = new TurndownService({
    headingStyle: 'atx',
    codeBlockStyle: 'fenced',
    bulletListMarker: '-',
  })

  // 自定义规则：保留图片的相对路径
  turndownService.addRule('images', {
    filter: 'img',
    replacement: (_content: string, node: Node) => {
      const element = node as HTMLElement
      const src = element.getAttribute('src') || ''
      const alt = element.getAttribute('alt') || ''
      return `![${alt}](${src})`
    },
  })

  return turndownService.turndown(html)
}

function generateFrontmatter(metadata: ArticleMetadata): string {
  const tagsStr =
    metadata.tags.length > 0 ? `[${metadata.tags.map((t) => `'${t}'`).join(', ')}]` : '[]'

  return `---
title: ${metadata.title}
time: ${metadata.time}
tags: ${tagsStr}
---

`
}

async function saveArticle(
  metadata: ArticleMetadata,
  markdown: string,
  images: DownloadedImage[],
): Promise<void> {
  const contentDir = join(process.cwd(), 'content', metadata.category, metadata.folderName)

  // 创建目录
  await mkdir(contentDir, { recursive: true })

  // 保存 Markdown 文件
  const frontmatter = generateFrontmatter(metadata)
  const fullMarkdown = frontmatter + markdown
  const mdPath = join(contentDir, 'index.md')
  await writeFile(mdPath, fullMarkdown, 'utf-8')
  console.log(`\n✅ Markdown 已保存: ${mdPath}`)

  // 保存图片
  if (images.length > 0) {
    console.log('\n💾 保存图片文件...')
    for (const img of images) {
      const imgPath = join(contentDir, img.filename)
      await writeFile(imgPath, img.buffer)
      console.log(`  ✓ ${img.filename}`)
    }
  }

  console.log(`\n🎉 转换完成！文件位置: content/${metadata.category}/${metadata.folderName}/`)
}

async function getCurrentTime(): Promise<string> {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

async function main() {
  const rl = createInterface({ input, output })

  console.log('🚀 微信公众号文章转 Markdown 工具\n')

  try {
    // 收集元数据
    const metadata: ArticleMetadata = {
      category: await selectCategory(rl),
      url: await askQuestion(rl, '\n📝 请输入微信公众号文章 URL: '),
      folderName: await askQuestion(rl, '📁 请输入文件夹名称 (如: 2025-fall-welcome): '),
      title: '',
      tags: [],
      time: await getCurrentTime(),
    }

    // 获取文章
    const html = await fetchArticle(metadata.url)
    const { content, defaultTitle, publishTime } = extractArticleContent(html)

    // 如果成功提取到发布时间，使用它作为默认值
    const defaultTime = publishTime || (await getCurrentTime())
    metadata.time = defaultTime

    // 获取标题
    const titleInput = await askQuestion(rl, `\n📋 请输入文章标题 (默认: ${defaultTitle}): `)
    metadata.title = titleInput || defaultTitle

    // 获取标签
    const tagsInput = await askQuestion(rl, '🏷️  请输入标签 (多个标签用逗号分隔，可留空): ')
    metadata.tags = tagsInput
      ? tagsInput
          .split(',')
          .map((t) => t.trim())
          .filter((t) => t)
      : []

    // 获取时间（显示从文章提取的时间作为默认值）
    const timePrompt = `📅 请输入发布时间 (YYYY-MM-DD, 默认: ${defaultTime}): `
    const timeInput = await askQuestion(rl, timePrompt)
    if (timeInput) {
      metadata.time = timeInput
    }

    // 下载图片并替换路径
    const { html: processedHtml, images } = await downloadImages(content)

    // 转换为 Markdown
    console.log('\n🔄 转换为 Markdown...')
    const markdown = convertToMarkdown(processedHtml)

    // 保存文件
    await saveArticle(metadata, markdown, images)
  } catch (error) {
    console.error('\n❌ 错误:', error instanceof Error ? error.message : String(error))
    process.exit(1)
  } finally {
    rl.close()
  }
}

main()
