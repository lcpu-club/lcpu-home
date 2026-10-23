import { RouteTitleRecord } from './site'

export function isIndexPage(slugs: string[]): boolean {
  return slugs.length === 1 && slugs[0] in RouteTitleRecord
}

export function dateString(rawDate: string | undefined): string {
  if (rawDate == undefined) return ''
  const date = new Date(rawDate)
  const year = date.getUTCFullYear()
  const month = date.getUTCMonth() + 1
  const day = date.getUTCDate()
  return `${year} 年 ${month} 月 ${day} 日`
}

export function groupByYearMonth<T extends { time: string }>(items: T[]) {
  return items.reduce(
    (
      acc: {
        year: number
        month: number
        items: T[]
      }[],
      item,
    ) => {
      const date = new Date(item.time)
      const year = date.getUTCFullYear()
      const month = date.getUTCMonth() + 1
      if (
        acc.length === 0 ||
        acc[acc.length - 1].year !== year ||
        acc[acc.length - 1].month !== month
      ) {
        acc.push({
          year,
          month,
          items: [item],
        })
        return acc
      }
      acc[acc.length - 1].items.push(item)
      return acc
    },
    [],
  )
}

export function throttleAndDebounce(fn: () => void, delay: number) {
  let timeout: ReturnType<typeof setTimeout> | undefined
  let lastCall = -Infinity
  const wrapped = () => {
    if (timeout) clearTimeout(timeout)
    const remaining = delay - (Date.now() - lastCall)
    if (remaining <= 0) {
      lastCall = Date.now()
      fn()
    } else {
      timeout = setTimeout(() => {
        lastCall = Date.now()
        fn()
      }, remaining)
    }
  }
  wrapped.cancel = () => {
    if (timeout) clearTimeout(timeout)
  }
  return wrapped
}
