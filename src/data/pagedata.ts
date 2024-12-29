export interface PageData {
  time: string
  title: string
  excerpt?: string
  contentUrl: string
  meta?: { [key: string]: string }
  data?: { [key: string]: unknown }
}
