interface SiteConfiguration {
  markdown: {
    container: {
      warningLabel?: string
      errorLabel?: string
      infoLabel?: string
      expanderLabel?: string
    }
  }
  getRouteCategoryTitle: (routeSegment: string) => string
  titleSuffix: string
  theme: 'normal' | 'new-year'
  pureStatic?: boolean
}

export const RouteTitleRecord: Record<string, string> = {
  news: '新闻',
  announcements: '公告',
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
  getRouteCategoryTitle: (routeSegment) => RouteTitleRecord[routeSegment],
  titleSuffix: 'LCPU',
  theme: 'normal',
  pureStatic: true,
}
