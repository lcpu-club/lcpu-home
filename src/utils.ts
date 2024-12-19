export function dateString(rawDate: string | undefined): string {
  if (rawDate == undefined) return ''
  const date = new Date(rawDate)
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  return `${year} 年 ${month} 月 ${day} 日`
}
