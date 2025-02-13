interface SiteConfiguration {
  markdown: {
    container: {
      warningLabel?: string
      errorLabel?: string
      infoLabel?: string
      expanderLabel?: string
    }
  }
  getRouteCategoryTitle: (routeSegment: string) => string | undefined
  getRootPageTitle: (routeSegment: string) => string | undefined
  titleSuffix: string
  theme: 'normal' | 'new-year'
  pureStatic?: boolean
}

const routeTitleRecord: Record<string, string> = {
  news: '新闻',
  announcements: '公告',
}

const rootPages: Record<string, string> = {
  about: '关于我们',
}

export const SiteConfiguration: SiteConfiguration = {
  markdown: {
    container: {
      warningLabel: '警告',
      errorLabel: '错误',
      infoLabel: '信息',
      expanderLabel: '更多',
    },
  },
  getRouteCategoryTitle: (routeSegment) => routeTitleRecord[routeSegment],
  getRootPageTitle: (routeSegment) => rootPages[routeSegment],
  titleSuffix: 'LCPU',
  theme: 'normal',
  pureStatic: true,
}
