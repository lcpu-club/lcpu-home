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
}

const routeTitleRecord: Record<string, string> = {
  news: '新闻',
  activities: '活动',
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
  getRouteCategoryTitle: (routeSegment) => routeTitleRecord[routeSegment] || routeSegment,
  titleSuffix: '北京大学学生 Linux 俱乐部',
  theme: 'normal',
}
