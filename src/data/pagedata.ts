export interface PageData {
  time: string
  title: string
  excerpt?: string
  contentUrl: string
  metaDescription?: string
  data: { [key: string]: unknown }
}
