export interface PageData {
  time: string
  title: string
  excerpt?: string
  contentUrl: string
  data: { [key: string]: unknown }
}
