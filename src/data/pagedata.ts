export interface PageData {
  time: string
  title: string
  excerpt?: string
  category?: string
  contentUrl: string
  sourceUrl: string
  meta?: {
    description?: string
    keywords?: string[]
    image?: string
    video?: string
    generator?: string
  }
  redirect?: string
  originalUrl?: string
  data: { [key: string]: unknown }
  tags?: string[]
}
