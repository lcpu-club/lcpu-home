export interface PageData {
  time: string
  title: string
  excerpt?: string
  category?: string
  contentUrl: string
  sourceUrl: string
  meta?: { [key: string]: string }
  data: { [key: string]: unknown }
}
