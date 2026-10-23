import { useSSRContext, watchEffect } from 'vue'
import type { SSRContext } from 'vue/server-renderer'
import { SiteConfiguration, RouteTitleRecord } from './site'
import { canonicalPath } from './router/paths'

export function renderMeta(ctx: SSRContext, path: string): string {
  const url = canonicalPath(path)
  const meta = ctx.meta ?? {}
  const title = ctx.titlePrefix || '北京大学学生 Linux 俱乐部'
  const author = ctx.author
  const time = ctx.time
  const sourceUrl = ctx.sourceUrl

  const results: string[] = []
  const canonicalUrl = ctx.redirectUrl ?? `https://lcpu.dev${url}`
  if (ctx.redirectUrl) {
    results.push(`<meta http-equiv="refresh" content="0;url=${escapeHtml(ctx.redirectUrl)}">`)
  }

  results.push(
    `<meta name="title" content="${escapeHtml(title)}">`,
    `<meta property="og:title" content="${escapeHtml(title)}">`,
    `<meta name="twitter:title" content="${escapeHtml(title)}">`,
  )

  if (author) {
    results.push(`<meta name="author" content="${escapeHtml(author)}">`)
  } else {
    results.push(`<meta name="author" content="北京大学学生 Linux 俱乐部">`)
  }

  results.push(
    `<link rel="canonical" href="${escapeHtml(canonicalUrl)}">`,
    `<meta property="og:url" content="${escapeHtml(canonicalUrl)}">`,
  )

  if (meta['description']) {
    results.push(
      `<meta property="og:description" content="${escapeHtml(meta['description'])}">`,
      `<meta name="twitter:description" content="${escapeHtml(meta['description'])}">`,
      `<meta name="${'description'}" content="${escapeHtml(meta['description'])}">`,
    )
  }
  if (meta['keywords']) {
    results.push(
      `<meta name="keywords" content="${escapeHtml((meta['keywords'] as string[]).join(','))}">`,
    )
  }
  if (meta['image']) {
    results.push(
      `<meta name="twitter:image" content="${escapeHtml(meta['image'])}">`,
      `<meta property="og:image" content="${escapeHtml(meta['image'])}">`,
    )
  } else {
    results.push(
      `<meta name="twitter:image" content="https://lcpu.dev/favicon.svg">`,
      `<meta property="og:image" content="https://lcpu.dev/favicon.svg">`,
    )
  }
  if (meta['video']) {
    results.push(`<meta property="og:video" content="${escapeHtml(meta['video'])}">`)
  }

  const slugs = url.substring(1).split('/')
  const BreadcrumbList = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        item: 'https://lcpu.dev/',
        name: '北京大学学生 Linux 俱乐部',
        position: 1,
      },
    ],
  }
  let count = 1
  slugs.forEach((slug) => {
    if (slug === '') {
      return
    }
    count++
    const category = SiteConfiguration.getRouteCategoryTitle(slug)
    BreadcrumbList['itemListElement'].push({
      '@type': 'ListItem',
      item: `${BreadcrumbList['itemListElement'][count - 2]['item']}${slug}/`,
      name: category === undefined || category === slug ? title : category,
      position: count,
    })
  })
  if (url === '/404.html') {
    BreadcrumbList['itemListElement'][1].item = 'https://lcpu.dev/404.html'
    results.push(`<meta name="robots" content="noindex">`)
  }

  results.push(`<script type="application/ld+json">${safeJson(BreadcrumbList)}</script>`)

  if (url === '/') {
    const jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      '@id': 'https://lcpu.dev/',
      name: '北京大学学生 Linux 俱乐部',
      description: `${meta['description']}`,
      inLanguage: 'zh-Hans',
      url: 'https://lcpu.dev/',
      keywords: meta['keywords'],
      publisher: {
        '@type': 'Organization',
        name: '北京大学学生 Linux 俱乐部',
        url: 'https://lcpu.dev/',
      },
      image: 'https://lcpu.dev/favicon.svg',
    }
    results.push(
      `<script type="application/ld+json">${safeJson(jsonLd)}</script>`,
      `<meta property="og:type" content="website">`,
      `<meta name="twitter:card" content="summary">`,
      `<link rel="alternate" type="application/atom+xml" href="/posts.atom" title="北京大学学生 Linux 俱乐部" />`,
      ...Object.keys(RouteTitleRecord).map(
        (routeBase) =>
          `<link rel="alternate" type="application/atom+xml" href="/${routeBase}/posts.atom" title="${RouteTitleRecord[routeBase]} | 北京大学学生 Linux 俱乐部" />`,
      ),
    )
  } else if (sourceUrl && url != '/404.html') {
    const jsonLd: Record<string, string | object | number | undefined> = {
      '@context': 'https://schema.org',
      '@type': 'Article',
      name: title,
      inLanguage: 'zh-Hans',
      url: `https://lcpu.dev${url}`,
      author: author
        ? { '@type': 'Person', name: author }
        : { '@type': 'Organization', name: '北京大学学生 Linux 俱乐部', url: 'https://lcpu.dev/' },
      description: meta['description'] || undefined,
      headline: meta['headline'] || undefined,
      abstract: meta['abstract'] || undefined,
      keywords: meta['keywords'] || undefined,
      image: meta['image'] || 'https://lcpu.dev/favicon.svg',
    }
    if (time) {
      const dateObj = new Date(time)
      const dateIsoString = dateObj.toISOString()
      jsonLd['copyrightYear'] = dateObj.getFullYear()
      jsonLd['dateCreated'] = dateIsoString
      jsonLd['datePublished'] = dateIsoString
      results.push(
        `<meta property="article:published_time" content="${dateIsoString}">`,
        `<meta property="article:modified_time" content="${dateIsoString}">`,
      )
    }

    if (url.substring(1).split('/')[0] !== '') {
      jsonLd['articleSection'] =
        SiteConfiguration.getRouteCategoryTitle(url.substring(1).split('/')[0]) || undefined
    }

    results.push(
      '<meta property="og:type" content="article">',
      '<meta name="twitter:card" content="summary_large_image">',
      `<script type="application/ld+json">${safeJson(jsonLd)}</script>`,
    )
  } else if (slugs[0] in RouteTitleRecord) {
    results.push(
      `<link rel="alternate" type="application/atom+xml" href="/${slugs[0]}/posts.atom" title="${RouteTitleRecord[slugs[0]]} | 北京大学学生 Linux 俱乐部" />`,
    )
  }
  return results
    .map((tag) => tag.replace(/^<(meta|link|script)\b/, '<$1 data-page-meta'))
    .join('\n')
}

export function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (character) => {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[character]!
  })
}

function safeJson(value: unknown): string {
  return JSON.stringify(value).replace(/</g, '\\u003c')
}

/** Keep client navigation metadata identical to the prerendered document. */
export function usePageMetadata(getMetadata: () => SSRContext, getPath: () => string) {
  if (import.meta.env.SSR) {
    Object.assign(useSSRContext()!, getMetadata())
  } else {
    watchEffect(() => {
      const metadata = getMetadata()
      const path = getPath()
      document.title =
        canonicalPath(path) === '/'
          ? '北京大学学生 Linux 俱乐部'
          : `${metadata.titlePrefix ?? 'LCPU'} | ${SiteConfiguration.titleSuffix}`
      const template = document.createElement('template')
      template.innerHTML = renderMeta(metadata, path)
      document.head.querySelectorAll('[data-page-meta]').forEach((element) => element.remove())
      document.head.append(template.content)
    })
  }
}
